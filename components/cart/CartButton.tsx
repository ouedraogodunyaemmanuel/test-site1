"use client";

import { useCart } from "./CartContext";

// Bouton toujours visible (en haut à droite) donnant accès au panier,
// avec le nombre d'articles actuellement dedans.
export function CartButton() {
  const { totalItems, toggleCart } = useCart();

  return (
    <button
      type="button"
      onClick={toggleCart}
      aria-label="Ouvrir le panier"
      className="fixed right-6 top-5 z-50 flex items-center gap-2 rounded-full border border-stone-300 bg-stone-50/90 px-4 py-2 text-sm text-stone-900 shadow-sm backdrop-blur-md transition-colors hover:border-stone-900"
    >
      Panier
      {totalItems > 0 && (
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-stone-900 px-1 text-xs text-stone-50">
          {totalItems}
        </span>
      )}
    </button>
  );
}
