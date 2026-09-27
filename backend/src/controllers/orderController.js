const pool = require('../config/db');

const createOrder = async (req, res, next) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const { customer_name, customer_phone, delivery_address, delivery_zone, items, payment_method = 'COD', order_note } = req.body;
    if (!customer_name || !customer_phone || !delivery_address || !delivery_zone || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'সকল প্রয়োজনীয় তথ্য প্রদান করুন।' });
    }

    const shippingCharge = delivery_zone === 'inside_dhaka' ? 70 : 130;
    let subtotal = 0;
    const verifiedItems = [];

    for (const item of items) {
      const [rows] = await connection.query('SELECT pv.*, p.title as product_title FROM product_variants pv JOIN products p ON pv.product_id = p.id WHERE pv.id = ? FOR UPDATE', [item.variant_id]);
      if (rows.length === 0) throw new Error('Variant not found');
      const variant = rows[0];
      const itemPrice = variant.sale_price ? Number(variant.sale_price) : Number(variant.regular_price);
      const lineTotal = itemPrice * Number(item.quantity);
      subtotal += lineTotal;
      verifiedItems.push({
        variant_id: variant.id,
        product_title: variant.product_title,
        unit_name: variant.unit_name,
        unit_price: itemPrice,
        quantity: item.quantity,
        total_line_price: lineTotal
      });
      await connection.query('UPDATE product_variants SET stock_quantity = stock_quantity - ? WHERE id = ?', [item.quantity, variant.id]);
    }

    const totalPayable = subtotal + shippingCharge;
    const orderCode = 'GB-' + Date.now().toString().slice(-6);

    const [orderResult] = await connection.query(
      `INSERT INTO orders (order_code, customer_name, customer_phone, delivery_address, delivery_zone, subtotal, shipping_charge, total_payable, payment_method, order_note) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [orderCode, customer_name, customer_phone, delivery_address, delivery_zone, subtotal, shippingCharge, totalPayable, payment_method, order_note || null]
    );

    for (const oi of verifiedItems) {
      await connection.query(
        `INSERT INTO order_items (order_id, product_variant_id, product_title, unit_name, unit_price, quantity, total_line_price) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [orderResult.insertId, oi.variant_id, oi.product_title, oi.unit_name, oi.unit_price, oi.quantity, oi.total_line_price]
      );
    }

    await connection.commit();
    return res.status(201).json({ success: true, order: { order_code: orderCode, total_payable: totalPayable, customer_name, customer_phone, subtotal, shipping_charge: shippingCharge } });
  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
};

const getAdminOrders = async (req, res, next) => {
  try {
    const { status } = req.query;
    let query = 'SELECT * FROM orders WHERE 1=1';
    const params = [];
    if (status && status !== 'all') { query += ' AND order_status = ?'; params.push(status); }
    query += ' ORDER BY id DESC LIMIT 50';
    const [orders] = await pool.query(query, params);
    return res.status(200).json({ success: true, orders });
  } catch (error) { next(error); }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    await pool.query('UPDATE orders SET order_status = ? WHERE id = ?', [req.body.order_status, req.params.id]);
    return res.status(200).json({ success: true, message: 'স্ট্যাটাস আপডেট হয়েছে।' });
  } catch (error) { next(error); }
};

const getOrderDetails = async (req, res, next) => {
  try {
    const [orders] = await pool.query('SELECT * FROM orders WHERE order_code = ? LIMIT 1', [req.params.identifier]);
    if (orders.length === 0) return res.status(404).json({ success: false, message: 'অর্ডার পাওয়া যায়নি।' });
    const [items] = await pool.query('SELECT * FROM order_items WHERE order_id = ?', [orders[0].id]);
    return res.status(200).json({ success: true, order: { ...orders[0], items } });
  } catch (error) { next(error); }
};

module.exports = { createOrder, getAdminOrders, updateOrderStatus, getOrderDetails };
