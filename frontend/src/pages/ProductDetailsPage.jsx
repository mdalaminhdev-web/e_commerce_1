import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { ShoppingBag, Phone, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductDetailsPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [activeImage, setActiveImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    axios.get(`/api/v1/products/${slug}`)
      .then((res) => {
        const prod = res.data.product;
        setProduct(prod);
        setActiveImage(prod.thumbnail);
        if (prod.variants && prod.variants.length > 0) {
          setSelectedVariant(prod.variants[0]);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return <div className="text-center py-28 text-xs font-semibold text-slate-400">লোড হচ্ছে...</div>;
  }

  if (!product) {
    return <div className="text-center py-28 text-xs font-semibold text-rose-500">পণ্যটি পাওয়া যায়নি!</div>;
  }

  const price = selectedVariant?.sale_price ? Number(selectedVariant.sale_price) : Number(selectedVariant?.regular_price || 0);
  
  // Gallery images mockup/fetch
  const gallery = [
    product.thumbnail,
    'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=600&q=80'
  ];

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product, selectedVariant);
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleBuyNow = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product, selectedVariant);
    }
    navigate('/checkout');
  };

  const handleWhatsAppOrder = () => {
    const text = encodeURIComponent(`হ্যালো, আমি ${product.title} (${selectedVariant?.unit_name || ''}) - ${quantity}টি অর্ডার করতে চাই।`);
    window.open(`https://wa.me/8801700000000?text=${text}`, '_blank');
  };

  const handleCallOrder = () => {
    window.open('tel:01700000000', '_self');
  };

  return (
    <div className="bg-[#FAF9F5] min-h-screen py-6 text-slate-800">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Breadcrumb Navigation */}
        <div className="text-[11px] text-slate-500 mb-4 flex items-center gap-1.5 font-medium">
          <Link to="/" className="hover:text-brand-accent">Home</Link>
          <span>&gt;</span>
          <Link to="/" className="hover:text-brand-accent">Products</Link>
          <span>&gt;</span>
          <span className="text-slate-800 font-semibold">{product.title}</span>
        </div>

        {/* Main Product Card Box */}
        <div className="bg-white border border-[#E9ECEF] rounded-2xl p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-10 shadow-sm">
          
          {/* Left Column: Gallery Thumbnails + Main View */}
          <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4 items-center sm:items-start">
            
            {/* Vertical Thumbnail List */}
            <div className="flex sm:flex-col gap-3 flex-shrink-0">
              {gallery.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-lg border-2 p-1 cursor-pointer transition-all flex items-center justify-center bg-white ${
                    activeImage === img ? 'border-brand-accent shadow-sm' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <img src={img} alt="thumb" className="w-full h-full object-contain" />
                </div>
              ))}
            </div>

            {/* Main Stage Image Frame */}
            <div className="relative flex-1 aspect-square w-full rounded-2xl border border-slate-100 flex items-center justify-center p-6 bg-white overflow-hidden group">
              <img
                src={activeImage}
                alt={product.title}
                className="max-h-[420px] w-full object-contain transition-transform duration-300 group-hover:scale-105"
              />
              {/* Optional Arrow Controls */}
              <button 
                onClick={() => setActiveImage(gallery[0])} 
                className="absolute left-2 text-slate-300 hover:text-slate-600 transition-colors p-1"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={() => setActiveImage(gallery[1] || gallery[0])} 
                className="absolute right-2 text-slate-300 hover:text-slate-600 transition-colors p-1"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* Right Column: Title, Price, Controls, 4 Action Buttons */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              {/* Title */}
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-snug">
                {product.title}
              </h1>

              {/* Price */}
              <div className="mt-3">
                <span className="text-2xl sm:text-3xl font-extrabold text-[#E65100]">
                  ৳{price.toLocaleString('bn-BD')}
                </span>
              </div>

              {/* Variant Selector */}
              {product.variants && product.variants.length > 1 && (
                <div className="mt-5">
                  <span className="text-xs font-bold text-slate-700 block mb-2">ওজন / সাইজ:</span>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariant(v)}
                        className={`text-xs px-3 py-1.5 rounded-lg border font-semibold transition-all ${
                          selectedVariant?.id === v.id
                            ? 'bg-brand-primary text-white border-brand-primary shadow-sm'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {v.unit_name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Stepper */}
              <div className="mt-6 flex items-center gap-4">
                <span className="text-xs font-semibold text-slate-600">Quantity:</span>
                <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-9 h-8 flex items-center justify-center text-slate-500 hover:bg-slate-100 font-bold transition-colors"
                  >
                    -
                  </button>
                  <span className="w-10 text-center text-xs font-bold text-slate-800">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-9 h-8 flex items-center justify-center text-slate-500 hover:bg-slate-100 font-bold transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* 4-Button Action Grid (Screenshot Layout) */}
              <div className="mt-6 space-y-3">
                {/* Row 1: Add To Cart & Buy Now */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleAddToCart}
                    className="bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-bold py-3 px-4 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 active:scale-95"
                  >
                    {added ? <Check size={16} /> : <ShoppingBag size={16} />}
                    <span>{added ? 'ADDED' : 'ADD TO CART'}</span>
                  </button>

                  <button
                    onClick={handleBuyNow}
                    className="bg-[#0B132B] hover:bg-slate-800 text-white text-xs font-bold py-3 px-4 rounded-xl transition-all shadow-sm active:scale-95 uppercase tracking-wider"
                  >
                    BUY NOW
                  </button>
                </div>

                {/* Row 2: WhatsApp & Call */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleWhatsAppOrder}
                    className="bg-[#10B981] hover:bg-[#059669] text-white text-xs font-bold py-3 px-4 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 active:scale-95"
                  >
                    {/* WhatsApp SVG Icon */}
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.842-.981z"/>
                    </svg>
                    <span>Order On WhatsApp</span>
                  </button>

                  <button
                    onClick={handleCallOrder}
                    className="bg-[#1E3A8A] hover:bg-blue-900 text-white text-xs font-bold py-3 px-4 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 active:scale-95"
                  >
                    <Phone size={15} />
                    <span>Call For Order</span>
                  </button>
                </div>
              </div>

              {/* Brand Indicator Box */}
              <div className="mt-6 flex items-center gap-3 border border-slate-200 rounded-xl p-3 bg-slate-50/50 w-fit">
                <span className="text-xs font-bold text-slate-500">Brand:</span>
                <span className="text-xs font-black tracking-widest text-slate-800 uppercase">
                  GHORER BAZAR
                </span>
              </div>
            </div>

            {/* Description Preview */}
            <div className="mt-8 border-t border-slate-100 pt-4 text-xs text-slate-600 leading-relaxed">
              <p>{product.description || '১০০% প্রাকৃতিক ও বিশুদ্ধ উপাদান থেকে প্রস্তুতকৃত।'}</p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}