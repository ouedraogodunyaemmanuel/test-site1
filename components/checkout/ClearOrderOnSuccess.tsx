"use client";

import { useEffect } from "react";
import { useCart } from "@/components/cart/CartContext";
import { useDelivery } from "@/components/checkout/DeliveryContext";

// Clears the cart and the delivery information once a confirmed
// payment has been observed server-side (see
// app/commande/succes/page.tsx) — none of it should remain for the
// next order.
export function ClearOrderOnSuccess() {
  const { clearCart } = useCart();
  const { clearDelivery } = useDelivery();

  useEffect(() => {
    clearCart();
    clearDelivery();
    // Dependency array intentionally left empty: `clearCart` and
    // `clearDelivery` get a new reference on every render of their
    // respective provider (they aren't memoized functions). Including
    // them here would retrigger the effect after every call, in a
    // loop. We only want to clear the cart and delivery info once,
    // when this page mounts.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
