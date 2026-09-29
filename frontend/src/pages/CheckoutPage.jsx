import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, ShieldCheck, Check, AlertCircle, ShoppingBag } from 'lucide-react';
import axios from 'axios';

// বাংলাদেশের প্রধান জেলাসমূহের তালিকা (ডেলিভারি চার্জ নির্ণয়ের জন্য)
const BD_DISTRICTS = [
  'ঢাকা (Dhaka)',
  'চট্টগ্রাম (Chattogram)',
  'সিলেট (Sylhet)',
  'রাজশাহী (Rajshahi)',
  'খুলনা (Khulna)',
  'বরিশাল (Barishal)',
  'রংপুর (Rangpur)',
  'ময়মনসিংহ (Mymensingh)',
  'গাজীপুর (Gazipur)',
  'নারায়ণগঞ্জ (Narayanganj)',
  'কুমিল্লা (Cumilla)',
  'বগুড়া (Bogura)',
  'কক্সবাজার (Cox\'s Bazar)',
  'নোয়াখালী (Noakhali)',
  'ফরিদপুর (Faridpur)',
  'পাবনা (Pabna)',
  'দিনাজপুর (Dinajpur)',
  'যশোর (Jashore)',
  'টাঙ্গাইল (Tangail)',
  'কুষ্টিয়া (Kushtia)'
];

export default function CheckoutPage() {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal
  } = useCart();

  const navigate = useNavigate();

  // ফর্ম স্টেট
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    streetAddress: '',
    district: 'ঢাকা (Dhaka)',
    thana: '',
    specialNotes: '',
    paymentMethod: 'COD',
    agreeTerms: true
  });

  // কুপন স্টেট
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponMessage, setCouponMessage] = useState({ type: '', text: '' });

  // প্রসেসিং ও এরর স্টেট
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // জেলা অনুযায়ী স্বয়ংক্রিয় ডেলিভারি চার্জ নির্ণয়
  const isDhaka = formData.district.includes('Dhaka') || formData.district.includes('ঢাকা');
  const deliveryCharge = cartItems.length > 0 ? (isDhaka ? 70 : 130) : 0;
  const grandTotal = Math.max(0, subtotal + deliveryCharge - discountAmount);

  // ইনপুট চেঞ্জ হ্যান্ডলার
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // টাইপ করার সাথে সাথে সংশ্লিষ্ট এরর ক্লিয়ার করা
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // কুপন কোড প্রয়োগ
  const handleApplyCoupon = (codeToApply) => {
    const code = (codeToApply || couponCode).trim().toUpperCase();
    if (!code) {
      setCouponMessage({ type: 'error', text: 'একটি সঠিক কুপন কোড লিখুন' });
      return;
    }

    if (code === 'GB50' || code === 'MR50') {
      const discount = 50;
      setDiscountAmount(discount);
      setCouponApplied(true);
      setCouponMessage({ type: 'success', text: `অভিনন্দন! ৳${discount} মূল্যছাড় যুক্ত হয়েছে।` });
    } else if (code === 'OFF10') {
      const discount = Math.round(subtotal * 0.1);
      setDiscountAmount(discount);
      setCouponApplied(true);
      setCouponMessage({ type: 'success', text: `১০% ছাড় হিসেবে ৳${discount} কমানো হয়েছে।` });
    } else {
      setCouponMessage({ type: 'error', text: 'কুপন কোডটি সঠিক নয় বা মেয়াদ শেষ।' });
    }
  };

  // প্রোডাকশন লেভেল ফর্ম ভ্যালিডেশন
  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'আপনার পূর্ণ নাম আবশ্যক';
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName = 'কমপক্ষে ৩ অক্ষরের নাম লিখুন';
    }

    // ১১ ডিজিটের বাংলাদেশি মোবাইল নম্বর ভ্যালিডেশন
    const cleanPhone = formData.phone.trim().replace(/^(\+88|88)/, '');
    if (!cleanPhone) {
      newErrors.phone = '১১ ডিজিটের মোবাইল নম্বর আবশ্যক';
    } else if (!/^01[3-9]\d{8}$/.test(cleanPhone)) {
      newErrors.phone = 'সঠিক বাংলাদেশি নম্বর দিন (যেমন: 017XXXXXXXX)';
    }

    if (!formData.streetAddress.trim()) {
      newErrors.streetAddress = 'বাসা/রোড/এলাকার পূর্ণাঙ্গ ঠিকানা দিন';
    } else if (formData.streetAddress.trim().length < 8) {
      newErrors.streetAddress = 'ডেলিভারির জন্য আরও বিস্তারিত ঠিকানা লিখুন';
    }

    if (!formData.district) {
      newErrors.district = 'জেলা নির্বাচন করুন';
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'শর্তাবলীতে সম্মতি প্রদান আবশ্যক';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // অর্ডার সাবমিট হ্যান্ডলার
  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      alert('আপনার শপিং কার্ট খালি! অনুগ্রহ করে পণ্য যুক্ত করুন।');
      return;
    }

    if (!validateForm()) {
      window.scrollTo({ top: 300, behavior: 'smooth' });
      return;
    }

    try {
      setIsSubmitting(true);

      const cleanPhone = formData.phone.trim().replace(/^(\+88|88)/, '');
      const fullDeliveryAddress = `${formData.streetAddress.trim()}, ${formData.thana ? formData.thana + ', ' : ''}${formData.district}`;

      const payload = {
        customer_name: formData.fullName.trim(),
        customer_phone: cleanPhone,
        delivery_address: fullDeliveryAddress,
        delivery_zone: isDhaka ? 'inside_dhaka' : 'outside_dhaka',
        payment_method: formData.paymentMethod,
        order_note: formData.specialNotes.trim() || null,
        items: cartItems.map((item) => ({
          variant_id: item.variant_id,
          quantity: item.quantity
        }))
      };

      const res = await axios.post('/api/v1/orders/checkout', payload);

      if (res.data.success) {
        const orderData = res.data.order;
        clearCart();
        navigate(`/order-success/${orderData.order_code}`);
      }
    } catch (err) {
      console.error('Checkout error:', err);
      alert(err.response?.data?.message || 'অর্ডার করতে সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন বা সরাসরি কল করুন।');
    } finally {
      setIsSubmitting(false);
    }
  };

  // খালি কার্ট ভিউ
  if (cartItems.length === 0) {
    return (
      <div className="bg-[#FAF9F5] min-h-screen py-16 px-4">
        <div className="max-w-md mx-auto bg-white border border-[#E9ECEF] rounded-2xl p-8 text-center shadow-sm">
          <div className="w-16 h-16 bg-blue-50 text-brand-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingBag size={28} />
          </div>
          <h2 className="text-base font-bold text-slate-900">আপনার কার্টে কোনো পণ্য নেই</h2>
          <p className="text-xs text-slate-500 mt-1">
            ঘরে বসে খাঁটি ও স্বাস্থ্যকর খাবার পেতে আমাদের পণ্য তালিকা দেখুন।
          </p>
          <Link
            to="/"
            className="mt-6 inline-block bg-brand-accent hover:bg-brand-primary text-white text-xs font-bold py-2.5 px-6 rounded-xl transition-all shadow-sm"
          >
            কেনাকাটা শুরু করুন
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F8F9FA] min-h-screen py-6 text-slate-800">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* হেডলাইন ও ব্রেডক্রাম্ব */}
        <div className="text-center mb-6">
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Checkout</h1>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-center gap-1.5 font-medium">
            <Link to="/" className="hover:text-brand-accent">Home</Link>
            <span>&gt;</span>
            <span className="text-brand-accent font-semibold">Checkout</span>
          </div>
        </div>

        {/* টপ নোটিশ: লগইন/রেজিস্ট্রেশন ব্যানার (হুবহু স্ক্রিনশট স্টাইল) */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-3.5 sm:px-6 mb-6 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
          <span className="text-xs text-slate-600 font-medium">
            Have any account? please login or register
          </span>
          <div className="flex items-center gap-2">
            <Link
              to="/admin"
              className="border border-slate-300 hover:border-slate-400 text-slate-700 text-xs font-semibold px-4 py-1.5 rounded-lg transition-colors"
            >
              Login
            </Link>
            <Link
              to="/admin"
              className="bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-semibold px-4 py-1.5 rounded-lg transition-colors shadow-xs"
            >
              Register
            </Link>
          </div>
        </div>

        {/* মেইন চেকআউট গ্রিড */}
        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* =========================================================
              বাম পাশ: অর্ডার রিভিউ ও শিপিং ফর্ম (৭ কলাম)
          ========================================================= */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* ১. Order review */}
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 sm:p-6 shadow-xs">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 border-l-3 border-[#EA580C] pl-2.5">
                Order review
              </h2>

              <div className="divide-y divide-slate-100">
                {cartItems.map((item) => (
                  <div key={item.variant_id} className="py-3.5 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                    <div className="flex items-center gap-3.5">
                      <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-xl p-1 flex-shrink-0 flex items-center justify-center overflow-hidden">
                        <img src={item.thumbnail} alt={item.title} className="h-full w-full object-contain" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{item.title}</h4>
                        <span className="text-[11px] text-slate-400 font-medium block">{item.unit_name}</span>
                        <div className="mt-1.5 flex items-center gap-2 text-xs">
                          <span className="text-slate-500 font-semibold">Qty:</span>
                          <div className="flex items-center border border-slate-200 rounded-md overflow-hidden bg-slate-50">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.variant_id, -1)}
                              className="px-2 py-0.5 text-slate-600 hover:bg-slate-200 font-bold"
                            >
                              -
                            </button>
                            <span className="px-2 py-0.5 text-[11px] font-bold text-slate-800">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.variant_id, 1)}
                              className="px-2 py-0.5 text-slate-600 hover:bg-slate-200 font-bold"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-xs font-bold text-slate-900">
                        ৳{(item.price * item.quantity).toLocaleString()}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.variant_id)}
                        className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                        title="পণ্যটি মুছে ফেলুন"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ২. Shipping Address ফর্ম */}
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-l-3 border-[#EA580C] pl-2.5">
                Shipping Address
              </h2>

              {/* নাম ও ফোন নম্বর */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Your Full Name *"
                    className={`w-full bg-[#f8fafc] border rounded-xl py-2.5 px-4 text-xs focus:bg-white outline-none transition-all ${
                      errors.fullName ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300 focus:border-brand-accent'
                    }`}
                  />
                  {errors.fullName && <span className="text-[10px] text-rose-500 font-medium block mt-1">{errors.fullName}</span>}
                </div>

                <div>
                  <div className="flex items-center">
                    <span className="bg-slate-100 border border-r-0 border-slate-300 text-slate-600 text-xs font-semibold px-3 py-2.5 rounded-l-xl">
                      +88
                    </span>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="017******** *"
                      maxLength={11}
                      className={`w-full bg-[#f8fafc] border rounded-r-xl py-2.5 px-4 text-xs focus:bg-white outline-none transition-all ${
                        errors.phone ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300 focus:border-brand-accent'
                      }`}
                    />
                  </div>
                  {errors.phone && <span className="text-[10px] text-rose-500 font-medium block mt-1">{errors.phone}</span>}
                </div>
              </div>

              {/* ইমেইল (ঐচ্ছিক) */}
              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="example@gmail.com (Optional)"
                  className="w-full bg-[#f8fafc] border border-slate-300 rounded-xl py-2.5 px-4 text-xs focus:bg-white focus:border-brand-accent outline-none transition-all"
                />
              </div>

              {/* পূর্ণ ঠিকানা */}
              <div>
                <input
                  type="text"
                  name="streetAddress"
                  value={formData.streetAddress}
                  onChange={handleInputChange}
                  placeholder="ex: House no. / building / street / area *"
                  className={`w-full bg-[#f8fafc] border rounded-xl py-2.5 px-4 text-xs focus:bg-white outline-none transition-all ${
                    errors.streetAddress ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300 focus:border-brand-accent'
                  }`}
                />
                {errors.streetAddress && <span className="text-[10px] text-rose-500 font-medium block mt-1">{errors.streetAddress}</span>}
              </div>

              {/* জেলা ও থানা ড্রপডাউন */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <select
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    className="w-full bg-[#f8fafc] border border-slate-300 rounded-xl py-2.5 px-3 text-xs focus:bg-white focus:border-brand-accent outline-none transition-all text-slate-700"
                  >
                    {BD_DISTRICTS.map((dist, idx) => (
                      <option key={idx} value={dist}>{dist}</option>
                    ))}
                  </select>
                  <span className="text-[10px] text-slate-400 block mt-1">
                    {isDhaka ? 'ঢাকার ভিতরে: ডেলিভারি চার্জ ৳৭০' : 'ঢাকার বাইরে: ডেলিভারি চার্জ ৳১৩০'}
                  </span>
                </div>

                <div>
                  <input
                    type="text"
                    name="thana"
                    value={formData.thana}
                    onChange={handleInputChange}
                    placeholder="Select Thana (Optional)"
                    className="w-full bg-[#f8fafc] border border-slate-300 rounded-xl py-2.5 px-4 text-xs focus:bg-white focus:border-brand-accent outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* ৩. Billing Address অপশন */}
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 sm:p-5 flex items-center justify-between shadow-xs">
              <span className="text-xs font-bold text-slate-800 border-l-3 border-[#EA580C] pl-2.5">
                Billing Address
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  id="sameAddress"
                  defaultChecked
                  readOnly
                  className="accent-[#EA580C] w-4 h-4 cursor-pointer"
                />
                <label htmlFor="sameAddress" className="text-xs text-slate-600 font-medium cursor-pointer">
                  Same as shipping address
                </label>
              </div>
            </div>

          </div>

          {/* =========================================================
              ডান পাশ: পেমেন্ট মেথড, কুপন ও মোট সামারি (৫ কলাম)
          ========================================================= */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* ১. Payment method */}
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 sm:p-6 shadow-xs space-y-3">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-l-3 border-[#EA580C] pl-2.5">
                Payment method
              </h2>

              <div className="grid grid-cols-1 gap-2.5 pt-1">
                {/* Cash On Delivery (Default Active) */}
                <div
                  onClick={() => setFormData({ ...formData, paymentMethod: 'COD' })}
                  className={`border rounded-xl p-3 flex items-center justify-between cursor-pointer transition-all ${
                    formData.paymentMethod === 'COD'
                      ? 'border-[#EA580C] bg-[#FFF8F3] shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm">💵</span>
                    <span className="text-xs font-bold text-slate-800">Cash On Delivery</span>
                  </div>
                  {formData.paymentMethod === 'COD' && (
                    <div className="w-4 h-4 rounded-full bg-[#EA580C] text-white flex items-center justify-center text-[10px]">
                      ✓
                    </div>
                  )}
                </div>

                {/* Online Payment (Cards/NetBanking) */}
                <div
                  onClick={() => setFormData({ ...formData, paymentMethod: 'ONLINE' })}
                  className={`border rounded-xl p-3 flex items-center justify-between cursor-pointer transition-all ${
                    formData.paymentMethod === 'ONLINE'
                      ? 'border-[#EA580C] bg-[#FFF8F3] shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm">💳</span>
                    <span className="text-xs font-semibold text-slate-700">Online Payment</span>
                  </div>
                </div>

                {/* bKash Direct */}
                <div
                  onClick={() => setFormData({ ...formData, paymentMethod: 'BKASH' })}
                  className={`border rounded-xl p-3 flex items-center justify-between cursor-pointer transition-all ${
                    formData.paymentMethod === 'BKASH'
                      ? 'border-[#EA580C] bg-[#FFF8F3] shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-black text-[#D12053] bg-pink-50 px-1.5 py-0.5 rounded">bKash</span>
                    <span className="text-xs font-semibold text-slate-700">bKash Payment</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ২. Have any coupon or gift voucher? */}
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 sm:p-6 shadow-xs">
              <h3 className="text-xs font-bold text-slate-800 mb-3 flex items-center justify-between">
                <span>Have any coupon or gift voucher?</span>
                <span className="text-[10px] text-slate-400">▲</span>
              </h3>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Enter Coupon"
                  className="flex-1 bg-[#f8fafc] border border-slate-300 rounded-xl py-2 px-3 text-xs uppercase focus:bg-white focus:border-[#EA580C] outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleApplyCoupon()}
                  className="bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-xs"
                >
                  Apply coupon
                </button>
              </div>

              {couponMessage.text && (
                <div className={`mt-2 text-[10px] font-semibold ${couponMessage.type === 'success' ? 'text-emerald-600' : 'text-rose-500'}`}>
                  {couponMessage.text}
                </div>
              )}

              {/* Eligible promo codes (স্ক্রিনশটের মতো ড্যাশড বক্স) */}
              <div className="mt-3 pt-3 border-t border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Eligible promo codes
                </span>
                <div
                  onClick={() => handleApplyCoupon('MR50')}
                  className="border border-dashed border-[#EA580C] bg-[#FFF8F3] hover:bg-orange-100/50 p-2 rounded-lg cursor-pointer inline-block transition-colors"
                >
                  <span className="text-xs font-black text-[#EA580C] block leading-none">MR50</span>
                  <span className="text-[9px] text-slate-500">Flat 50৳ OFF</span>
                </div>
              </div>
            </div>

            {/* ৩. অর্ডার সারাংশ (Pricing Breakdown) */}
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 sm:p-6 shadow-xs space-y-2.5 text-xs text-slate-600">
              <div className="flex justify-between items-center">
                <span>Sub total</span>
                <span className="font-semibold text-slate-800">৳{subtotal.toLocaleString()} BDT</span>
              </div>

              <div className="flex justify-between items-center">
                <span>Delivery cost</span>
                <span className="font-semibold text-slate-800">৳{deliveryCharge} BDT</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between items-center text-emerald-600 font-semibold">
                  <span>Coupon Discount</span>
                  <span>- ৳{discountAmount} BDT</span>
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-sm font-black text-slate-900">
                <span>Total</span>
                <span className="text-[#EA580C] text-base">৳{grandTotal.toLocaleString()} BDT</span>
              </div>
            </div>

            {/* ৪. Special notes (সর্বোচ্চ ৯০ অক্ষর কাউন্টার) */}
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 sm:p-6 shadow-xs">
              <label className="text-xs font-bold text-slate-800 block mb-2">
                Special notes <span className="text-[10px] text-slate-400 font-normal">(Optional)</span>
              </label>
              <textarea
                name="specialNotes"
                rows={2}
                maxLength={90}
                value={formData.specialNotes}
                onChange={handleInputChange}
                placeholder="ডেলিভারি সংক্রান্ত কোনো বিশেষ নির্দেশনা থাকলে এখানে লিখুন..."
                className="w-full bg-[#f8fafc] border border-slate-300 rounded-xl p-3 text-xs focus:bg-white focus:border-brand-accent outline-none resize-none transition-all"
              />
              <div className="text-right text-[10px] text-slate-400 mt-1 font-medium">
                {formData.specialNotes.length} / 90 characters
              </div>
            </div>

            {/* ৫. শর্তাবলী চেকবক্স ও কনফার্ম বাটন */}
            <div className="space-y-4">
              <div className="flex items-start gap-2 text-[11px] text-slate-600">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleInputChange}
                  className="mt-0.5 accent-[#EA580C] cursor-pointer"
                />
                <label htmlFor="agreeTerms" className="cursor-pointer leading-tight">
                  I have read and agree to the{' '}
                  <span className="text-[#EA580C] hover:underline">Terms and Conditions</span>,{' '}
                  <span className="text-[#EA580C] hover:underline">Privacy Policy</span> &{' '}
                  <span className="text-[#EA580C] hover:underline">Refund and Return Policy</span>.
                </label>
              </div>
              {errors.agreeTerms && (
                <span className="text-[10px] text-rose-500 font-medium block">{errors.agreeTerms}</span>
              )}

              {/* হাই-কনভার্সন অরেঞ্জ প্লেস অর্ডার বাটন */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#EA580C] hover:bg-[#C2410C] text-white text-sm font-extrabold py-3.5 px-6 rounded-xl transition-all shadow-md shadow-orange-500/20 active:scale-[0.99] disabled:opacity-60 uppercase tracking-wider"
              >
                {isSubmitting ? 'অর্ডার প্রসেস হচ্ছে...' : 'PLACE ORDER'}
              </button>
            </div>

          </div>

        </form>

      </div>
    </div>
  );
}