import React, { createContext, useState, ReactNode } from 'react';
import { Product } from '@/constants/mockData';

interface WishlistContextType {
  items: Product[];
  isWishlisted: (productId: string) => boolean;
  toggleWishlist: (product: Product) => void;
}

export const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Product[]>([]);

  const isWishlisted = (productId: string) => items.some(p => p.id === productId);

  const toggleWishlist = (product: Product) => {
    setItems(prev =>
      prev.some(p => p.id === product.id)
        ? prev.filter(p => p.id !== product.id)
        : [...prev, product]
    );
  };

  return (
    <WishlistContext.Provider value={{ items, isWishlisted, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}
