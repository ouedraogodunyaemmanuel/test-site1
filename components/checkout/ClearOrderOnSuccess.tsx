"use client";

import { useEffect } from "react";
import { useCart } from "@/components/cart/CartContext";
import { useDelivery } from "@/components/checkout/DeliveryContext";

// Vide le panier et les informations de livraison une fois qu'un paiement
// confirmé a été constaté côté serveur (voir app/commande/succes/page.tsx)
// — rien de tout ça ne doit rester pour une prochaine commande.
export function ClearOrderOnSuccess() {
  const { clearCart } = useCart();
  const { clearDelivery } = useDelivery();

  useEffect(() => {
    clearCart();
    clearDelivery();
    // Tableau de dépendances volontairement vide : `clearCart` et
    // `clearDelivery` changent de référence à chaque rendu de leur
    // provider respectif (ce ne sont pas des fonctions mémoïsées). Les
    // inclure ici déclencherait l'effet à nouveau après chaque appel, en
    // boucle. On ne veut vider le panier et les infos de livraison
    // qu'une seule fois, au montage de cette page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
