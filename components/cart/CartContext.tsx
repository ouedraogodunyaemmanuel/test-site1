"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { CartContextValue, CartItem } from "@/types/print";

const CartContext = createContext<CartContextValue | null>(null);

const CART_STORAGE_KEY = "deo-creation-panier";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  // Le localStorage n'existe que côté navigateur : on ne peut pas le lire
  // pendant le premier rendu (fait aussi côté serveur par Next.js). On
  // attend donc que le composant soit monté dans le navigateur.
  const [estMonte, setEstMonte] = useState(false);

  useEffect(() => {
    const panierSauvegarde = window.localStorage.getItem(CART_STORAGE_KEY);
    if (panierSauvegarde) {
      setItems(JSON.parse(panierSauvegarde));
    }
    setEstMonte(true);
  }, []);

  useEffect(() => {
    if (estMonte) {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, estMonte]);

  function addItem(nouvelArticle: Omit<CartItem, "quantity">) {
    setItems((current) => {
      const articleExistant = current.find(
        (item) => item.id === nouvelArticle.id
      );
      if (articleExistant) {
        return current.map((item) =>
          item.id === nouvelArticle.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...current, { ...nouvelArticle, quantity: 1 }];
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

  const totalItems = items.reduce((somme, item) => somme + item.quantity, 0);
  const totalPrice = items.reduce(
    (somme, item) => somme + item.unitPrice * item.quantity,
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
        isReady: estMonte,
        totalItems,
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
