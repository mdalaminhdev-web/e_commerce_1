import React, { useState } from 'react';
import { Search, ShoppingBag, Truck, Heart, User } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { totalItemCount, subtotal } = useCart();
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
      {/* টপ সার্চ ও ব্র্যান্ড হেডার */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* লোগো */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-10 h-10 rounded-xl bg-brand-primary flex items-center justify-center text-white font-black text-xl shadow-sm">
            ঘ
          </div>
          <div className="leading-tight">
            <span className="text-xl font-black text-slate-900 tracking-tight">
              ঘরের<span className="text-brand-accent">বাজার</span>
            </span>
            <span className="block text-[8px] font-bold text-slate-400 tracking-widest uppercase">Pure & Organic</span>
          </div>
        </Link>

        {/* সেন্ট্রাল সার্চ বক্স ও কার্যকরী বাটন */}
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-xl relative hidden md:block">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="পণ্য সার্চ করুন (মধু, তেল, ঘি, মসলা)..."
            className="w-full bg-[#f8fafc] border border-slate-300 rounded-full py-2.5 px-5 pr-12 text-xs focus:border-brand-accent focus:bg-white outline-none transition-all text-slate-800"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1.5 bottom-1.5 bg-brand-accent hover:bg-brand-primary text-white w-9 rounded-full flex items-center justify-center transition-all shadow-sm"
            title="সার্চ করুন"
          >
            <Search size={15} />
          </button>
        </form>

        {/* অ্যাকশন আইকনগুলো */}
        <div className="flex items-center gap-4 sm:gap-6 text-slate-600">
          <Link to="/admin" className="hidden lg:flex items-center gap-1 text-xs hover:text-brand-accent">
            <Truck size={17} />
            <span>অর্ডার ট্র্যাকিং</span>
          </Link>
          
          <Link to="/checkout" className="flex items-center gap-2 bg-blue-50 border border-brand-border px-3 py-1.5 rounded-full hover:bg-blue-100 transition-all">
            <div className="relative">
              <ShoppingBag size={18} className="text-brand-primary" />
              {totalItemCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-brand-accent text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {totalItemCount}
                </span>
              )}
            </div>
            <span className="text-xs font-bold text-slate-800 hidden sm:inline">৳{subtotal}</span>
          </Link>
        </div>
      </div>

      {/* মোবাইল সার্চ বার (ছোট স্ক্রিনের জন্য) */}
      <div className="px-4 pb-2 md:hidden">
        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="পণ্য খুঁজুন..."
            className="w-full bg-[#f8fafc] border border-slate-300 rounded-full py-2 px-4 pr-10 text-xs focus:border-brand-accent outline-none"
          />
          <button
            type="submit"
            className="absolute right-1 top-1 bottom-1 bg-brand-accent text-white w-8 rounded-full flex items-center justify-center"
          >
            <Search size={13} />
          </button>
        </form>
      </div>

      {/* ক্যাটাগরি মেনু বার */}
      <nav className="bg-brand-primary text-white text-xs font-medium overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-6 py-2.5 whitespace-nowrap">
          <Link to="/" className="text-blue-200 hover:text-white font-bold">হোম</Link>
          <Link to="/?category=natural-honey" className="hover:text-blue-100">খাটি মধু</Link>
          <Link to="/?category=mustard-oil" className="hover:text-blue-100">সরিষার তেল</Link>
          <Link to="/?category=pure-ghee" className="hover:text-blue-100">খাটি ঘি</Link>
          <Link to="/?category=dates-nuts" className="hover:text-blue-100">খেজুর ও বাদাম</Link>
          <Link to="/?category=organic-spices" className="hover:text-blue-100">গুড়া মসলা</Link>
          <Link to="/?category=organic-seeds" className="hover:text-blue-100">অর্গানিক বীজ</Link>
        </div>
      </nav>
    </header>
  );
}