import { createContext, ReactNode, useContext, useState } from 'react';

import { Product } from '@/app/(tabs)/index';

export type CartItem = {
  product: Product;
  quantity: number;
  recurring: boolean;
  frequencyWeeks: number | null;
};

type CartContextType = {
  items: CartItem[];
  addToCart: (product: Product, quantity: number, recurring: boolean, frequencyWeeks: number | null) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  total: number;
  totalItems: number;
};

const CartContext = createContext<CartContextType>({
  items: [],
  addToCart: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
  total: 0,
  totalItems: 0,
});

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (
    product: Product,
    quantity: number,
    recurring: boolean,
    frequencyWeeks: number | null
  ) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      const newItem = { product, quantity, recurring, frequencyWeeks };
      if (existingIndex >= 0) {
        const copy = [...prev];
        copy[existingIndex] = newItem;
        return copy;
      }
      return [...prev, newItem];
    });
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => setItems([]);

  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, clearCart, total, totalItems }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}