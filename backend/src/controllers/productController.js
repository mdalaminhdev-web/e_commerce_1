const pool = require('../config/db');

const getProducts = async (req, res, next) => {
  try {
    const { category, search, page = 1, limit = 12 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    let query = `SELECT p.*, c.name AS category_name, c.slug AS category_slug FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.is_active = TRUE`;
    const params = [];
    if (category) { query += ' AND c.slug = ?'; params.push(category); }
    if (search) { query += ' AND (p.title LIKE ? OR p.short_description LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }
    query += ' ORDER BY p.id DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), Number(offset));

    const [products] = await pool.query(query, params);
    if (products.length === 0) return res.status(200).json({ success: true, products: [] });

    const productIds = products.map(p => p.id);
    const [variants] = await pool.query('SELECT * FROM product_variants WHERE product_id IN (?) ORDER BY sale_price ASC', [productIds]);

    const enriched = products.map(p => {
      const pVariants = variants.filter(v => v.product_id === p.id);
      const base = pVariants[0] || null;
      return {
        ...p,
        base_price: base ? (base.sale_price || base.regular_price) : 0,
        regular_price: base ? base.regular_price : 0,
        unit_name: base ? base.unit_name : '',
        variants: pVariants
      };
    });
    return res.status(200).json({ success: true, products: enriched });
  } catch (error) { next(error); }
};

const getProductBySlug = async (req, res, next) => {
  try {
    const [products] = await pool.query('SELECT * FROM products WHERE slug = ? AND is_active = TRUE LIMIT 1', [req.params.slug]);
    if (products.length === 0) return res.status(404).json({ success: false, message: 'পণ্যটি পাওয়া যায়নি।' });
    const [variants] = await pool.query('SELECT * FROM product_variants WHERE product_id = ?', [products[0].id]);
    return res.status(200).json({ success: true, product: { ...products[0], variants } });
  } catch (error) { next(error); }
};

const getCategories = async (req, res, next) => {
  try {
    const [categories] = await pool.query('SELECT * FROM categories WHERE is_active = TRUE ORDER BY id ASC');
    return res.status(200).json({ success: true, categories });
  } catch (error) { next(error); }
};

module.exports = { getProducts, getProductBySlug, getCategories };
