import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import MobileBottomNav from './components/MobileBottomNav';
import HomePage from './pages/HomePage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import OrderManagement from './pages/admin/OrderManagement';

// লেআউট হ্যান্ডলার: যাতে অ্যাডমিন পেজে দোকানের ন্যাভবার ও ফুটার না আসে
function AppLayout() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className={`min-h-screen flex flex-col ${isAdminRoute ? 'bg-[#F4F5F9]' : 'bg-[#FAF9F5]'}`}>
      {/* শুধুমাত্র কাস্টমার পেজগুলোতে ন্যাভবার দেখাবে, অ্যাডমিনে নয় */}
      {!isAdminRoute && <Navbar />}

      <main className="flex-1">
        <Routes>
          {/* Storefront Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:slug" element={<ProductDetailsPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-success/:orderCode" element={<OrderSuccessPage />} />

          {/* Admin Backoffice Routes (Standalone Screens) */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/orders" element={<OrderManagement />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* মোবাইল বটম বারও অ্যাডমিন পেজে হাইড থাকবে */}
      {!isAdminRoute && <MobileBottomNav />}
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <Router>
        <AppLayout />
      </Router>
    </CartProvider>
  );
}