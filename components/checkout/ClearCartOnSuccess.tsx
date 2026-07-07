"use client";

import { useEffect } from "react";
import { useCart } from "@/components/cart/CartContext";

// Vide le panier une fois qu'un paiement confirmé a été constaté côté
// serveur (voir app/commande/succes/page.tsx) — les articles déjà payés
// ne doivent pas rester dans le panier.
export function ClearCartOnSuccess() {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
    // Tableau de dépendances volontairement vide : `clearCart` change de
    // référence à chaque rendu de CartProvider (ce n'est pas une fonction
    // mémoïsée). L'inclure ici déclencherait l'effet à nouveau après
    // chaque appel à clearCart(), en boucle. On ne veut vider le panier
    // qu'une seule fois, au montage de cette page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
