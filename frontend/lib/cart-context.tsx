'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './toast-context';

export interface CartItem {
  product_id: number;
  name: string;
  price: number;
  quantity: number;
  image_url: string;
  stock: number;
}

export type CartItemInput = Omit<CartItem, 'quantity'>;

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItemInput, quantity: number) => void;
  updateQuantity: (product_id: number, quantity: number) => void;
  removeItem: (product_id: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string>('guest');
  const toast = useToast();

  // Get cart key based on user
  const getCartKey = (userId: string) => `cart_${userId}`;

  // Load cart for current user
  const loadCart = (userId: string) => {
    const cartKey = getCartKey(userId);
    const stored = localStorage.getItem(cartKey);
    if (stored) {
      try {
        setItems(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse cart from localStorage:', e);
        setItems([]);
      }
    } else {
      setItems([]);
    }
  };

  // Monitor auth user changes
  useEffect(() => {
    const checkAuthUser = () => {
      const authUser = localStorage.getItem('auth_user');
      if (authUser) {
        try {
          const user = JSON.parse(authUser);
          const userId = String(user.id);
          if (userId !== currentUserId) {
            setCurrentUserId(userId);
            loadCart(userId);
          }
        } catch (e) {
          console.error('Failed to parse auth_user:', e);
        }
      } else {
        // User logged out, switch to guest cart
        if (currentUserId !== 'guest') {
          setCurrentUserId('guest');
          loadCart('guest');
        }
      }
    };

    // Check initially
    checkAuthUser();

    // Check periodically for auth changes
    const interval = setInterval(checkAuthUser, 500);

    return () => clearInterval(interval);
  }, [currentUserId]);

  // Save cart whenever items change
  useEffect(() => {
    const cartKey = getCartKey(currentUserId);
    localStorage.setItem(cartKey, JSON.stringify(items));
  }, [items, currentUserId]);

  const addItem = (item: CartItemInput, quantity: number) => {
    const existing = items.find((i) => i.product_id === item.product_id);

    if (existing) {
      const newQuantity = Math.min(existing.quantity + quantity, item.stock);

      setItems((prev) =>
        prev.map((i) =>
          i.product_id === item.product_id
            ? { ...i, quantity: newQuantity }
            : i
        )
      );

      if (newQuantity > existing.quantity) {
        toast.success(`Updated ${item.name} quantity in cart`);
      } else {
        toast.warning(`Cannot add more ${item.name} (stock limit: ${item.stock})`);
      }
    } else {
      setItems((prev) => [...prev, { ...item, quantity }]);
      toast.success(`${item.name} added to cart`);
    }
  };

  const updateQuantity = (product_id: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(product_id);
      return;
    }

    const item = items.find((i) => i.product_id === product_id);

    if (item && quantity > item.stock) {
      setItems((prev) =>
        prev.map((i) =>
          i.product_id === product_id ? { ...i, quantity: item.stock } : i
        )
      );
      toast.warning(`Maximum stock available: ${item.stock}`);
    } else {
      setItems((prev) =>
        prev.map((i) =>
          i.product_id === product_id ? { ...i, quantity } : i
        )
      );
    }
  };

  const removeItem = (product_id: number) => {
    const item = items.find((i) => i.product_id === product_id);

    setItems((prev) => prev.filter((i) => i.product_id !== product_id));

    if (item) {
      toast.info(`${item.name} removed from cart`);
    }
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotal = () => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const getItemCount = () => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{ items, addItem, updateQuantity, removeItem, clearCart, getTotal, getItemCount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
