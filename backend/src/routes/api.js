const express = require('express');
const router = express.Router();
const { verifyToken, requireAdmin } = require('../middlewares/authMiddleware');
const { sendOtp, verifyOtp, adminLogin } = require('../controllers/authController');
const { getProducts, getProductBySlug, getCategories } = require('../controllers/productController');
const { createOrder, getAdminOrders, updateOrderStatus, getOrderDetails } = require('../controllers/orderController');
const { handoffToSteadfast } = require('../controllers/courierController');

router.post('/auth/send-otp', sendOtp);
router.post('/auth/verify-otp', verifyOtp);
router.post('/auth/admin-login', adminLogin);

router.get('/products', getProducts);
router.get('/products/:slug', getProductBySlug);
router.get('/categories', getCategories);

router.post('/orders/checkout', createOrder);
router.get('/orders/:identifier', getOrderDetails);

router.get('/admin/orders', verifyToken, requireAdmin, getAdminOrders);
router.patch('/admin/orders/:id/status', verifyToken, requireAdmin, updateOrderStatus);
router.post('/admin/courier/steadfast', verifyToken, requireAdmin, handoffToSteadfast);

module.exports = router;
