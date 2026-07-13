"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { ValeurContexteLivraison, InfosLivraison } from "@/types/print";

const DELIVERY_STORAGE_KEY = "deo-creation-livraison";

const infosVides: InfosLivraison = {
  prenom: "",
  nom: "",
  telephone: "",
  rue: "",
  codePostal: "",
  ville: "",
};

const DeliveryContext = createContext<ValeurContexteLivraison | null>(null);

export function DeliveryProvider({ children }: { children: ReactNode }) {
  const [livraison, setLivraisonEtat] = useState<InfosLivraison>(infosVides);
  const [estPret, setEstPret] = useState(false);

  useEffect(() => {
    const sauvegarde = window.localStorage.getItem(DELIVERY_STORAGE_KEY);
    if (sauvegarde) {
      setLivraisonEtat(JSON.parse(sauvegarde));
    }
    setEstPret(true);
  }, []);

  useEffect(() => {
    if (estPret) {
      window.localStorage.setItem(DELIVERY_STORAGE_KEY, JSON.stringify(livraison));
    }
  }, [livraison, estPret]);

  function definirLivraison(infos: InfosLivraison) {
    setLivraisonEtat(infos);
  }

  function viderLivraison() {
    setLivraisonEtat(infosVides);
  }

  return (
    <DeliveryContext.Provider
      value={{ livraison, definirLivraison, viderLivraison, estPret }}
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
