import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle2 } from 'lucide-react';

export default function OrderSuccessPage() {
  const { orderCode } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    axios.get(`/api/v1/orders/${orderCode}`).then(r => setOrder(r.data.order)).catch(console.error);
  }, [orderCode]);

  if (!order) return <div className="text-center py-20 text-xs">লোড হচ্ছে...</div>;

  return (
    <div className="max-w-md mx-auto px-4 py-16 text-center">
      <div className="bg-white border border-brand-border p-6 rounded-2xl shadow-sm">
        <CheckCircle2 size={48} className="mx-auto text-emerald-500 mb-2" />
        <h1 className="text-lg font-bold">অর্ডার সফলভাবে গৃহীত হয়েছে!</h1>
        <p className="text-xs text-gray-500 mt-1">অর্ডার কোড: <strong className="font-mono text-brand-primary">{order.order_code}</strong></p>
        <div className="text-left text-xs bg-slate-50 p-4 rounded-xl mt-4 space-y-1">
          <div>গ্রাহক: {order.customer_name}</div>
          <div>ফোন: {order.customer_phone}</div>
          <div>ঠিকানা: {order.delivery_address}</div>
          <div className="font-bold text-brand-primary pt-2">মোট প্রদেয়: ৳{order.total_payable} (COD)</div>
        </div>
        <Link to="/" className="mt-6 inline-block bg-brand-primary text-white text-xs font-semibold px-6 py-2.5 rounded-xl">হোমপেজে ফিরুন</Link>
      </div>
    </div>
  );
}
