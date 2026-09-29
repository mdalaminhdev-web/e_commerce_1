import React, { useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const variants = product.variants || [];
  const [selectedVariant, setSelectedVariant] = useState(variants[0] || null);

  const price = selectedVariant?.sale_price ? Number(selectedVariant.sale_price) : Number(selectedVariant?.regular_price || 0);
  const regularPrice = selectedVariant?.sale_price ? Number(selectedVariant.regular_price) : null;
  const discountPercent = regularPrice ? Math.round(((regularPrice - price) / regularPrice) * 100) : null;

  const handleGoToDetails = () => {
    navigate(`/product/${product.slug}`);
  };

  const handleOrderNow = (e) => {
    e.stopPropagation();
    addToCart(product, selectedVariant);
    navigate('/checkout');
  };

  return (
    <div
      onClick={handleGoToDetails}
      className="bg-white border border-[#E8ECEF] hover:border-brand-accent rounded-xl p-3 flex flex-col justify-between transition-all duration-200 group text-center cursor-pointer relative"
    >
      {/* Product Image Frame */}
      <div className="relative aspect-square rounded-lg bg-slate-50 flex items-center justify-center overflow-hidden mb-2">
        {discountPercent && (
          <span className="absolute top-2 right-2 bg-rose-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm z-10">
            {discountPercent}% OFF
          </span>
        )}
        <img
          src={product.thumbnail}
          alt={product.title}
          className="object-contain h-full w-full group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>

      {/* Info Section */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-xs font-semibold text-slate-800 line-clamp-2 leading-tight group-hover:text-brand-accent transition-colors">
            {product.title}
          </h3>

          <div className="text-[10px] text-slate-500 mt-1 font-medium">
            {selectedVariant?.unit_name || '500 gm'}
          </div>
        </div>

        {/* Price */}
        <div className="mt-2 flex items-baseline justify-center gap-1.5">
          <span className="text-sm font-black text-brand-primary">৳{price}</span>
          {regularPrice && (
            <span className="text-[11px] text-slate-400 line-through">৳{regularPrice}</span>
          )}
        </div>
      </div>

      {/* Full-width Order Button (Ghorer Bazar Exact Style) */}
      <div className="mt-3">
        <button
          onClick={handleOrderNow}
          className="w-full bg-[#f0f4f9] group-hover:bg-brand-accent text-slate-700 group-hover:text-white border border-slate-200 group-hover:border-brand-accent text-[11px] font-bold py-1.5 rounded-lg transition-all flex items-center justify-center gap-1"
        >
          <ShoppingBag size={12} /> অর্ডার করুন
        </button>
      </div>
    </div>
  );
}