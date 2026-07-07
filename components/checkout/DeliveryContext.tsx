"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { DeliveryInfo } from "@/types/print";

const DELIVERY_STORAGE_KEY = "deo-creation-livraison";

const infosVides: DeliveryInfo = {
  firstName: "",
  lastName: "",
  phone: "",
  street: "",
  postalCode: "",
  city: "",
};

type DeliveryContextValue = {
  delivery: DeliveryInfo;
  setDelivery: (info: DeliveryInfo) => void;
  clearDelivery: () => void;
  // true une fois les informations chargées depuis le navigateur : évite
  // qu'une page vérifie "les infos sont vides" avant la fin du chargement
  // et redirige à tort.
  isReady: boolean;
};

const DeliveryContext = createContext<DeliveryContextValue | null>(null);

export function DeliveryProvider({ children }: { children: ReactNode }) {
  const [delivery, setDeliveryState] = useState<DeliveryInfo>(infosVides);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const sauvegarde = window.localStorage.getItem(DELIVERY_STORAGE_KEY);
    if (sauvegarde) {
      setDeliveryState(JSON.parse(sauvegarde));
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
    setDeliveryState(infosVides);
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
