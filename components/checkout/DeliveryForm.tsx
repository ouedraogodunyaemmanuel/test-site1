"use client";

import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart/CartContext";
import { useDelivery } from "./DeliveryContext";

export function DeliveryForm() {
  const routeur = useRouter();
  const { articles, estPret: panierPret } = useCart();
  const { livraison, definirLivraison, estPret: livraisonPrete } = useDelivery();
  const [formulaire, setFormulaire] = useState(livraison);

  // Un panier vide n'a rien à livrer : on attend que le panier soit
  // chargé depuis le navigateur avant de vérifier, pour ne pas rediriger
  // à tort au tout premier rendu (voir estPret sur CartContext).
  useEffect(() => {
    if (panierPret && articles.length === 0) {
      routeur.replace("/");
    }
  }, [panierPret, articles, routeur]);

  // Pré-remplit le formulaire si des coordonnées avaient déjà été saisies
  // lors d'une visite précédente.
  useEffect(() => {
    if (livraisonPrete) {
      setFormulaire(livraison);
    }
  }, [livraisonPrete, livraison]);

  function gererChangement(champ: keyof typeof formulaire) {
    return (evenement: ChangeEvent<HTMLInputElement>) => {
      setFormulaire((current) => ({ ...current, [champ]: evenement.target.value }));
    };
  }

  function gererEnvoi(evenement: FormEvent<HTMLFormElement>) {
    evenement.preventDefault();
    definirLivraison(formulaire);
    routeur.push("/commande/recapitulatif");
  }

  return (
    <form onSubmit={gererEnvoi} className="mt-8 space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <Champ
          label="Prénom"
          id="prenom"
          value={formulaire.prenom}
          onChange={gererChangement("prenom")}
        />
        <Champ
          label="Nom"
          id="nom"
          value={formulaire.nom}
          onChange={gererChangement("nom")}
        />
      </div>
      <Champ
        label="Téléphone"
        id="telephone"
        type="tel"
        value={formulaire.telephone}
        onChange={gererChangement("telephone")}
      />
      <Champ
        label="Adresse (rue et numéro)"
        id="rue"
        value={formulaire.rue}
        onChange={gererChangement("rue")}
      />
      <div className="grid gap-6 sm:grid-cols-[120px_1fr]">
        <Champ
          label="NPA"
          id="codePostal"
          value={formulaire.codePostal}
          onChange={gererChangement("codePostal")}
        />
        <Champ
          label="Ville"
          id="ville"
          value={formulaire.ville}
          onChange={gererChangement("ville")}
        />
      </div>
      <button
        type="submit"
        className="w-full bg-stone-900 px-6 py-3 text-sm tracking-wide text-stone-50 transition-colors hover:bg-stone-700"
      >
        Continuer vers le récapitulatif
      </button>
    </form>
  );
}

function Champ({
  label,
  id,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  id: string;
  value: string;
  onChange: (evenement: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm text-stone-600">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required
        value={value}
        onChange={onChange}
        className="mt-1 w-full border border-stone-300 px-4 py-2 text-sm text-stone-900 focus:border-stone-900 focus:outline-none"
      />
    </div>
  );
}
