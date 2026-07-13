"use client";

import { useCallback, useEffect, useState } from "react";
import type { OptionGroupName, Print, SelectOption } from "@/types/print";
import { calculerPrix, formaterPrixCHF } from "@/lib/pricing";
import { obtenirUrlImageTirage } from "@/lib/images";
import { FORMATS, FINITIONS, CADRES } from "@/data/options";
import { useCart } from "@/components/cart/CartContext";
import { PrintImage } from "@/components/shared/PrintImage";
import { OptionGroup } from "./OptionGroup";

// Duration (ms) of the fade/scale transition — must match the
// `duration-200` Tailwind class used below, since we rely on a timer
// (not a CSS transitionend event) to know when it's safe to actually
// unmount the modal.
const DUREE_ANIMATION_MS = 200;

export function PrintDetailModal({
  tirage,
  onFermer,
}: {
  tirage: Print;
  onFermer: () => void;
}) {
  const { addItem, openCart } = useCart();
  const [formatSelectionne, setFormatSelectionne] = useState(FORMATS[0].value);
  const [finitionSelectionnee, setFinitionSelectionnee] = useState(FINITIONS[0].value);
  // "blanc" is the frame shown by default when the modal opens,
  // rather than the first element of CADRES (which is "aucun").
  const [cadreSelectionne, setCadreSelectionne] = useState(
    CADRES.find((option) => option.value === "blanc")?.value ?? CADRES[0].value
  );
  const [groupeOuvert, setGroupeOuvert] = useState<OptionGroupName | null>(null);

  // Controls the fade/scale-in and fade/scale-out animation: the modal
  // starts hidden, becomes visible right after mounting, and is marked
  // "closing" for the short time the exit transition plays before the
  // parent actually removes it from the page.
  const [estVisible, setEstVisible] = useState(false);
  const [enFermeture, setEnFermeture] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setEstVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // Plays the exit transition, then tells the parent to actually
  // unmount the modal once it's finished.
  const fermerAvecAnimation = useCallback(() => {
    setEnFermeture(true);
    setTimeout(onFermer, DUREE_ANIMATION_MS);
  }, [onFermer]);

  function basculerGroupe(nom: OptionGroupName) {
    setGroupeOuvert((current) => (current === nom ? null : nom));
  }

  // Adds the print to the cart with the currently selected options,
  // then opens the cart to visually confirm the addition worked.
  function gererAjoutPanier() {
    addItem({
      id: `${tirage.id}-${formatSelectionne}-${finitionSelectionnee}-${cadreSelectionne}`,
      printId: tirage.id,
      title: tirage.title,
      // The image saved in the cart matches exactly the frame chosen
      // at the time it was added — it won't change afterwards even if
      // the customer reopens the product page and changes their mind.
      image: obtenirUrlImageTirage(tirage, cadreSelectionne, formatSelectionne),
      format: formatSelectionne,
      frame: cadreSelectionne,
      formatLabel: trouverLabel(FORMATS, formatSelectionne),
      finishLabel: trouverLabel(FINITIONS, finitionSelectionnee),
      frameLabel: trouverLabel(CADRES, cadreSelectionne),
      unitPrice: calculerPrix(formatSelectionne, cadreSelectionne),
    });
    fermerAvecAnimation();
    openCart();
  }

  // Close the modal with the Escape key, for correct keyboard navigation.
  useEffect(() => {
    function gererTouche(evenement: KeyboardEvent) {
      if (evenement.key === "Escape") {
        fermerAvecAnimation();
      }
    }
    window.addEventListener("keydown", gererTouche);
    return () => window.removeEventListener("keydown", gererTouche);
  }, [fermerAvecAnimation]);

  // Lock background scrolling while the modal is open, and restore the
  // previous value on close (fixes the page scrolling behind the modal).
  useEffect(() => {
    const debordementPrecedent = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = debordementPrecedent;
    };
  }, []);

  const estAffiche = estVisible && !enFermeture;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 transition-opacity duration-200 sm:p-10 ${
        estAffiche ? "opacity-100" : "opacity-0"
      }`}
      onClick={fermerAvecAnimation}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="print-detail-title"
        className={`relative flex max-h-full w-full max-w-4xl flex-col overflow-y-auto bg-stone-50 transition-all duration-200 sm:flex-row ${
          estAffiche ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
        onClick={(evenement) => evenement.stopPropagation()}
      >
        <div className="w-full shrink-0 sm:w-3/5">
          <PrintImage
            // Changes dynamically with the format and frame selected
            // below.
            src={obtenirUrlImageTirage(tirage, cadreSelectionne, formatSelectionne)}
            alt={tirage.title}
            sizes="(min-width: 640px) 60vw, 100vw"
            ajustement="contain"
          />
        </div>
        <div className="flex w-full flex-col justify-between p-8 sm:w-2/5">
          <div>
            <h3 id="print-detail-title" className="font-serif text-2xl text-stone-900">
              {tirage.title}
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
              className="bg-stone-900 px-6 py-3 text-sm tracking-wide text-stone-50 transition hover:bg-stone-700 active:scale-[0.97]"
            >
              Ajouter au panier
            </button>
            <button
              type="button"
              onClick={fermerAvecAnimation}
              className="border border-stone-300 px-6 py-3 text-sm tracking-wide text-stone-600 transition hover:border-stone-900 hover:text-stone-900 active:scale-[0.97]"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Finds the human-readable label (e.g. "Mat") matching a technical
// value (e.g. "mat") in a list of options.
function trouverLabel(options: SelectOption[], valeur: string): string {
  return options.find((option) => option.value === valeur)?.label ?? valeur;
}
