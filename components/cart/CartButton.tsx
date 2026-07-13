"use client";

import { useCart } from "./CartContext";

// Always-visible button (top right) giving access to the cart,
// with the number of items currently in it.
export function CartButton() {
  const { itemCount, toggleCart } = useCart();

  return (
    <button
      type="button"
      onClick={toggleCart}
      aria-label="Ouvrir le panier"
      className="fixed right-6 top-5 z-50 flex items-center gap-2 rounded-full border border-stone-300 bg-stone-50/90 px-4 py-2 text-sm text-stone-900 shadow-sm backdrop-blur-md transition hover:border-stone-900 active:scale-[0.97]"
    >
      Panier
      {itemCount > 0 && (
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-stone-900 px-1 text-xs text-stone-50">
          {itemCount}
        </span>
      )}
    </button>
  );
}
