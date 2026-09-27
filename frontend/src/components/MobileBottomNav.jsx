import React from 'react';
import { Home, ShoppingBag, ShieldCheck } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function MobileBottomNav() {
  const { totalItemCount } = useCart();
  const location = useLocation();
  const isActive = (p) => location.pathname === p;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-brand-border py-2 px-6 flex justify-around items-center z-50">
      <Link to="/" className={`flex flex-col items-center gap-1 ${isActive('/') ? 'text-brand-accent' : 'text-slate-500'}`}>
        <Home size={20} /><span className="text-[10px]">হোম</span>
      </Link>
      <Link to="/checkout" className={`flex flex-col items-center gap-1 relative ${isActive('/checkout') ? 'text-brand-accent' : 'text-slate-500'}`}>
        <ShoppingBag size={20} />
        {totalItemCount > 0 && <span className="absolute -top-1 -right-2 bg-brand-accent text-white text-[9px] font-black rounded-full h-4 w-4 flex items-center justify-center">{totalItemCount}</span>}
        <span className="text-[10px]">অর্ডার</span>
      </Link>
      <Link to="/admin" className={`flex flex-col items-center gap-1 ${isActive('/admin') ? 'text-brand-accent' : 'text-slate-500'}`}>
        <ShieldCheck size={20} /><span className="text-[10px]">অ্যাডমিন</span>
      </Link>
    </div>
  );
}
