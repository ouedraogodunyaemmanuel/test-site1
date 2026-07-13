"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { ValeurContextePanier, ArticlePanier } from "@/types/print";

const CartContext = createContext<ValeurContextePanier | null>(null);

const CART_STORAGE_KEY = "deo-creation-panier";

export function CartProvider({ children }: { children: ReactNode }) {
  const [articles, setArticles] = useState<ArticlePanier[]>([]);
  const [estOuvert, setEstOuvert] = useState(false);
  // Le localStorage n'existe que côté navigateur : on ne peut pas le lire
  // pendant le premier rendu (fait aussi côté serveur par Next.js). On
  // attend donc que le composant soit monté dans le navigateur.
  const [estMonte, setEstMonte] = useState(false);

  useEffect(() => {
    const panierSauvegarde = window.localStorage.getItem(CART_STORAGE_KEY);
    if (panierSauvegarde) {
      setArticles(JSON.parse(panierSauvegarde));
    }
    setEstMonte(true);
  }, []);

  useEffect(() => {
    if (estMonte) {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(articles));
    }
  }, [articles, estMonte]);

  function ajouterArticle(nouvelArticle: Omit<ArticlePanier, "quantite">) {
    setArticles((current) => {
      const articleExistant = current.find(
        (article) => article.id === nouvelArticle.id
      );
      if (articleExistant) {
        return current.map((article) =>
          article.id === nouvelArticle.id
            ? { ...article, quantite: article.quantite + 1 }
            : article
        );
      }
      return [...current, { ...nouvelArticle, quantite: 1 }];
    });
  }

  function retirerArticle(id: string) {
    setArticles((current) => current.filter((article) => article.id !== id));
  }

  function mettreAJourQuantite(id: string, quantite: number) {
    if (quantite < 1) {
      retirerArticle(id);
      return;
    }
    setArticles((current) =>
      current.map((article) => (article.id === id ? { ...article, quantite } : article))
    );
  }

  function viderPanier() {
    setArticles([]);
  }

  const nombreArticles = articles.reduce((somme, article) => somme + article.quantite, 0);
  const prixTotal = articles.reduce(
    (somme, article) => somme + article.prixUnitaire * article.quantite,
    0
  );

  return (
    <CartContext.Provider
      value={{
        articles,
        ajouterArticle,
        retirerArticle,
        mettreAJourQuantite,
        viderPanier,
        estPret: estMonte,
        nombreArticles,
        prixTotal,
        estOuvert,
        ouvrirPanier: () => setEstOuvert(true),
        fermerPanier: () => setEstOuvert(false),
        basculerPanier: () => setEstOuvert((current) => !current),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart() doit être appelé à l'intérieur d'un <CartProvider>.");
  }
  return context;
}
