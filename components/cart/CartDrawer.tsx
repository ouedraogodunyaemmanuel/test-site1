"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "./CartContext";
import { CartLine } from "./CartLine";
import { formaterPrixCHF } from "@/lib/pricing";

// Duration (ms) of the fade/slide transition — must match the
// `duration-200` Tailwind class used below, since we rely on a timer
// (not a CSS transitionend event) to know when it's safe to actually
// remove the drawer from the page.
const ANIMATION_DURATION_MS = 200;

// Panel that slides in from the right to show the cart contents.
export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalPrice } =
    useCart();

  // `isOpen` (from CartContext) toggles instantly, but we want the
  // drawer to stay in the DOM a little longer when closing so its
  // exit transition (slide + fade) has time to play.
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
      const id = requestAnimationFrame(() => setIsVisible(true));
      return () => cancelAnimationFrame(id);
    }
    setIsVisible(false);
    const timerId = setTimeout(() => setIsMounted(false), ANIMATION_DURATION_MS);
    return () => clearTimeout(timerId);
  }, [isOpen]);

  // Close the cart with the Escape key, for correct keyboard navigation.
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

  if (!isMounted) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex justify-end bg-black/60 transition-opacity duration-200 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      onClick={closeCart}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Panier"
        className={`flex h-full w-full max-w-md flex-col bg-stone-50 p-6 transition-transform duration-200 ${
          isVisible ? "translate-x-0" : "translate-x-full"
        }`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl text-stone-900">Votre panier</h2>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Fermer le panier"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-stone-900 text-stone-50 transition hover:bg-stone-700 active:scale-85"
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
            <Link
              href="/commande/livraison"
              onClick={closeCart}
              className="mt-4 block w-full bg-stone-900 px-6 py-3 text-center text-sm tracking-wide text-stone-50 transition hover:bg-stone-700 active:scale-[0.93]"
            >
              Payer
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
