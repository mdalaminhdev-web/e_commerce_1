import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('bd_organic_admin_token') || 'mock';
    axios.get('/api/v1/admin/orders', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => setOrders(r.data.orders || []))
      .catch(console.error);
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">অ্যাডমিন ড্যাশবোর্ড</h1>
        <Link to="/admin/orders" className="text-xs font-bold text-brand-primary hover:underline">অর্ডার তালিকা দেখুন →</Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-brand-border">
          <span className="text-xs text-gray-500">মোট অর্ডার</span>
          <h3 className="text-lg font-bold">{orders.length} টি</h3>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-brand-border">
          <span className="text-xs text-gray-500">মোট সেলস</span>
          <h3 className="text-lg font-bold text-brand-primary">৳{orders.reduce((s, o) => s + Number(o.total_payable || 0), 0)}</h3>
        </div>
      </div>
    </div>
  );
}
