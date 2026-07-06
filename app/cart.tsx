"use client";

import Image from "next/image";
import { useEffect } from "react";
import { useCart } from "./cart-context";
import type { CartItem } from "./cart-context";
import { formaterPrixCHF } from "./pricing";

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

// Panneau qui glisse depuis la droite pour afficher le contenu du panier.
export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalPrice } =
    useCart();

  // Ferme le panier avec la touche Échap, pour une navigation clavier correcte.
  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeCart();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeCart]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/60"
      onClick={closeCart}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Panier"
        className="flex h-full w-full max-w-md flex-col bg-stone-50 p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl text-stone-900">Votre panier</h2>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Fermer le panier"
            className="text-stone-500 transition-colors hover:text-stone-900"
          >
            ✕
          </button>
        </div>

        {items.length === 0 ? (
          <p className="mt-8 text-sm text-stone-500">Votre panier est vide.</p>
        ) : (
          <div className="mt-6 flex flex-1 flex-col gap-6 overflow-y-auto">
            {items.map((item) => (
              <CartLine
                key={item.id}
                item={item}
                onRemove={() => removeItem(item.id)}
                onQuantityChange={(quantity) => updateQuantity(item.id, quantity)}
              />
            ))}
          </div>
        )}

        {items.length > 0 && (
          <div className="mt-6 border-t border-stone-200 pt-4">
            <div className="flex items-center justify-between text-lg text-stone-900">
              <span>Total</span>
              <span>{formaterPrixCHF(totalPrice)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CartLine({
  item,
  onRemove,
  onQuantityChange,
}: {
  item: CartItem;
  onRemove: () => void;
  onQuantityChange: (quantity: number) => void;
}) {
  return (
    <div className="flex gap-4">
      <div className="relative h-20 w-16 shrink-0 overflow-hidden bg-stone-200">
        <Image
          src={item.image}
          alt={item.title}
          fill
          sizes="64px"
          className="object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col text-sm">
        <span className="font-serif text-stone-900">{item.title}</span>
        <span className="mt-1 text-stone-500">
          {item.formatLabel} · {item.finishLabel} · {item.frameLabel}
        </span>
        <span className="mt-1 text-stone-900">
          {formaterPrixCHF(item.unitPrice)}
        </span>
        <div className="mt-2 flex items-center gap-3">
          <div className="flex items-center border border-stone-300">
            <button
              type="button"
              onClick={() => onQuantityChange(item.quantity - 1)}
              aria-label="Diminuer la quantité"
              className="px-2 py-1 text-stone-600 transition-colors hover:text-stone-900"
            >
              −
            </button>
            <span className="px-2 text-stone-900">{item.quantity}</span>
            <button
              type="button"
              onClick={() => onQuantityChange(item.quantity + 1)}
              aria-label="Augmenter la quantité"
              className="px-2 py-1 text-stone-600 transition-colors hover:text-stone-900"
            >
              +
            </button>
          </div>
          <button
            type="button"
            onClick={onRemove}
            className="text-stone-500 underline transition-colors hover:text-stone-900"
          >
            Retirer
          </button>
        </div>
      </div>
    </div>
  );
}
