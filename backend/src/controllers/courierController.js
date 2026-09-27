const pool = require('../config/db');

const handoffToSteadfast = async (req, res, next) => {
  try {
    const { order_id } = req.body;
    const [orders] = await pool.query('SELECT * FROM orders WHERE id = ? LIMIT 1', [order_id]);
    if (orders.length === 0) return res.status(404).json({ success: false, message: 'অর্ডার পাওয়া যায়নি।' });

    const mockConsignmentId = 'SF-' + Date.now().toString().slice(-6);
    const mockTrackingCode = 'STDFST' + Math.floor(100000 + Math.random() * 900000);

    await pool.query(
      `INSERT INTO courier_consignments (order_id, courier_partner, consignment_id, tracking_code, status) VALUES (?, 'steadfast', ?, ?, 'in_transit')
       ON DUPLICATE KEY UPDATE consignment_id = VALUES(consignment_id), tracking_code = VALUES(tracking_code)`,
      [order_id, mockConsignmentId, mockTrackingCode]
    );

    await pool.query('UPDATE orders SET order_status = "handed_over" WHERE id = ?', [order_id]);
    return res.status(200).json({ success: true, consignment: { tracking_code: mockTrackingCode } });
  } catch (error) { next(error); }
};

module.exports = { handoffToSteadfast };
