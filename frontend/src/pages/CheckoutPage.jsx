import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import axios from 'axios';

export default function CheckoutPage() {
  const { cartItems, deliveryZone, setDeliveryZone, shippingCharge, subtotal, totalPayable, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ customer_name: '', customer_phone: '', delivery_address: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return alert('কার্ট খালি');
    try {
      setLoading(true);
      const res = await axios.post('/api/v1/orders/checkout', {
        ...form,
        delivery_zone: deliveryZone,
        items: cartItems.map(i => ({ variant_id: i.variant_id, quantity: i.quantity }))
      });
      clearCart();
      navigate(`/order-success/${res.data.order.order_code}`);
    } catch (err) {
      alert(err.response?.data?.message || 'অর্ডার হয়নি');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-24">
      <h1 className="text-xl font-bold mb-6 text-center">এক পেজে ক্যাশ অন ডেলিভারি চেকআউট</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <form onSubmit={handleSubmit} className="bg-white border border-brand-border p-5 rounded-2xl space-y-4">
          <input required placeholder="আপনার নাম" className="w-full bg-slate-50 border p-2.5 rounded-xl text-xs" value={form.customer_name} onChange={e => setForm({...form, customer_name: e.target.value})} />
          <input required placeholder="১১ ডিজিটের মোবাইল নম্বর" className="w-full bg-slate-50 border p-2.5 rounded-xl text-xs" value={form.customer_phone} onChange={e => setForm({...form, customer_phone: e.target.value})} />
          <textarea required placeholder="সম্পূর্ণ ঠিকানা" className="w-full bg-slate-50 border p-2.5 rounded-xl text-xs" rows={2} value={form.delivery_address} onChange={e => setForm({...form, delivery_address: e.target.value})} />
          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={() => setDeliveryZone('inside_dhaka')} className={`p-2.5 border rounded-xl text-xs ${deliveryZone === 'inside_dhaka' ? 'border-brand-accent bg-blue-50 font-bold' : ''}`}>ঢাকার ভিতরে (৳৭০)</button>
            <button type="button" onClick={() => setDeliveryZone('outside_dhaka')} className={`p-2.5 border rounded-xl text-xs ${deliveryZone === 'outside_dhaka' ? 'border-brand-accent bg-blue-50 font-bold' : ''}`}>ঢাকার বাইরে (৳১৩০)</button>
          </div>
          <button disabled={loading} className="w-full bg-brand-accent text-white py-3 rounded-xl font-bold text-xs shadow-md">
            {loading ? 'প্রসেস হচ্ছে...' : `৳${totalPayable} অর্ডার নিশ্চিত করুন`}
          </button>
        </form>

        <div className="bg-white border border-brand-border p-5 rounded-2xl h-fit">
          <h2 className="text-xs font-bold mb-3">কার্টের সারাংশ ({cartItems.length})</h2>
          <div className="divide-y text-xs">
            {cartItems.map(i => (
              <div key={i.variant_id} className="py-2 flex justify-between">
                <span>{i.title} ({i.unit_name}) × {i.quantity}</span>
                <span className="font-bold">৳{i.price * i.quantity}</span>
              </div>
            ))}
          </div>
          <div className="border-t mt-4 pt-3 text-xs space-y-1">
            <div className="flex justify-between"><span>সাবটোটাল</span><span>৳{subtotal}</span></div>
            <div className="flex justify-between"><span>ডেলিভারি চার্জ</span><span>৳{shippingCharge}</span></div>
            <div className="flex justify-between text-sm font-black text-brand-primary pt-2"><span>মোট</span><span>৳{totalPayable}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
