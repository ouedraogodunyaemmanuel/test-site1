"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { NomGroupeOption, Tirage, OptionSelection } from "@/types/print";
import { calculerPrix, formaterPrixCHF } from "@/lib/pricing";
import { obtenirUrlImageTirage } from "@/lib/images";
import { FORMATS, FINITIONS, CADRES } from "@/data/options";
import { useCart } from "@/components/cart/CartContext";
import { OptionGroup } from "./OptionGroup";

export function PrintDetailModal({
  tirage,
  onFermer,
}: {
  tirage: Tirage;
  onFermer: () => void;
}) {
  const { ajouterArticle, ouvrirPanier } = useCart();
  const [formatSelectionne, setFormatSelectionne] = useState(FORMATS[0].valeur);
  const [finitionSelectionnee, setFinitionSelectionnee] = useState(FINITIONS[0].valeur);
  const [cadreSelectionne, setCadreSelectionne] = useState(CADRES[0].valeur);
  const [groupeOuvert, setGroupeOuvert] = useState<NomGroupeOption | null>(null);

  function basculerGroupe(nom: NomGroupeOption) {
    setGroupeOuvert((current) => (current === nom ? null : nom));
  }

  // Ajoute le tirage au panier avec les options actuellement sélectionnées,
  // puis ouvre le panier pour confirmer visuellement que l'ajout a marché.
  function gererAjoutPanier() {
    ajouterArticle({
      id: `${tirage.id}-${formatSelectionne}-${finitionSelectionnee}-${cadreSelectionne}`,
      idTirage: tirage.id,
      titre: tirage.titre,
      // L'image enregistrée dans le panier correspond exactement au
      // cadre choisi au moment de l'ajout — elle ne bougera plus ensuite
      // même si le client rouvre la fiche produit et change d'avis.
      image: obtenirUrlImageTirage(tirage, cadreSelectionne, formatSelectionne),
      format: formatSelectionne,
      cadre: cadreSelectionne,
      libelleFormat: trouverLabel(FORMATS, formatSelectionne),
      libelleFinition: trouverLabel(FINITIONS, finitionSelectionnee),
      libelleCadre: trouverLabel(CADRES, cadreSelectionne),
      prixUnitaire: calculerPrix(formatSelectionne, cadreSelectionne),
    });
    onFermer();
    ouvrirPanier();
  }

  // Ferme la fenêtre avec la touche Échap, pour une navigation clavier correcte.
  useEffect(() => {
    function gererTouche(evenement: KeyboardEvent) {
      if (evenement.key === "Escape") {
        onFermer();
      }
    }
    window.addEventListener("keydown", gererTouche);
    return () => window.removeEventListener("keydown", gererTouche);
  }, [onFermer]);

  // Bloque le défilement de l'arrière-plan tant que la fenêtre est ouverte,
  // et restaure la valeur précédente à la fermeture (corrige le défilement
  // de la page derrière la fenêtre).
  useEffect(() => {
    const debordementPrecedent = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = debordementPrecedent;
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 sm:p-10"
      onClick={onFermer}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="print-detail-title"
        className="relative flex max-h-full w-full max-w-4xl flex-col overflow-y-auto bg-stone-50 sm:flex-row"
        onClick={(evenement) => evenement.stopPropagation()}
      >
        <div className="relative aspect-[4/5] w-full shrink-0 sm:w-3/5">
          <Image
            // Change dynamiquement avec le format et le cadre sélectionnés
            // ci-dessous.
            src={obtenirUrlImageTirage(tirage, cadreSelectionne, formatSelectionne)}
            alt={tirage.titre}
            fill
            sizes="(min-width: 640px) 60vw, 100vw"
            className="object-cover"
          />
        </div>
        <div className="flex w-full flex-col justify-between p-8 sm:w-2/5">
          <div>
            <h3 id="print-detail-title" className="font-serif text-2xl text-stone-900">
              {tirage.titre}
            </h3>
            <p className="mt-6 text-2xl text-stone-900">
              {formaterPrixCHF(calculerPrix(formatSelectionne, cadreSelectionne))}
            </p>

            <div className="mt-6">
              <OptionGroup
                titre="Format"
                options={FORMATS}
                valeurActuelle={formatSelectionne}
                estOuvert={groupeOuvert === "format"}
                onBasculer={() => basculerGroupe("format")}
                onSelectionner={setFormatSelectionne}
              />
              <OptionGroup
                titre="Finition"
                options={FINITIONS}
                valeurActuelle={finitionSelectionnee}
                estOuvert={groupeOuvert === "finition"}
                onBasculer={() => basculerGroupe("finition")}
                onSelectionner={setFinitionSelectionnee}
              />
              <OptionGroup
                titre="Cadre"
                options={CADRES}
                valeurActuelle={cadreSelectionne}
                estOuvert={groupeOuvert === "cadre"}
                onBasculer={() => basculerGroupe("cadre")}
                onSelectionner={setCadreSelectionne}
              />
            </div>
          </div>
          <div className="mt-8 flex flex-col gap-3">
            <button
              type="button"
              onClick={gererAjoutPanier}
              className="bg-stone-900 px-6 py-3 text-sm tracking-wide text-stone-50 transition-colors hover:bg-stone-700"
            >
              Ajouter au panier
            </button>
            <button
              type="button"
              onClick={onFermer}
              className="border border-stone-300 px-6 py-3 text-sm tracking-wide text-stone-600 transition-colors hover:border-stone-900 hover:text-stone-900"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Retrouve le libellé lisible (ex. "Mat") correspondant à une valeur
// technique (ex. "mat") dans une liste d'options.
function trouverLabel(options: OptionSelection[], valeur: string): string {
  return options.find((option) => option.valeur === valeur)?.libelle ?? valeur;
}
