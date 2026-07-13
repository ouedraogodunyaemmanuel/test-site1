// Delivery domain types.
// Centralized here to be imported from any file with:
//   import type { DeliveryInfo, DeliveryContextValue } from "@/types/Delivery";

// Delivery details entered before payment, on the
// /commande/livraison page.
export type DeliveryInfo = {
  firstName: string;
  lastName: string;
  phone: string;
  street: string;
  postalCode: string;
  city: string;
};

// What DeliveryProvider exposes via useDelivery()
// (components/checkout/DeliveryContext.tsx).
export type DeliveryContextValue = {
  delivery: DeliveryInfo;
  setDelivery: (info: DeliveryInfo) => void;
  clearDelivery: () => void;
  isReady: boolean;
};
