"use client";

import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart/CartContext";
import { useDelivery } from "./DeliveryContext";

export function DeliveryForm() {
  const router = useRouter();
  const { items, isReady: panierPret } = useCart();
  const { delivery, setDelivery, isReady: livraisonPrete } = useDelivery();
  const [form, setForm] = useState(delivery);

  // Un panier vide n'a rien à livrer : on attend que le panier soit
  // chargé depuis le navigateur avant de vérifier, pour ne pas rediriger
  // à tort au tout premier rendu (voir isReady sur CartContext).
  useEffect(() => {
    if (panierPret && items.length === 0) {
      router.replace("/");
    }
  }, [panierPret, items, router]);

  // Pré-remplit le formulaire si des coordonnées avaient déjà été saisies
  // lors d'une visite précédente.
  useEffect(() => {
    if (livraisonPrete) {
      setForm(delivery);
    }
  }, [livraisonPrete, delivery]);

  function handleChange(champ: keyof typeof form) {
    return (event: ChangeEvent<HTMLInputElement>) => {
      setForm((current) => ({ ...current, [champ]: event.target.value }));
    };
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setDelivery(form);
    router.push("/commande/recapitulatif");
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <Champ
          label="Prénom"
          id="firstName"
          value={form.firstName}
          onChange={handleChange("firstName")}
        />
        <Champ
          label="Nom"
          id="lastName"
          value={form.lastName}
          onChange={handleChange("lastName")}
        />
      </div>
      <Champ
        label="Téléphone"
        id="phone"
        type="tel"
        value={form.phone}
        onChange={handleChange("phone")}
      />
      <Champ
        label="Adresse (rue et numéro)"
        id="street"
        value={form.street}
        onChange={handleChange("street")}
      />
      <div className="grid gap-6 sm:grid-cols-[120px_1fr]">
        <Champ
          label="NPA"
          id="postalCode"
          value={form.postalCode}
          onChange={handleChange("postalCode")}
        />
        <Champ
          label="Ville"
          id="city"
          value={form.city}
          onChange={handleChange("city")}
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
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
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
