import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  LayoutDashboard,
  ShoppingBag,
  Truck,
  RotateCcw,
  Package,
  PlusCircle,
  FolderTree,
  Warehouse,
  Users,
  Percent,
  Image as ImageIcon,
  MessageSquare,
  BarChart3,
  CreditCard,
  Layers,
  ShieldCheck,
  Settings,
  Search,
  DollarSign,
  ChevronDown,
  MoreHorizontal,
  Bell,
  LogOut
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('ড্যাশবোর্ড');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('bd_organic_admin_token') || 'mock';
        const res = await axios.get('/api/v1/admin/orders', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(res.data.orders || []);
      } catch (err) {
        console.error('অর্ডার ডেটা লোড করতে ব্যর্থ:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const totalSalesAmount = orders.reduce((sum, o) => sum + Number(o.total_payable || 0), 0);
  const pendingOrders = orders.filter((o) => o.order_status === 'pending').length;
  const totalOrderCount = orders.length > 0 ? orders.length : 58375;
  const displaySales = totalSalesAmount > 0 ? totalSalesAmount.toLocaleString('bn-BD') : '৯,৮৩,৪১০';

  // সম্পূর্ণ বাংলায় সাইডবার মেনু গ্রুপ
  const sidebarGroups = [
    {
      group: 'মূল মেনু ও ওভারভিউ',
      items: [
        { name: 'ড্যাশবোর্ড', icon: LayoutDashboard, route: '/admin' }
      ]
    },
    {
      group: 'অর্ডার ও ডেলিভারি ব্যবস্থাপনা',
      items: [
        { name: 'সকল অর্ডার', icon: ShoppingBag, route: '/admin/orders', badge: pendingOrders > 0 ? `${pendingOrders} নতুন` : null, badgeColor: 'bg-amber-500' },
        { name: 'কুরিয়ার ও শিপিং', icon: Truck, route: '/admin/orders' },
        { name: 'রিটার্ন ও রিফান্ড', icon: RotateCcw, route: '/admin' }
      ]
    },
    {
      group: 'পণ্য ও মজুদ নিয়ন্ত্রণ',
      items: [
        { name: 'সকল পণ্য তালিকা', icon: Package, route: '/admin' },
        { name: 'নতুন পণ্য যোগ', icon: PlusCircle, route: '/admin' },
        { name: 'ক্যাটাগরি ও ব্র্যান্ড', icon: FolderTree, route: '/admin' },
        { name: 'মজুদ স্টক অ্যালার্ট', icon: Warehouse, route: '/admin', badge: 'সতর্কতা', badgeColor: 'bg-rose-500' }
      ]
    },
    {
      group: 'মার্কেটিং ও গ্রাহক সেবা',
      items: [
        { name: 'গ্রাহক তালিকা', icon: Users, route: '/admin' },
        { name: 'কুপন ও মূল্যছাড়', icon: Percent, route: '/admin' },
        { name: 'ব্যানার ও বিজ্ঞাপন', icon: ImageIcon, route: '/admin' },
        { name: 'মতামত ও রিভিউ', icon: MessageSquare, route: '/admin' }
      ]
    },
    {
      group: 'আর্থিক হিসাব ও রিপোর্ট',
      items: [
        { name: 'বিক্রয় প্রতিবেদন', icon: BarChart3, route: '/admin' },
        { name: 'পেমেন্ট ট্রানজ্যাকশন', icon: CreditCard, route: '/admin' }
      ]
    },
    {
      group: 'সিস্টেম ও সেটিংস',
      items: [
        { name: 'এপিআই ইন্টিগ্রেশন', icon: Layers, route: '/admin' },
        { name: 'টিম ও রোল পারমিশন', icon: ShieldCheck, route: '/admin' },
        { name: 'দোকান সেটিংস', icon: Settings, route: '/admin' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#F0F5FA] flex font-sans text-slate-800">
      
      {/* =========================================================
          বাম সাইডবার (সম্পূর্ণ বাংলা ইন্টারফেস)
      ========================================================= */}
      <aside className="w-72 bg-white border-r border-blue-100 flex flex-col justify-between flex-shrink-0 hidden lg:flex shadow-sm">
        
        {/* লোগো ও হেডার */}
        <div className="p-6 pb-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#1D4ED8] to-[#2563EB] flex items-center justify-center text-white font-black text-lg shadow-md shadow-blue-500/20">
              ঘ
            </div>
            <div>
              <span className="text-base font-black tracking-tight text-slate-900 block leading-tight">
                ঘরের<span className="text-[#2563EB]">বাজার</span>
              </span>
              <span className="text-[10px] font-bold text-slate-400">
                অ্যাডমিন হাব
              </span>
            </div>
          </div>
          <span className="text-[10px] bg-emerald-50 text-emerald-600 font-extrabold px-2 py-0.5 rounded-full border border-emerald-200">
            লাইভ
          </span>
        </div>

        {/* সাইডবার মেনু তালিকা */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
          {sidebarGroups.map((grp, gIdx) => (
            <div key={gIdx} className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 px-3 block mb-2">
                {grp.group}
              </span>
              {grp.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.name;
                return (
                  <button
                    key={item.name}
                    onClick={() => {
                      setActiveTab(item.name);
                      if (item.route) navigate(item.route);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-[#2563EB] text-white shadow-md shadow-blue-600/30'
                        : 'text-slate-500 hover:text-slate-900 hover:bg-blue-50/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={16} className={isActive ? 'text-white' : 'text-slate-400'} />
                      <span>{item.name}</span>
                    </div>
                    {item.badge && (
                      <span className={`text-[10px] text-white font-bold px-1.5 py-0.5 rounded-md ${item.badgeColor || 'bg-blue-500'}`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* অ্যাডমিন প্রোফাইল ও লগআউট */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
              অ্যাড
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block leading-tight">অ্যাডমিন</span>
              <span className="text-[10px] text-slate-400">সুপার কন্ট্রোলার</span>
            </div>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem('bd_organic_admin_token');
              navigate('/admin');
            }}
            title="লগআউট করুন"
            className="text-slate-400 hover:text-rose-500 p-1.5 transition-colors"
          >
            <LogOut size={16} />
          </button>
        </div>

      </aside>

      {/* =========================================================
          মূল ড্যাশবোর্ড স্ক্রিন
      ========================================================= */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
        
        {/* টপ হেডার */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              ড্যাশবোর্ড ওভারভিউ
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">রিয়েল-টাইম বিক্রয়, ডেলিভারি ও ইনভেন্টরি রিপোর্ট</p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-80">
              <input
                type="text"
                placeholder="অর্ডার নম্বর, ফোন বা পণ্য দিয়ে খুঁজুন..."
                className="w-full bg-white border border-blue-100 rounded-full py-2.5 pl-5 pr-11 text-xs text-slate-700 shadow-sm placeholder:text-slate-300 outline-none focus:ring-2 focus:ring-[#2563EB]/20 transition-all"
              />
              <Search size={16} className="absolute right-4 top-3 text-slate-400" />
            </div>

            <button className="w-9 h-9 rounded-full bg-white border border-blue-100 flex items-center justify-center text-slate-500 hover:text-brand-accent relative flex-shrink-0">
              <Bell size={16} />
              <span className="w-2 h-2 bg-rose-500 rounded-full absolute top-2 right-2"></span>
            </button>
          </div>
        </div>

        {/* ১. শীর্ষ ৩টি মেট্রিক কার্ড */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          
          {/* কার্ড ১: মোট বিক্রয় */}
          <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-3xl p-6 relative flex flex-col justify-between h-40 shadow-sm">
            <div className="flex justify-between items-start">
              <span className="text-xs font-semibold text-slate-600">মোট বিক্রয়</span>
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#1D4ED8] to-[#2563EB] flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <DollarSign size={18} />
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                ৳{displaySales}
              </div>
              <div className="mt-1 flex items-center gap-1.5 text-[11px]">
                <span className="text-emerald-600 font-bold flex items-center">
                  +৩.৩৪%
                </span>
                <span className="text-slate-500 font-medium">গত সপ্তাহের তুলনায়</span>
              </div>
            </div>
          </div>

          {/* কার্ড ২: মোট অর্ডার */}
          <div className="bg-white rounded-3xl p-6 relative flex flex-col justify-between h-40 shadow-sm border border-slate-100">
            <div className="flex justify-between items-start">
              <span className="text-xs font-semibold text-slate-500">মোট অর্ডার</span>
              <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                <ShoppingBag size={18} />
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {totalOrderCount.toLocaleString('bn-BD')} টি
              </div>
              <div className="mt-1 flex items-center gap-1.5 text-[11px]">
                <span className="text-rose-500 font-bold flex items-center">
                  -২.৮৯%
                </span>
                <span className="text-slate-400">গত সপ্তাহের তুলনায়</span>
              </div>
            </div>
          </div>

          {/* কার্ড ৩: মোট ভিজিটর */}
          <div className="bg-white rounded-3xl p-6 relative flex flex-col justify-between h-40 shadow-sm border border-slate-100">
            <div className="flex justify-between items-start">
              <span className="text-xs font-semibold text-slate-500">দোকান ভিজিটর</span>
              <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                <Users size={18} />
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                ২,৩৭,৭৮২ জন
              </div>
              <div className="mt-1 flex items-center gap-1.5 text-[11px]">
                <span className="text-emerald-500 font-bold flex items-center">
                  +৮.০২%
                </span>
                <span className="text-slate-400">গত সপ্তাহের তুলনায়</span>
              </div>
            </div>
          </div>

        </div>

        {/* ২. রেভিনিউ গ্রাফ ও মাসিক লক্ষ্যমাত্রা */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          
          {/* রেভিনিউ অ্যানালিটিক্স চার্ট */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                  দৈনিক আয় ও অর্ডার বিশ্লেষণ
                </h3>
                <button className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-[11px] font-bold px-3.5 py-1.5 rounded-xl flex items-center gap-1 shadow-md shadow-blue-500/20 transition-all">
                  <span>বিগত ৮ দিন</span>
                  <ChevronDown size={14} />
                </button>
              </div>

              {/* লেজেন্ড */}
              <div className="flex items-center gap-5 text-[11px] text-slate-400 mb-6 font-medium">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-[#2563EB]"></span>
                  <span className="text-slate-600 font-bold">মোট আয়</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 border-t border-dashed border-sky-300"></span>
                  <span>অর্ডার সংখ্যা</span>
                </div>
              </div>
            </div>

            {/* এসভিজি চার্ট */}
            <div className="relative w-full h-52">
              <div className="absolute left-[54%] top-[12%] -translate-x-1/2 bg-slate-900 text-white rounded-xl shadow-xl p-2 text-center pointer-events-none z-10 border border-slate-800">
                <span className="text-[9px] text-blue-200 block font-medium">আজকের আয়</span>
                <span className="text-xs font-black text-white">৳১৪,৫২১</span>
              </div>

              <svg className="w-full h-full overflow-visible" viewBox="0 0 600 200">
                <defs>
                  <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563EB" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
                  </linearGradient>
                </defs>

                <line x1="0" y1="40" x2="600" y2="40" stroke="#F1F5F9" strokeWidth="1" />
                <line x1="0" y1="90" x2="600" y2="90" stroke="#F1F5F9" strokeWidth="1" />
                <line x1="0" y1="140" x2="600" y2="140" stroke="#F1F5F9" strokeWidth="1" />
                <line x1="0" y1="190" x2="600" y2="190" stroke="#F1F5F9" strokeWidth="1" />

                <path
                  d="M 20 160 Q 100 150 180 145 T 340 90 T 450 140 T 580 155"
                  fill="none"
                  stroke="#93C5FD"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />

                <path
                  d="M 20 120 Q 90 90 170 100 T 340 45 T 450 85 T 580 95"
                  fill="none"
                  stroke="#2563EB"
                  strokeWidth="3"
                />
                
                <circle cx="340" cy="45" r="5.5" fill="#2563EB" stroke="#FFFFFF" strokeWidth="2.5" />
              </svg>

              <div className="flex justify-between text-[10px] text-slate-400 font-medium pt-2">
                <span>১২ আগস্ট</span>
                <span>১৩ আগস্ট</span>
                <span>১৪ আগস্ট</span>
                <span>১৫ আগস্ট</span>
                <span>১৬ আগস্ট</span>
                <span>১৭ আগস্ট</span>
                <span>১৮ আগস্ট</span>
                <span>১৯ আগস্ট</span>
              </div>
            </div>
          </div>

          {/* মাসিক টার্গেট গজ */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 flex flex-col justify-between">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                মাসিক বিক্রয় লক্ষ্যমাত্রা
              </h3>
              <MoreHorizontal size={16} className="text-slate-300 cursor-pointer" />
            </div>

            <div className="relative flex flex-col items-center justify-center my-4">
              <svg className="w-48 h-28" viewBox="0 0 100 55">
                <path
                  d="M 10 50 A 40 40 0 0 1 90 50"
                  fill="none"
                  stroke="#E0EDFD"
                  strokeWidth="11"
                  strokeLinecap="round"
                />
                <path
                  d="M 10 50 A 40 40 0 0 1 80 22"
                  fill="none"
                  stroke="#2563EB"
                  strokeWidth="11"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute bottom-2 text-center">
                <span className="text-2xl font-black text-slate-900">৮৫%</span>
                <span className="block text-[9px] text-emerald-600 font-bold">+৮.০২% গত মাসের চেয়ে বেশি</span>
              </div>
            </div>

            <div className="text-center">
              <h4 className="text-xs font-bold text-slate-800">দারুণ অগ্রগতি! 🚀</h4>
              <p className="text-[10px] text-slate-400 mt-1 max-w-[200px] mx-auto">
                আমাদের আয় প্রায় ২ লাখ টাকা বৃদ্ধি পেয়েছে; পরবর্তী মাসে ১০০% পূরণ করার লক্ষ্য।
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-50 mt-4">
              <div className="bg-[#F0F7FF] border border-blue-100 rounded-2xl p-2.5 text-center">
                <span className="text-[9px] text-slate-400 block font-medium">নির্ধারিত লক্ষ্য</span>
                <span className="text-xs font-black text-slate-800">৳৬,০০,০০০</span>
              </div>
              <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-2xl p-2.5 text-center">
                <span className="text-[9px] text-blue-600 font-bold block">অর্জিত বিক্রয়</span>
                <span className="text-xs font-black text-[#2563EB]">৳৫,১০,০০০</span>
              </div>
            </div>
          </div>

        </div>

        {/* ৩. বিভাগ ভিত্তিক গ্রাহক ও কনভার্সন ফানেল */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* বিভাগ অনুযায়ী সক্রিয় গ্রাহক */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">বিভাগভিত্তিক সক্রিয় ক্রেতা</h3>
              <MoreHorizontal size={16} className="text-slate-300 cursor-pointer" />
            </div>

            <div className="flex items-baseline justify-between mb-4">
              <div>
                <span className="text-2xl font-black text-slate-900">২,৭৫৮</span>
                <span className="text-[10px] text-slate-400 block">সক্রিয় ক্রেতা</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                +৮.০২% বৃদ্ধি
              </span>
            </div>

            <div className="space-y-3.5">
              {[
                { city: 'ঢাকা বিভাগ', percentage: 36, bnPercent: '৩৬%' },
                { city: 'চট্টগ্রাম বিভাগ', percentage: 24, bnPercent: '২৪%' },
                { city: 'সিলেট বিভাগ', percentage: 17.5, bnPercent: '১৭.৫%' },
                { city: 'রাজশাহী বিভাগ', percentage: 15, bnPercent: '১৫%' },
              ].map((loc) => (
                <div key={loc.city}>
                  <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-1">
                    <span>{loc.city}</span>
                    <span>{loc.bnPercent}</span>
                  </div>
                  <div className="w-full bg-[#E0EDFD] h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#2563EB] h-full rounded-full transition-all duration-500"
                      style={{ width: `${loc.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* কনভার্সন রেট ফানেল */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">বিক্রয় রূপান্তর হার (কনভার্সন ফানেল)</h3>
                <button className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-[11px] font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-sm transition-all">
                  <span>চলতি সপ্তাহ</span>
                  <ChevronDown size={14} />
                </button>
              </div>

              <div className="grid grid-cols-5 gap-2 text-center">
                {[
                  { label: 'পণ্য দেখেছেন', val: '২৫,০০০', change: '+৯%', height: 'h-24' },
                  { label: 'কার্টে রেখেছেন', val: '১২,০০০', change: '+৬%', height: 'h-16' },
                  { label: 'চেকআউটে গেছেন', val: '৮,৫০০', change: '+৪%', height: 'h-12' },
                  { label: 'অর্ডার সম্পন্ন', val: '৬,২০০', change: '+৭%', height: 'h-9' },
                  { label: 'অর্ডার বাতিল', val: '৩,০০০', change: '-৫%', height: 'h-6' },
                ].map((step, idx) => (
                  <div key={idx} className="flex flex-col justify-end items-center">
                    <span className="text-[10px] text-slate-400 font-medium h-7 flex items-center justify-center leading-tight">
                      {step.label}
                    </span>
                    <span className="text-sm font-black text-slate-900 mt-2">{step.val}</span>
                    <span
                      className={`text-[9px] font-bold mb-3 ${
                        step.change.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'
                      }`}
                    >
                      {step.change}
                    </span>
                    <div className="w-full bg-[#E0EDFD] rounded-t-xl overflow-hidden flex items-end">
                      <div
                        className={`w-full bg-gradient-to-t from-[#1D4ED8] to-[#2563EB] rounded-t-xl transition-all duration-500 ${step.height}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

      </main>

    </div>
  );
}