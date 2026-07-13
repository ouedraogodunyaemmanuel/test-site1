// Cart domain types.
// Centralized here to be imported from any file with:
//   import type { CartItem, CartContextValue } from "@/types/Cart";

// A cart line corresponds to a precise combination of
// photo + format + finish + frame (two different choices for the
// same photo are therefore two distinct lines).
export type CartItem = {
  id: string;
  printId: number;
  title: string;
  image: string;
  // Technical values (e.g. "60x90", "noir") in addition to the
  // readable labels: they allow the price to be recalculated
  // server-side at payment time, without trusting the price sent
  // by the browser.
  format: string;
  frame: string;
  formatLabel: string;
  finishLabel: string;
  frameLabel: string;
  unitPrice: number;
  quantity: number;
};

// What CartProvider exposes via useCart() (components/cart/CartContext.tsx).
export type CartContextValue = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  // true once the cart has been loaded from the browser: avoids a
  // page checking "the cart is empty" before loading finishes and
  // redirecting wrongly (e.g. after a page refresh).
  isReady: boolean;
  itemCount: number;
  totalPrice: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
};
