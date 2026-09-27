const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const otpStore = new Map();

const sendOtp = async (req, res, next) => {
  try {
    const { phone } = req.body;
    if (!phone || !/^01[3-9]\d{8}$/.test(phone)) {
      return res.status(400).json({ success: false, message: 'সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন।' });
    }
    const generatedOtp = process.env.NODE_ENV === 'production' ? Math.floor(1000 + Math.random() * 9000).toString() : '1234';
    otpStore.set(phone, { otp: generatedOtp, expiresAt: Date.now() + 5 * 60 * 1000 });
    return res.status(200).json({ success: true, message: 'ওটিপি কোড পাঠানো হয়েছে।' });
  } catch (error) { next(error); }
};

const verifyOtp = async (req, res, next) => {
  try {
    const { phone, otp, name } = req.body;
    const cachedData = otpStore.get(phone);
    if (!cachedData || cachedData.otp !== otp || Date.now() > cachedData.expiresAt) {
      return res.status(400).json({ success: false, message: 'ওটিপি সঠিক নয় অথবা মেয়াদোত্তীর্ণ।' });
    }
    otpStore.delete(phone);
    const [existingUsers] = await pool.query('SELECT id, name, phone, email, role FROM users WHERE phone = ? LIMIT 1', [phone]);
    let user;
    if (existingUsers.length > 0) {
      user = existingUsers[0];
    } else {
      const [ins] = await pool.query('INSERT INTO users (name, phone, role, is_verified) VALUES (?, ?, "customer", TRUE)', [name || `Customer-${phone.slice(-4)}`, phone]);
      user = { id: ins.insertId, name: name || 'Customer', phone, role: 'customer' };
    }
    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    return res.status(200).json({ success: true, token, user });
  } catch (error) { next(error); }
};

const adminLogin = async (req, res, next) => {
  try {
    const { identifier, password } = req.body;
    const [rows] = await pool.query('SELECT * FROM users WHERE (phone = ? OR email = ?) AND role IN ("admin", "moderator") LIMIT 1', [identifier, identifier]);
    if (rows.length === 0) return res.status(401).json({ success: false, message: 'অ্যাডমিন অ্যাকাউন্ট পাওয়া যায়নি।' });
    const adminUser = rows[0];
    const isMatch = await bcrypt.compare(password, adminUser.password_hash);
    if (!isMatch) return res.status(401).json({ success: false, message: 'ভুল পাসওয়ার্ড।' });
    const token = jwt.sign({ userId: adminUser.id, role: adminUser.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    delete adminUser.password_hash;
    return res.status(200).json({ success: true, token, admin: adminUser });
  } catch (error) { next(error); }
};

module.exports = { sendOtp, verifyOtp, adminLogin };
