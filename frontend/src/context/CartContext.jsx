import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useContext as useAuthContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [] });
  const [cartLoading, setCartLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const fetchCart = useCallback(async () => {
    try {
      setCartLoading(true);
      const res = await axios.get('/api/cart');
      setCart(res.data);
      setIsLoggedIn(true);
    } catch (err) {
      if (err.response?.status === 401) setIsLoggedIn(false);
      setCart({ items: [] });
    } finally {
      setCartLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId, quantity = 1) => {
    const res = await axios.post('/api/cart', { productId, quantity });
    setCart(res.data);
    return res.data;
  };

  const updateCartItem = async (itemId, quantity) => {
    const res = await axios.put(`/api/cart/${itemId}`, { quantity });
    setCart(res.data);
    return res.data;
  };

  const removeFromCart = async (itemId) => {
    const res = await axios.delete(`/api/cart/${itemId}`);
    setCart(res.data);
    return res.data;
  };

  const clearCart = async () => {
    await axios.delete('/api/cart/clear');
    setCart({ items: [] });
  };

  const cartItemCount = cart.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const getDiscountedPrice = (price, discount) => {
    return price - (price * (discount || 0)) / 100;
  };

  const cartTotal = cart.items?.reduce((sum, item) => {
    const price = getDiscountedPrice(item.product?.price || 0, item.product?.discount);
    return sum + price * item.quantity;
  }, 0) || 0;

  return (
    <CartContext.Provider value={{ cart, cartLoading, cartItemCount, cartTotal, addToCart, updateCartItem, removeFromCart, clearCart, fetchCart, getDiscountedPrice }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
