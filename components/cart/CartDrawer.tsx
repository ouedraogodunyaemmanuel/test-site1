"use client";

import { useEffect, useState } from "react";
import { useCart } from "./CartContext";
import { CartLine } from "./CartLine";
import { formaterPrixCHF } from "@/lib/pricing";

// Panneau qui glisse depuis la droite pour afficher le contenu du panier.
export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalPrice } =
    useCart();
  const [enCoursDePaiement, setEnCoursDePaiement] = useState(false);
  const [erreurPaiement, setErreurPaiement] = useState<string | null>(null);

  // Demande au serveur de créer une session de paiement Stripe, puis
  // redirige le navigateur vers la page de paiement hébergée par Stripe.
  // Le prix n'est jamais envoyé au serveur comme une vérité : il sera
  // recalculé là-bas à partir du format et du cadre de chaque article.
  async function handleCheckout() {
    setErreurPaiement(null);
    setEnCoursDePaiement(true);
    try {
      const reponse = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const donnees = await reponse.json();
      if (!reponse.ok || !donnees.url) {
        throw new Error(donnees.error ?? "Le paiement n'a pas pu être initié.");
      }
      window.location.href = donnees.url;
    } catch (error) {
      setErreurPaiement(
        error instanceof Error ? error.message : "Une erreur est survenue."
      );
      setEnCoursDePaiement(false);
    }
  }

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
            {erreurPaiement && (
              <p className="mt-3 text-sm text-red-600">{erreurPaiement}</p>
            )}
            <button
              type="button"
              onClick={handleCheckout}
              disabled={enCoursDePaiement}
              className="mt-4 w-full bg-stone-900 px-6 py-3 text-sm tracking-wide text-stone-50 transition-colors hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {enCoursDePaiement ? "Redirection en cours…" : "Payer"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
