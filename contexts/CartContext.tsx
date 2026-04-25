import React, { createContext, useState, ReactNode } from 'react';
import { Product } from '@/constants/mockData';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  count: number;
  subtotal: number;
  discount: number;
  total: number;
  addToCart: (product: Product, qty?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, qty: number) => void;
  clearCart: () => void;
  isInCart: (productId: string) => boolean;
  getQuantity: (productId: string) => number;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const count = items.reduce((s, i) => s + i.quantity, 0);

  const subtotal = items.reduce((s, i) => s + i.product.originalPrice * i.quantity, 0);
  const discount = items.reduce((s, i) => s + (i.product.originalPrice - i.product.price) * i.quantity, 0);
  const total = items.reduce((s, i) => s + i.product.price * i.quantity, 0);

  const addToCart = (product: Product, qty = 1) => {
    setItems(prev => {
      const exists = prev.find(i => i.product.id === product.id);
      if (exists) {
        return prev.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + qty } : i);
      }
      return [...prev, { product, quantity: qty }];
    });
  };

  const removeFromCart = (productId: string) => {
    setItems(prev => prev.filter(i => i.product.id !== productId));
  };

  const updateQuantity = (productId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems(prev => prev.map(i => i.product.id === productId ? { ...i, quantity: qty } : i));
  };

  const clearCart = () => setItems([]);

  const isInCart = (productId: string) => items.some(i => i.product.id === productId);

  const getQuantity = (productId: string) => {
    const item = items.find(i => i.product.id === productId);
    return item ? item.quantity : 0;
  };

  return (
    <CartContext.Provider value={{
      items,
      count,
      subtotal,
      discount,
      total,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      isInCart,
      getQuantity,
    }}>
      {children}
    </CartContext.Provider>
  );
}
