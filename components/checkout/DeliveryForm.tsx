"use client";

import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart/CartContext";
import { useDelivery } from "./DeliveryContext";

export function DeliveryForm() {
  const routeur = useRouter();
  const { items, isReady: cartReady } = useCart();
  const { delivery, setDelivery, isReady: deliveryReady } = useDelivery();
  const [formulaire, setFormulaire] = useState(delivery);

  // An empty cart has nothing to deliver: we wait for the cart to be
  // loaded from the browser before checking, so we don't redirect
  // wrongly on the very first render (see isReady on CartContext).
  useEffect(() => {
    if (cartReady && items.length === 0) {
      routeur.replace("/");
    }
  }, [cartReady, items, routeur]);

  // Pre-fills the form if delivery details were already entered
  // during a previous visit.
  useEffect(() => {
    if (deliveryReady) {
      setFormulaire(delivery);
    }
  }, [deliveryReady, delivery]);

  function gererChangement(champ: keyof typeof formulaire) {
    return (evenement: ChangeEvent<HTMLInputElement>) => {
      setFormulaire((current) => ({ ...current, [champ]: evenement.target.value }));
    };
  }

  function gererEnvoi(evenement: FormEvent<HTMLFormElement>) {
    evenement.preventDefault();
    setDelivery(formulaire);
    routeur.push("/commande/recapitulatif");
  }

  return (
    <form onSubmit={gererEnvoi} className="mt-8 space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <Champ
          label="Prénom"
          id="firstName"
          value={formulaire.firstName}
          onChange={gererChangement("firstName")}
        />
        <Champ
          label="Nom"
          id="lastName"
          value={formulaire.lastName}
          onChange={gererChangement("lastName")}
        />
      </div>
      <Champ
        label="Téléphone"
        id="phone"
        type="tel"
        value={formulaire.phone}
        onChange={gererChangement("phone")}
      />
      <Champ
        label="Adresse (rue et numéro)"
        id="street"
        value={formulaire.street}
        onChange={gererChangement("street")}
      />
      <div className="grid gap-6 sm:grid-cols-[120px_1fr]">
        <Champ
          label="NPA"
          id="postalCode"
          value={formulaire.postalCode}
          onChange={gererChangement("postalCode")}
        />
        <Champ
          label="Ville"
          id="city"
          value={formulaire.city}
          onChange={gererChangement("city")}
        />
      </div>
      <button
        type="submit"
        className="w-full bg-stone-900 px-6 py-3 text-sm tracking-wide text-stone-50 transition hover:bg-stone-700 active:scale-[0.97]"
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
