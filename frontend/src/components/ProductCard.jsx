import React, { useState } from 'react';
import { ShoppingBag, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const variants = product.variants || [];
  const [selectedVariant, setSelectedVariant] = useState(variants[0] || null);
  const [added, setAdded] = useState(false);

  const price = selectedVariant?.sale_price ? Number(selectedVariant.sale_price) : Number(selectedVariant?.regular_price || 0);

  const handleAdd = (e) => {
    e.stopPropagation();
    addToCart(product, selectedVariant);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  const handleBuy = (e) => {
    e.stopPropagation();
    addToCart(product, selectedVariant);
    navigate('/checkout');
  };

  return (
    <div className="bg-white border border-brand-border rounded-2xl p-3 flex flex-col justify-between hover:shadow-lg transition-all group">
      <div className="aspect-square rounded-xl bg-slate-50 flex items-center justify-center overflow-hidden">
        <img src={product.thumbnail} alt={product.title} className="object-contain h-full w-full group-hover:scale-105 transition-transform" />
      </div>
      <div className="mt-3">
        <h3 className="text-xs sm:text-sm font-semibold line-clamp-2">{product.title}</h3>
        {variants.length > 1 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {variants.map(v => (
              <button key={v.id} onClick={() => setSelectedVariant(v)} className={`text-[10px] px-2 py-0.5 rounded border ${selectedVariant?.id === v.id ? 'bg-brand-primary text-white border-brand-primary' : 'bg-slate-50 text-slate-600'}`}>
                {v.unit_name}
              </button>
            ))}
          </div>
        )}
        <div className="mt-2 text-base font-black text-brand-primary">৳{price}</div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
        <button onClick={handleAdd} className="text-xs font-semibold py-2 rounded-xl border border-brand-border text-brand-primary hover:bg-brand-light flex items-center justify-center gap-1">
          {added ? <Check size={14} /> : <ShoppingBag size={14} />} {added ? 'যোগ হয়েছে' : 'কার্ট'}
        </button>
        <button onClick={handleBuy} className="bg-brand-accent hover:bg-brand-primary text-white text-xs font-bold py-2 rounded-xl shadow-md">
          অর্ডার করুন
        </button>
      </div>
    </div>
  );
}
