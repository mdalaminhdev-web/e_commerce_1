import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem('bd_organic_admin_token') || 'mock';

  const loadOrders = () => {
    axios.get('/api/v1/admin/orders', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => setOrders(r.data.orders || []))
      .catch(console.error);
  };

  useEffect(() => { loadOrders(); }, []);

  const handleCourier = (id) => {
    axios.post('/api/v1/admin/courier/steadfast', { order_id: id }, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => { alert('কুরিয়ার ট্র্যাকিং: ' + r.data.consignment.tracking_code); loadOrders(); })
      .catch(err => alert(err.response?.data?.message || 'Error'));
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-xl font-bold mb-4">অর্ডার ম্যানেজমেন্ট</h1>
      <div className="bg-white border rounded-2xl overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="p-3">অর্ডার কোড</th>
              <th className="p-3">গ্রাহক</th>
              <th className="p-3">ঠিকানা</th>
              <th className="p-3">টাকা</th>
              <th className="p-3">স্ট্যাটাস</th>
              <th className="p-3">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {orders.map(o => (
              <tr key={o.id}>
                <td className="p-3 font-mono font-bold text-brand-primary">{o.order_code}</td>
                <td className="p-3">{o.customer_name} ({o.customer_phone})</td>
                <td className="p-3">{o.delivery_address}</td>
                <td className="p-3 font-bold">৳{o.total_payable}</td>
                <td className="p-3">{o.order_status}</td>
                <td className="p-3">
                  <button onClick={() => handleCourier(o.id)} className="bg-brand-accent text-white px-2.5 py-1 rounded text-[10px]">Steadfast-এ পাঠান</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
