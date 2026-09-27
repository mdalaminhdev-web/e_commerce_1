import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('bd_organic_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [deliveryZone, setDeliveryZone] = useState('inside_dhaka');
  const [shippingCharge, setShippingCharge] = useState(70);

  useEffect(() => {
    localStorage.setItem('bd_organic_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    setShippingCharge(deliveryZone === 'inside_dhaka' ? 70 : 130);
  }, [deliveryZone]);

  const addToCart = (product, selectedVariant) => {
    const variant = selectedVariant || (product.variants && product.variants[0]);
    if (!variant) return;
    setCartItems(prev => {
      const idx = prev.findIndex(item => item.variant_id === variant.id);
      const price = variant.sale_price ? Number(variant.sale_price) : Number(variant.regular_price);
      if (idx > -1) {
        const next = [...prev];
        next[idx].quantity += 1;
        return next;
      }
      return [...prev, {
        product_id: product.id,
        variant_id: variant.id,
        title: product.title,
        unit_name: variant.unit_name,
        price,
        thumbnail: product.thumbnail,
        quantity: 1
      }];
    });
  };

  const updateQuantity = (variantId, delta) => {
    setCartItems(prev => prev.map(item => item.variant_id === variantId ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item));
  };

  const removeFromCart = (variantId) => {
    setCartItems(prev => prev.filter(item => item.variant_id !== variantId));
  };

  const clearCart = () => setCartItems([]);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalPayable = subtotal + (cartItems.length > 0 ? shippingCharge : 0);
  const totalItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, updateQuantity, removeFromCart, clearCart, deliveryZone, setDeliveryZone, shippingCharge, subtotal, totalPayable, totalItemCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
