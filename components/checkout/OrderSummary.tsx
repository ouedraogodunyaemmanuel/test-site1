"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart/CartContext";
import { useDelivery } from "./DeliveryContext";
import { formaterPrixCHF } from "@/lib/pricing";

export function OrderSummary() {
  const routeur = useRouter();
  const { articles, prixTotal, estPret: panierPret } = useCart();
  const { livraison, estPret: livraisonPrete } = useDelivery();
  const [enCoursDePaiement, setEnCoursDePaiement] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  // Redirige si le panier est vide, ou si les informations de livraison
  // n'ont pas été saisies. On attend que les deux contextes soient chargés
  // depuis le navigateur avant de vérifier, pour ne pas rediriger à tort
  // au premier rendu (voir estPret sur CartContext et DeliveryContext).
  useEffect(() => {
    if (!panierPret || !livraisonPrete) return;

    if (articles.length === 0) {
      routeur.replace("/");
      return;
    }

    const infosIncompletes =
      !livraison.prenom ||
      !livraison.nom ||
      !livraison.telephone ||
      !livraison.rue ||
      !livraison.codePostal ||
      !livraison.ville;
    if (infosIncompletes) {
      routeur.replace("/commande/livraison");
    }
  }, [panierPret, livraisonPrete, articles, livraison, routeur]);

  async function gererConfirmation() {
    setErreur(null);
    setEnCoursDePaiement(true);
    try {
      const reponse = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articles, livraison }),
      });
      const donnees = await reponse.json();
      if (!reponse.ok || !donnees.url) {
        throw new Error(donnees.error ?? "Le paiement n'a pas pu être initié.");
      }
      window.location.href = donnees.url;
    } catch (error) {
      setErreur(
        error instanceof Error ? error.message : "Une erreur est survenue."
      );
      setEnCoursDePaiement(false);
    }
  }

  return (
    <div className="mt-8 space-y-10">
      <section>
        <h2 className="font-serif text-xl text-stone-900">Articles</h2>
        <div className="mt-4 divide-y divide-stone-200">
          {articles.map((article) => (
            <div key={article.id} className="flex items-center gap-4 py-4">
              <div className="relative h-16 w-14 shrink-0 overflow-hidden bg-stone-200">
                <Image
                  src={article.image}
                  alt={article.titre}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </div>
              <div className="flex-1 text-sm">
                <p className="text-stone-900">
                  {article.titre} × {article.quantite}
                </p>
                <p className="text-stone-500">
                  {article.libelleFormat} · {article.libelleFinition} · {article.libelleCadre}
                </p>
              </div>
              <p className="text-stone-900">
                {formaterPrixCHF(article.prixUnitaire * article.quantite)}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between text-lg text-stone-900">
          <span>Total</span>
          <span>{formaterPrixCHF(prixTotal)}</span>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl text-stone-900">Livraison</h2>
          <Link
            href="/commande/livraison"
            className="text-sm text-stone-500 underline transition-colors hover:text-stone-900"
          >
            Modifier
          </Link>
        </div>
        <p className="mt-3 text-stone-600 leading-relaxed">
          {livraison.prenom} {livraison.nom}
          <br />
          {livraison.rue}
          <br />
          {livraison.codePostal} {livraison.ville}
          <br />
          {livraison.telephone}
        </p>
      </section>

      {erreur && <p className="text-sm text-red-600">{erreur}</p>}

      <button
        type="button"
        onClick={gererConfirmation}
        disabled={enCoursDePaiement}
        className="w-full bg-stone-900 px-6 py-3 text-sm tracking-wide text-stone-50 transition-colors hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {enCoursDePaiement ? "Redirection en cours…" : "Confirmer et payer"}
      </button>
    </div>
  );
}
