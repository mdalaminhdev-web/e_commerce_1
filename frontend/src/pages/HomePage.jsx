import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    Promise.all([
      axios.get('/api/v1/categories'),
      axios.get(`/api/v1/products${activeCategory ? `?category=${activeCategory}` : ''}`)
    ]).then(([catRes, prodRes]) => {
      setCategories(catRes.data.categories || []);
      setProducts(prodRes.data.products || []);
    }).catch(console.error);
  }, [activeCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 pb-20">
      <div className="bg-gradient-to-r from-brand-slate to-blue-950 text-white rounded-2xl p-6 sm:p-10 mb-8 shadow-md">
        <h1 className="text-xl sm:text-3xl font-extrabold">সুস্থ জীবনের জন্য খাঁটি অর্গানিক খাদ্য</h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-2">সুন্দরবনের প্রাকৃতিক মধু, কাঠের ঘানির সরিষার তেল ও গাওয়া ঘি।</p>
      </div>

      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4">
        {categories.map(cat => (
          <div key={cat.id} onClick={() => setActiveCategory(activeCategory === cat.slug ? null : cat.slug)} className="flex flex-col items-center cursor-pointer flex-shrink-0">
            <div className={`w-16 h-16 rounded-full border-2 p-0.5 overflow-hidden ${activeCategory === cat.slug ? 'border-brand-accent scale-105' : 'border-slate-200'}`}>
              <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover rounded-full" />
            </div>
            <span className="text-xs mt-1 text-slate-700">{cat.name.split('(')[0]}</span>
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {products.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  );
}
