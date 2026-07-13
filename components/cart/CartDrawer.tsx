"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useCart } from "./CartContext";
import { CartLine } from "./CartLine";
import { formaterPrixCHF } from "@/lib/pricing";

// Panneau qui glisse depuis la droite pour afficher le contenu du panier.
export function CartDrawer() {
  const { articles, estOuvert, fermerPanier, retirerArticle, mettreAJourQuantite, prixTotal } =
    useCart();

  // Ferme le panier avec la touche Échap, pour une navigation clavier correcte.
  useEffect(() => {
    if (!estOuvert) return;
    function gererTouche(evenement: KeyboardEvent) {
      if (evenement.key === "Escape") {
        fermerPanier();
      }
    }
    window.addEventListener("keydown", gererTouche);
    return () => window.removeEventListener("keydown", gererTouche);
  }, [estOuvert, fermerPanier]);

  if (!estOuvert) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/60"
      onClick={fermerPanier}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Panier"
        className="flex h-full w-full max-w-md flex-col bg-stone-50 p-6"
        onClick={(evenement) => evenement.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl text-stone-900">Votre panier</h2>
          <button
            type="button"
            onClick={fermerPanier}
            aria-label="Fermer le panier"
            className="text-stone-500 transition-colors hover:text-stone-900"
          >
            ✕
          </button>
        </div>

        {articles.length === 0 ? (
          <p className="mt-8 text-sm text-stone-500">Votre panier est vide.</p>
        ) : (
          <div className="mt-6 flex flex-1 flex-col gap-6 overflow-y-auto">
            {articles.map((article) => (
              <CartLine
                key={article.id}
                article={article}
                onRetirer={() => retirerArticle(article.id)}
                onChangementQuantite={(quantite) => mettreAJourQuantite(article.id, quantite)}
              />
            ))}
          </div>
        )}

        {articles.length > 0 && (
          <div className="mt-6 border-t border-stone-200 pt-4">
            <div className="flex items-center justify-between text-lg text-stone-900">
              <span>Total</span>
              <span>{formaterPrixCHF(prixTotal)}</span>
            </div>
            <Link
              href="/commande/livraison"
              onClick={fermerPanier}
              className="mt-4 block w-full bg-stone-900 px-6 py-3 text-center text-sm tracking-wide text-stone-50 transition-colors hover:bg-stone-700"
            >
              Payer
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
