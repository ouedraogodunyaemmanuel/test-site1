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
      className="fixed right-4 top-4 z-50 flex items-center gap-2 rounded-full border border-stone-300 bg-stone-50/90 px-3 py-2 text-sm text-stone-900 shadow-sm backdrop-blur-md transition hover:border-stone-900 active:scale-[0.93] sm:right-6 sm:top-5 sm:px-4"
    >
      {/* Icon only on mobile, text reappears from sm — keeps the
          button compact so there's room for the header's navigation
          on small screens (see Header.tsx). */}
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="h-4 w-4"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 6h2l1.5 10.5A2 2 0 0 0 8.48 18h8.04a2 2 0 0 0 1.98-1.5L20 8H6"
        />
        <circle cx="9" cy="21" r="1" />
        <circle cx="17" cy="21" r="1" />
      </svg>
      <span className="hidden sm:inline">Panier</span>
      {itemCount > 0 && (
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-stone-900 px-1 text-xs text-stone-50">
          {itemCount}
        </span>
      )}
    </button>
  );
}
