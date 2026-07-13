"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { DeliveryContextValue, DeliveryInfo } from "@/types/Delivery";

const DELIVERY_STORAGE_KEY = "deo-creation-livraison";

const emptyInfo: DeliveryInfo = {
  firstName: "",
  lastName: "",
  phone: "",
  street: "",
  postalCode: "",
  city: "",
};

const DeliveryContext = createContext<DeliveryContextValue | null>(null);

export function DeliveryProvider({ children }: { children: ReactNode }) {
  const [delivery, setDeliveryState] = useState<DeliveryInfo>(emptyInfo);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(DELIVERY_STORAGE_KEY);
    if (saved) {
      setDeliveryState(JSON.parse(saved));
    }
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (isReady) {
      window.localStorage.setItem(DELIVERY_STORAGE_KEY, JSON.stringify(delivery));
    }
  }, [delivery, isReady]);

  function setDelivery(info: DeliveryInfo) {
    setDeliveryState(info);
  }

  function clearDelivery() {
    setDeliveryState(emptyInfo);
  }

  return (
    <DeliveryContext.Provider
      value={{ delivery, setDelivery, clearDelivery, isReady }}
    >
      {children}
    </DeliveryContext.Provider>
  );
}

export function useDelivery() {
  const context = useContext(DeliveryContext);
  if (!context) {
    throw new Error(
      "useDelivery() doit être appelé à l'intérieur d'un <DeliveryProvider>."
    );
  }
  return context;
}
