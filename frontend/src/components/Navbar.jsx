import React, { useState } from 'react';
import { Search, ShoppingBag, Phone } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { totalItemCount, subtotal } = useCart();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm border-b border-brand-border">
      <div className="bg-brand-slate text-white text-xs py-1 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Phone size={12} className="text-blue-400" />
            <span>সরাসরি অর্ডার করতে কল করুন: 01700-000000</span>
          </div>
          <div>১০০% নিরাপদ ও খাঁটি অর্গানিক খাদ্য</div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-brand-primary flex items-center justify-center text-white font-black text-xl">ঘ</div>
          <span className="text-xl font-bold tracking-tight text-brand-slate">ঘরের<span className="text-brand-accent">বাজার</span></span>
        </Link>
        <Link to="/checkout" className="flex items-center gap-3 bg-brand-light border border-brand-border px-3.5 py-2 rounded-xl">
          <div className="relative">
            <ShoppingBag className="text-brand-primary" size={20} />
            {totalItemCount > 0 && <span className="absolute -top-2 -right-2 bg-brand-accent text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">{totalItemCount}</span>}
          </div>
          <div className="text-left hidden sm:block">
            <span className="text-[10px] text-gray-500 block leading-tight">কার্ট মোট</span>
            <span className="text-xs font-bold text-brand-slate">৳{subtotal}</span>
          </div>
        </Link>
      </div>
    </header>
  );
}
