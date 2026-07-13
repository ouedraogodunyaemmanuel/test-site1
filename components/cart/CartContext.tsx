"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { CartContextValue, CartItem } from "@/types/Cart";

const CartContext = createContext<CartContextValue | null>(null);

const CART_STORAGE_KEY = "deo-creation-panier";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  // localStorage only exists on the browser side: it can't be read
  // during the first render (also done server-side by Next.js). So we
  // wait for the component to be mounted in the browser.
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const savedCart = window.localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      setItems(JSON.parse(savedCart));
    }
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, isMounted]);

  function addItem(newItem: Omit<CartItem, "quantity">) {
    setItems((current) => {
      const existingItem = current.find((item) => item.id === newItem.id);
      if (existingItem) {
        return current.map((item) =>
          item.id === newItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...current, { ...newItem, quantity: 1 }];
    });
  }

  function removeItem(id: string) {
    setItems((current) => current.filter((item) => item.id !== id));
  }

  function updateQuantity(id: string, quantity: number) {
    if (quantity < 1) {
      removeItem(id);
      return;
    }
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  }

  function clearCart() {
    setItems([]);
  }

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isReady: isMounted,
        itemCount,
        totalPrice,
        isOpen,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
        toggleCart: () => setIsOpen((current) => !current),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart() doit être appelé à l'intérieur d'un <CartProvider>.");
  }
  return context;
}
