import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import MobileBottomNav from './components/MobileBottomNav';
import HomePage from './pages/HomePage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import OrderManagement from './pages/admin/OrderManagement';

export default function App() {
  return (
    <CartProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/order-success/:orderCode" element={<OrderSuccessPage />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/orders" element={<OrderManagement />} />
            </Routes>
          </main>
          <MobileBottomNav />
        </div>
      </Router>
    </CartProvider>
  );
}
