import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ShoppingBag, Star, ChevronRight, X } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function HomePage() {
  const [allProducts, setAllProducts] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [searchParams] = useSearchParams();

  const searchQuery = searchParams.get('search') || '';
  const categoryFilter = searchParams.get('category') || '';

  // ১. প্রাথমিক ডেটা লোড (সব সময় সব পণ্য ও ক্যাটাগরি আনবে)
  useEffect(() => {
    Promise.all([
      axios.get('/api/v1/categories'),
      axios.get('/api/v1/products')
    ])
      .then(([catRes, prodRes]) => {
        setCategories(catRes.data.categories || []);
        setAllProducts(prodRes.data.products || []);
      })
      .catch((err) => console.error('Failed to load initial data:', err))
      .finally(() => setLoading(false));
  }, []);

  // ২. সার্চ কুয়েরি থাকলে স্পেসিফিক ফিল্টার কল করা
  useEffect(() => {
    if (searchQuery || categoryFilter) {
      const queryParams = [];
      if (searchQuery) queryParams.push(`search=${encodeURIComponent(searchQuery)}`);
      if (categoryFilter) queryParams.push(`category=${encodeURIComponent(categoryFilter)}`);
      
      axios.get(`/api/v1/products?${queryParams.join('&')}`)
        .then((res) => {
          setSearchResults(res.data.products || []);
        })
        .catch((err) => console.error('Search fetch failed:', err));
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, categoryFilter]);

  const handleProductClick = (slug) => {
    navigate(`/product/${slug}`);
  };

  const handleDirectOrder = (e, product, variant) => {
    e.stopPropagation();
    addToCart(product, variant);
    navigate('/checkout');
  };

  // ক্যাটাগরি ভিত্তিক পণ্য বিভাজন
  const honeyProducts = allProducts.filter((p) => p.category_slug === 'natural-honey');
  const oilGheeProducts = allProducts.filter(
    (p) => p.category_slug === 'mustard-oil' || p.category_slug === 'pure-ghee'
  );
  const spicesProducts = allProducts.filter((p) => p.category_slug === 'organic-spices');

  const displayHoney = honeyProducts.length > 0 ? honeyProducts : allProducts.slice(0, 5);
  const displayCooking = oilGheeProducts.length > 0 ? oilGheeProducts : allProducts.slice(0, 5);
  const displaySpices = spicesProducts.length > 0 ? spicesProducts : allProducts.slice(0, 5);

  return (
    <div className="bg-[#FCFBF7] min-h-screen text-slate-800 pb-20">
      
      {/* =========================================================
          SECTION 1: HERO DUAL BANNER GRID
      ========================================================= */}
      <section className="max-w-7xl mx-auto px-3 sm:px-4 pt-3 sm:pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 items-stretch">
          
          {/* Left Wide Hero Banner */}
          <div className="lg:col-span-8 rounded-2xl overflow-hidden relative bg-gradient-to-r from-[#1E3A8A] via-[#1D4ED8] to-[#0F172A] text-white p-6 sm:p-10 flex flex-col justify-center min-h-[220px] sm:min-h-[280px] shadow-sm">
            <div className="max-w-md z-10">
              <span className="bg-white/20 backdrop-blur-sm text-blue-100 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-block mb-3 border border-white/10">
                সব উপাদানে খাঁটি ও অর্গানিক
              </span>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                বিশুদ্ধ খাদ্য, সুস্থ জীবন
              </h1>
              <p className="text-xs sm:text-sm text-blue-100 mt-2 font-medium leading-relaxed">
                সুন্দরবনের খলিসা মধু, কাঠের ঘানির সরিষার তেল এবং পাবনার দানাদার গাওয়া ঘি সরাসরি আপনার ঘরে।
              </p>
              <button
                onClick={() => navigate('/checkout')}
                className="mt-5 bg-brand-accent hover:bg-brand-primary text-white text-xs font-bold py-2.5 px-6 rounded-xl transition-all shadow-md w-fit active:scale-95"
              >
                এখনই অর্ডার করুন
              </button>
            </div>
            <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-cover bg-center opacity-15 pointer-events-none" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80')` }} />
          </div>

          {/* Right Tall Feature Banner */}
          <div className="lg:col-span-4 rounded-2xl overflow-hidden relative bg-gradient-to-br from-[#0F172A] to-[#1E293B] text-white p-6 flex flex-col justify-between shadow-sm min-h-[200px]">
            <div>
              <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest block mb-1">
                বিশেষ আয়োজন
              </span>
              <h3 className="text-lg sm:text-xl font-bold leading-snug">
                খাঁটি সরিষার তেল ও মসলা কম্বো
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                দৈনন্দিন রান্নার সম্পূর্ণ নিরাপদ ও স্বাস্থ্যসম্মত উপাদান।
              </p>
            </div>
            <div className="pt-4 flex items-center justify-between">
              <div className="text-xs">
                <span className="text-slate-400 block text-[10px]">শুরু মাত্র</span>
                <span className="text-base font-black text-amber-400">৳১,১০০</span>
              </div>
              <button
                onClick={() => navigate('/checkout')}
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold py-2 px-4 rounded-lg transition-all"
              >
                অর্ডার দিন
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================
          DYNAMIC SEARCH RESULT BLOCK (সার্চ করলেই কেবল এটি দৃশ্যমান হবে)
      ========================================================= */}
      {(searchQuery || categoryFilter) && (
        <section className="max-w-7xl mx-auto px-3 sm:px-4 mt-8">
          <div className="bg-white border-2 border-brand-accent/30 rounded-2xl p-5 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-base font-black text-slate-900">
                  {searchQuery ? `"${searchQuery}" এর জন্য সার্চ ফলাফল` : 'ক্যাটাগরি অনুযায়ী পণ্য'}
                </h2>
                <span className="text-xs text-slate-500 font-medium">{searchResults.length} টি পণ্য পাওয়া গেছে</span>
              </div>
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-1.5 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-xl transition-all"
              >
                <X size={14} /> ফিল্টার মুছুন
              </button>
            </div>

            {searchResults.length === 0 ? (
              <div className="text-center py-10 text-xs text-slate-400 font-semibold">
                কোনো পণ্য পাওয়া যায়নি! দয়া করে অন্য কোনো নাম দিয়ে সার্চ করুন।
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
                {searchResults.map((p) => {
                  const variant = p.variants?.[0];
                  const price = variant?.sale_price ? Number(variant.sale_price) : Number(variant?.regular_price || p.base_price || 0);

                  return (
                    <div
                      key={p.id}
                      onClick={() => handleProductClick(p.slug)}
                      className="bg-white border border-[#E9ECEF] hover:border-brand-accent rounded-xl p-3 flex flex-col justify-between transition-all group cursor-pointer text-center"
                    >
                      <div className="aspect-square bg-[#F8FAFC] rounded-lg p-2 flex items-center justify-center overflow-hidden mb-2">
                        <img
                          src={p.thumbnail}
                          alt={p.title}
                          className="h-full w-full object-contain group-hover:scale-105 transition-transform duration-200"
                        />
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-slate-800 line-clamp-2 leading-tight group-hover:text-brand-accent">
                          {p.title}
                        </h3>
                        <span className="text-[10px] text-slate-400 block mt-1">
                          {variant?.unit_name || '1 unit'}
                        </span>
                        <div className="text-sm font-black text-brand-primary mt-1.5">৳{price}</div>
                      </div>
                      <div className="mt-3">
                        <button
                          onClick={(e) => handleDirectOrder(e, p, variant)}
                          className="w-full bg-[#f1f5f9] group-hover:bg-brand-accent text-slate-700 group-hover:text-white text-[11px] font-bold py-1.5 rounded-lg transition-all"
                        >
                          অর্ডার করুন
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      )}

      {/* =========================================================
          SECTION 2: POPULAR CATEGORIES (CIRCULAR SLIDER)
      ========================================================= */}
      <section className="max-w-7xl mx-auto px-3 sm:px-4 mt-8 sm:mt-10">
        <div className="text-center mb-4">
          <h2 className="text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-widest">
            Popular Categories
          </h2>
        </div>

        <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto no-scrollbar py-2 justify-start sm:justify-center">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => navigate(`/?category=${cat.slug}`)}
              className="flex flex-col items-center cursor-pointer flex-shrink-0 group"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-slate-200 group-hover:border-brand-accent p-1 bg-white shadow-sm overflow-hidden transition-all duration-200">
                <img
                  src={cat.image_url}
                  alt={cat.name}
                  className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-200"
                />
              </div>
              <span className="text-xs font-semibold text-slate-700 mt-2 text-center max-w-[85px] leading-tight group-hover:text-brand-accent">
                {cat.name.split('(')[0]}
              </span>
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-1.5 mt-3">
          <span className="w-3 h-1 bg-brand-accent rounded-full"></span>
          <span className="w-1.5 h-1 bg-slate-300 rounded-full"></span>
        </div>
      </section>

      {/* =========================================================
          SECTION 3: TOP SELLING PRODUCTS (2x2 HORIZONTAL BIG GRID)
      ========================================================= */}
      <section className="max-w-7xl mx-auto px-3 sm:px-4 mt-10 sm:mt-14">
        <div className="text-center mb-6">
          <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
            Top Selling Products
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {allProducts.slice(0, 4).map((p) => {
            const variant = p.variants?.[0];
            const price = variant?.sale_price ? Number(variant.sale_price) : Number(variant?.regular_price || p.base_price || 0);
            const originalPrice = variant?.sale_price ? Number(variant.regular_price) : null;

            return (
              <div
                key={p.id}
                onClick={() => handleProductClick(p.slug)}
                className="bg-white border border-[#E8ECEF] hover:border-brand-accent rounded-2xl p-4 sm:p-5 flex items-center gap-4 sm:gap-6 shadow-sm hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 bg-[#F8FAFC] rounded-xl p-2 flex items-center justify-center border border-slate-100 overflow-hidden">
                  <img
                    src={p.thumbnail}
                    alt={p.title}
                    className="h-full w-full object-contain group-hover:scale-105 transition-transform duration-200"
                  />
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-800 line-clamp-1 group-hover:text-brand-accent">
                      {p.title}
                    </h3>
                    <span className="text-[11px] text-slate-400 font-medium block mt-0.5">
                      {variant?.unit_name || '500 gm'}
                    </span>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-base sm:text-lg font-black text-brand-primary">
                        ৳{price}
                      </span>
                      {originalPrice && (
                        <span className="text-xs text-slate-400 line-through">
                          ৳{originalPrice}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-3">
                    <button
                      onClick={(e) => handleDirectOrder(e, p, variant)}
                      className="bg-brand-accent hover:bg-brand-primary text-white text-xs font-bold py-2 px-5 rounded-xl transition-all shadow-sm flex items-center gap-1.5 w-fit active:scale-95"
                    >
                      <ShoppingBag size={13} /> অর্ডার করুন
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================
          SECTION 4: OUR BRANDS STRIP
      ========================================================= */}
      <section className="max-w-7xl mx-auto px-3 sm:px-4 mt-10 sm:mt-14">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 flex flex-wrap items-center justify-around gap-6 text-slate-400 font-black text-xs sm:text-sm tracking-widest uppercase">
          <span className="hover:text-slate-700 cursor-pointer transition-colors">HARVEST</span>
          <span className="hover:text-slate-700 cursor-pointer transition-colors">SHUPORI</span>
          <span className="hover:text-slate-700 cursor-pointer transition-colors">JUGNI</span>
          <span className="hover:text-slate-700 cursor-pointer transition-colors">KHAAS FOOD</span>
        </div>
      </section>

      {/* =========================================================
          SECTION 5: ALL NATURAL HONEY (5-COLUMN GRID)
      ========================================================= */}
      <section className="max-w-7xl mx-auto px-3 sm:px-4 mt-12 sm:mt-16">
        <div className="flex items-center justify-between mb-4 border-b border-slate-200 pb-2">
          <h2 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
            All Natural Honey
          </h2>
          <span
            onClick={() => navigate('/?category=natural-honey')}
            className="text-xs font-bold text-brand-accent hover:underline cursor-pointer flex items-center"
          >
            সবগুলো দেখুন <ChevronRight size={14} />
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
          {displayHoney.map((p) => {
            const variant = p.variants?.[0];
            const price = variant?.sale_price ? Number(variant.sale_price) : Number(variant?.regular_price || p.base_price || 0);

            return (
              <div
                key={p.id}
                onClick={() => handleProductClick(p.slug)}
                className="bg-white border border-[#E9ECEF] hover:border-brand-accent rounded-xl p-3 flex flex-col justify-between transition-all group cursor-pointer text-center"
              >
                <div className="aspect-square bg-[#F8FAFC] rounded-lg p-2 flex items-center justify-center overflow-hidden mb-2">
                  <img
                    src={p.thumbnail}
                    alt={p.title}
                    className="h-full w-full object-contain group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-800 line-clamp-2 leading-tight group-hover:text-brand-accent">
                    {p.title}
                  </h3>
                  <span className="text-[10px] text-slate-400 block mt-1">
                    {variant?.unit_name || '500 gm'}
                  </span>
                  <div className="text-sm font-black text-brand-primary mt-1.5">৳{price}</div>
                </div>
                <div className="mt-3">
                  <button
                    onClick={(e) => handleDirectOrder(e, p, variant)}
                    className="w-full bg-[#f1f5f9] group-hover:bg-brand-accent text-slate-700 group-hover:text-white text-[11px] font-bold py-1.5 rounded-lg transition-all"
                  >
                    অর্ডার করুন
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================
          SECTION 6: MIDDLE PROMO BANNER
      ========================================================= */}
      <section className="max-w-7xl mx-auto px-3 sm:px-4 mt-12 sm:mt-16">
        <div className="rounded-2xl overflow-hidden bg-gradient-to-r from-[#0F172A] to-[#1E3A8A] text-white p-8 sm:p-12 text-center shadow-sm relative">
          <span className="text-[10px] font-bold text-blue-300 uppercase tracking-widest block mb-2">
            ১০০% নিরাপদ খাদ্য সরবরাহ
          </span>
          <h3 className="text-xl sm:text-2xl font-black max-w-xl mx-auto leading-tight">
            কেমিক্যাল ও ভেজালমুক্ত প্রাকৃতিক খাদ্যপণ্য সরাসরি আপনার রান্নাঘরে
          </h3>
          <p className="text-xs text-slate-300 mt-2 max-w-md mx-auto">
            আমরা নিশ্চিত করি উৎপাদন পর্যায় থেকে প্যাকেজিং পর্যন্ত শতভাগ পরিচ্ছন্নতা ও গুণগত মান।
          </p>
        </div>
      </section>

      {/* =========================================================
          SECTION 7: COOKING ESSENTIALS (5-COLUMN GRID)
      ========================================================= */}
      <section className="max-w-7xl mx-auto px-3 sm:px-4 mt-12 sm:mt-16">
        <div className="flex items-center justify-between mb-4 border-b border-slate-200 pb-2">
          <h2 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
            Cooking Essentials (তেল ও ঘি)
          </h2>
          <span
            onClick={() => navigate('/?category=mustard-oil')}
            className="text-xs font-bold text-brand-accent hover:underline cursor-pointer flex items-center"
          >
            সবগুলো দেখুন <ChevronRight size={14} />
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
          {displayCooking.map((p) => {
            const variant = p.variants?.[0];
            const price = variant?.sale_price ? Number(variant.sale_price) : Number(variant?.regular_price || p.base_price || 0);

            return (
              <div
                key={p.id}
                onClick={() => handleProductClick(p.slug)}
                className="bg-white border border-[#E9ECEF] hover:border-brand-accent rounded-xl p-3 flex flex-col justify-between transition-all group cursor-pointer text-center"
              >
                <div className="aspect-square bg-[#F8FAFC] rounded-lg p-2 flex items-center justify-center overflow-hidden mb-2">
                  <img
                    src={p.thumbnail}
                    alt={p.title}
                    className="h-full w-full object-contain group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-800 line-clamp-2 leading-tight group-hover:text-brand-accent">
                    {p.title}
                  </h3>
                  <span className="text-[10px] text-slate-400 block mt-1">
                    {variant?.unit_name || '1 Liter'}
                  </span>
                  <div className="text-sm font-black text-brand-primary mt-1.5">৳{price}</div>
                </div>
                <div className="mt-3">
                  <button
                    onClick={(e) => handleDirectOrder(e, p, variant)}
                    className="w-full bg-[#f1f5f9] group-hover:bg-brand-accent text-slate-700 group-hover:text-white text-[11px] font-bold py-1.5 rounded-lg transition-all"
                  >
                    অর্ডার করুন
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================
          SECTION 8: ORGANIC SPICES (5-COLUMN GRID)
      ========================================================= */}
      <section className="max-w-7xl mx-auto px-3 sm:px-4 mt-12 sm:mt-16">
        <div className="flex items-center justify-between mb-4 border-b border-slate-200 pb-2">
          <h2 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
            Organic Spices (খাঁটি গুড়া মসলা)
          </h2>
          <span
            onClick={() => navigate('/?category=organic-spices')}
            className="text-xs font-bold text-brand-accent hover:underline cursor-pointer flex items-center"
          >
            সবগুলো দেখুন <ChevronRight size={14} />
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
          {displaySpices.map((p) => {
            const variant = p.variants?.[0];
            const price = variant?.sale_price ? Number(variant.sale_price) : Number(variant?.regular_price || p.base_price || 0);

            return (
              <div
                key={p.id}
                onClick={() => handleProductClick(p.slug)}
                className="bg-white border border-[#E9ECEF] hover:border-brand-accent rounded-xl p-3 flex flex-col justify-between transition-all group cursor-pointer text-center"
              >
                <div className="aspect-square bg-[#F8FAFC] rounded-lg p-2 flex items-center justify-center overflow-hidden mb-2">
                  <img
                    src={p.thumbnail}
                    alt={p.title}
                    className="h-full w-full object-contain group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-800 line-clamp-2 leading-tight group-hover:text-brand-accent">
                    {p.title}
                  </h3>
                  <span className="text-[10px] text-slate-400 block mt-1">
                    {variant?.unit_name || '250 gm'}
                  </span>
                  <div className="text-sm font-black text-brand-primary mt-1.5">৳{price}</div>
                </div>
                <div className="mt-3">
                  <button
                    onClick={(e) => handleDirectOrder(e, p, variant)}
                    className="w-full bg-[#f1f5f9] group-hover:bg-brand-accent text-slate-700 group-hover:text-white text-[11px] font-bold py-1.5 rounded-lg transition-all"
                  >
                    অর্ডার করুন
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================
          SECTION 9: CUSTOMER REVIEWS
      ========================================================= */}
      <section className="max-w-7xl mx-auto px-3 sm:px-4 mt-14 sm:mt-20">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8">
          <h3 className="text-sm sm:text-base font-bold text-center text-slate-900 mb-6">
            আমাদের সন্তুষ্ট গ্রাহকদের মতামত
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-[#F8FAFC] rounded-xl border border-slate-100">
              <div className="flex text-amber-400 mb-1.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={13} fill="currentColor" />
                ))}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                "সুন্দরবনের খলিসা মধুটা নিয়মিত নিচ্ছি। খাঁটি মধুর আসল স্বাদ পেয়েছি।"
              </p>
              <div className="mt-3 text-[11px] font-bold text-slate-800">- তানভীর আহমেদ, ধানমন্ডি</div>
            </div>

            <div className="p-4 bg-[#F8FAFC] rounded-xl border border-slate-100">
              <div className="flex text-amber-400 mb-1.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={13} fill="currentColor" />
                ))}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                "কাঠের ঘানির সরিষার তেলের ঝাঁঝ এবং ঘ্রাণ সত্যিই অসাধারণ।"
              </p>
              <div className="mt-3 text-[11px] font-bold text-slate-800">- ফারহানা হক, উত্তরা</div>
            </div>

            <div className="p-4 bg-[#F8FAFC] rounded-xl border border-slate-100">
              <div className="flex text-amber-400 mb-1.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={13} fill="currentColor" />
                ))}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                "অর্ডার করার পর মাত্র ২ দিনে ডেলিভারি পেয়েছি। প্যাকেজিং দারুণ ছিল।"
              </p>
              <div className="mt-3 text-[11px] font-bold text-slate-800">- কামরুল হাসান, চট্টগ্রাম</div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          SECTION 10: DETAILED 4-COLUMN FOOTER
      ========================================================= */}
      <footer className="max-w-7xl mx-auto px-3 sm:px-4 mt-16 pt-12 border-t border-slate-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-xs">
          <div>
            <h4 className="font-bold text-slate-900 mb-3">আমাদের সম্পর্কে</h4>
            <p className="text-slate-500 leading-relaxed">
              ঘরের বাজার সুস্থ জীবনের অঙ্গীকার নিয়ে সারাদেশে খাঁটি ও অর্গানিক খাবার সরবরাহ করে আসছে।
            </p>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-3">গ্রাহক সেবা</h4>
            <ul className="space-y-2 text-slate-600">
              <li className="hover:text-brand-accent cursor-pointer">রিটার্ন ও রিফান্ড পলিসি</li>
              <li className="hover:text-brand-accent cursor-pointer">ডেলিভারি সংক্রান্ত নিয়মাবলী</li>
              <li className="hover:text-brand-accent cursor-pointer">গোপনীয়তা নীতিমালা</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-3">জনপ্রিয় ক্যাটাগরি</h4>
            <ul className="space-y-2 text-slate-600">
              <li className="hover:text-brand-accent cursor-pointer">সুন্দরবনের খাঁটি মধু</li>
              <li className="hover:text-brand-accent cursor-pointer">ঘানি ভাঙা সরিষার তেল</li>
              <li className="hover:text-brand-accent cursor-pointer">খাঁটি গাওয়া ঘি</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-3">যোগাযোগ</h4>
            <p className="text-slate-600 leading-relaxed">
              হটলাইন: 01700-000000<br />
              ইমেইল: support@ghorerbazarclone.com<br />
              সকাল ৯:০০ - রাত ১০:০০ (প্রতিদিন)
            </p>
          </div>
        </div>
        <div className="mt-10 py-6 border-t border-slate-200 text-center text-[11px] text-slate-400">
          © {new Date().getFullYear()} ঘরের বাজার। সর্বস্বত্ব সংরক্ষিত।
        </div>
      </footer>

    </div>
  );
}