"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Print, SelectOption } from "@/types/print";
import { calculerPrix, formaterPrixCHF } from "@/lib/pricing";
import { obtenirUrlImageTirage, obtenirUrlVignetteTirage } from "@/lib/images";
import { FORMATS, FINITIONS, CADRES } from "@/data/options";
import { RATIOS_IMAGES } from "@/data/imageRatios.generated";
import { useCart } from "@/components/cart/CartContext";
import { PrintImage } from "@/components/shared/PrintImage";
import { OptionRow, PastilleCadre } from "./OptionRow";

// Doit correspondre au `duration-200` utilisé plus bas : c'est un
// minuteur, pas un événement transitionend, qui décide du démontage.
const ANIMATION_DURATION_MS = 200;

export function PrintDetailModal({
  tirage: print,
  onFermer: onClose,
}: {
  tirage: Print;
  onFermer: () => void;
}) {
  const { addItem, openCart } = useCart();
  const [selectedFormat, setSelectedFormat] = useState(FORMATS[0].value);
  const [selectedFinish, setSelectedFinish] = useState(FINITIONS[0].value);
  const [selectedFrame, setSelectedFrame] = useState(CADRES[0].value);
  const [noFrameConfirmationOpen, setNoFrameConfirmationOpen] = useState(false);

  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // Ratio verrouillé sur la première valeur connue : la fiche ne doit
  // pas changer de largeur pendant que le client parcourt les options.
  const [knownRatio, setKnownRatio] = useState<number | null>(
    RATIOS_IMAGES[print.imageFolder] ?? null,
  );
  const handleRatioKnown = useCallback((ratio: number) => {
    setKnownRatio((current) => current ?? ratio);
  }, []);

  useEffect(() => {
    const id = requestAnimationFrame(() => setIsVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const closeWithAnimation = useCallback(() => {
    setIsClosing(true);
    setTimeout(onClose, ANIMATION_DURATION_MS);
  }, [onClose]);

  // Les options sont toutes visibles d'emblée (plus de menus
  // dépliants), donc il n'y a plus de moment « ouverture du groupe »
  // pour anticiper le choix : on précharge les neuf combinaisons dès
  // l'ouverture de la fiche. Ce sont les mêmes fichiers que ceux déjà
  // pré-dimensionnés, et le navigateur les met en cache une fois pour
  // toutes — le changement d'option devient instantané.
  const variantesDejaPrechargees = useRef<Set<string>>(new Set());
  useEffect(() => {
    CADRES.forEach((cadre) => {
      FORMATS.forEach((format) => {
        const url = obtenirUrlImageTirage(print, cadre.value, format.value);
        if (variantesDejaPrechargees.current.has(url)) return;
        variantesDejaPrechargees.current.add(url);
        new window.Image().src = url;
      });
    });
  }, [print]);

  function addToCart() {
    addItem({
      id: `${print.id}-${selectedFormat}-${selectedFinish}-${selectedFrame}`,
      printId: print.id,
      title: print.title,
      // La photo enregistrée dans le panier correspond exactement aux
      // options du moment de l'ajout.
      image: obtenirUrlImageTirage(print, selectedFrame, selectedFormat),
      format: selectedFormat,
      frame: selectedFrame,
      formatLabel: findLabel(FORMATS, selectedFormat),
      finishLabel: findLabel(FINITIONS, selectedFinish),
      frameLabel: findLabel(CADRES, selectedFrame),
      unitPrice: calculerPrix(selectedFormat, selectedFrame),
    });
    closeWithAnimation();
    openCart();
  }

  function handleAddToCartClick() {
    if (selectedFrame === "aucun") {
      setNoFrameConfirmationOpen(true);
      return;
    }
    addToCart();
  }

  function handleChooseFrameClick() {
    setSelectedFrame("blanc");
    setNoFrameConfirmationOpen(false);
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      if (noFrameConfirmationOpen) {
        setNoFrameConfirmationOpen(false);
      } else {
        closeWithAnimation();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeWithAnimation, noFrameConfirmationOpen]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const isShown = isVisible && !isClosing;
  const isLandscape = (knownRatio ?? 2 / 3) >= 1;
  const prix = calculerPrix(selectedFormat, selectedFrame);
  const libelleFormat = findLabel(FORMATS, selectedFormat);
  const libelleCadre = findLabel(CADRES, selectedFrame);

  // Attention : obtenirUrlImageTirage renvoie `aucun.jpg` dès que le
  // cadre vaut "aucun", quel que soit le format — l'aperçu ne varie
  // donc avec le format que si un cadre est choisi. C'est le
  // comportement voulu de lib/images.ts, pas un oubli.
  const apercuChezVous = obtenirUrlImageTirage(print, selectedFrame, selectedFormat);
  const legendeChezVous =
    selectedFrame === "aucun"
      ? "Sans cadre, à l'échelle."
      : `Cadre ${libelleCadre.toLowerCase()}, format ${libelleFormat} cm, à l'échelle.`;

  return (
    <>
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center bg-[var(--scrim)] transition-opacity duration-200 sm:p-10 ${
          isShown ? "opacity-100" : "opacity-0"
        }`}
        onClick={closeWithAnimation}
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="print-detail-title"
          className={`relative flex h-full w-full flex-col overflow-y-auto bg-fond transition-all duration-200 sm:h-auto sm:max-h-full sm:flex-row sm:overflow-hidden sm:border sm:border-filet ${
            isLandscape ? "sm:max-w-7xl" : "sm:max-w-5xl"
          } ${isShown ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}
          onClick={(event) => event.stopPropagation()}
        >
          {/* Photo nue. Ne change JAMAIS avec les options : c'est
              l'aperçu « Chez vous » plus bas qui réagit.

              Deux rendus au lieu d'un, parce que le cadrage voulu
              n'est pas le même : à fond perdu et recadré sur mobile
              (dimensionnement="rempli", donc object-cover dans une
              boîte de hauteur imposée), photo entière sur son panneau
              en desktop (ajustement="contain", la boîte se dimensionne
              elle-même). Un seul rendu ne peut pas faire les deux :
              "rempli" exige un parent de hauteur connue, "contain" la
              calcule. Même URL dans les deux cas, donc un seul
              téléchargement. */}
          <div className="relative shrink-0 sm:flex sm:w-3/5 sm:items-center sm:justify-center sm:bg-panneau sm:p-8 lg:p-12">
            <div className="h-[42vh] w-full sm:hidden">
              <PrintImage
                src={obtenirUrlImageTirage(print, "aucun", FORMATS[0].value)}
                alt={print.title}
                sizes="100vw"
                unoptimized
                apercuFlouSrc={obtenirUrlVignetteTirage(print)}
                dimensionnement="rempli"
                knownRatio={RATIOS_IMAGES[print.imageFolder]}
                onRatioConnu={handleRatioKnown}
              />
            </div>
            <div className="hidden w-full sm:block">
              <PrintImage
                src={obtenirUrlImageTirage(print, "aucun", FORMATS[0].value)}
                alt={print.title}
                sizes="60vw"
                unoptimized
                apercuFlouSrc={obtenirUrlVignetteTirage(print)}
                ajustement="contain"
                knownRatio={RATIOS_IMAGES[print.imageFolder]}
                onRatioConnu={handleRatioKnown}
                // Plafonne la photo pour qu'un tirage en portrait ne
                // pousse pas la fiche dans une barre de défilement sur
                // une fenêtre basse.
                hauteurMaximaleVh={70}
                containerClassName="bg-transparent p-0"
              />
            </div>
            {/* Fondu vers la page, seulement sur mobile où la photo est
                à fond perdu. */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[var(--fond)] from-[4%] to-transparent sm:hidden" />
            <div className="absolute inset-x-0 top-0 flex items-center justify-between p-5 sm:hidden">
              <button
                type="button"
                onClick={closeWithAnimation}
                // Blanc en dur : le bouton est posé sur une photo, donc
                // il doit rester lisible dans les deux thèmes.
                className="text-[11px] tracking-[0.14em] text-white"
              >
                ← COLLECTION
              </button>
              <button
                type="button"
                onClick={closeWithAnimation}
                aria-label="Fermer"
                className="text-lg leading-none text-white"
              >
                ×
              </button>
            </div>
          </div>

          <div className="flex flex-1 flex-col sm:w-2/5 sm:overflow-y-auto">
            <div className="flex flex-col gap-7 px-6 pt-1 pb-8 sm:px-12 sm:pt-12">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3
                    id="print-detail-title"
                    className="font-serif text-3xl text-encre sm:text-4xl"
                  >
                    {print.title}
                  </h3>
                  <p className="mt-2 text-[11px] tracking-[0.16em] uppercase text-attenue">
                    {print.category}
                  </p>
                </div>
                {/* Toujours visible (pas seulement sur desktop) : une
                    fois la photo remontée hors champ par le scroll
                    (voir plus haut), c'est le seul bouton de fermeture
                    qui reste atteignable sur mobile. */}
                <button
                  type="button"
                  onClick={closeWithAnimation}
                  aria-label="Fermer"
                  className="text-xl leading-none text-attenue transition-colors hover:text-encre"
                >
                  ×
                </button>
              </div>

              <div className="flex flex-col gap-5">
                <OptionRow
                  titre="Format"
                  suffixe="cm"
                  options={FORMATS}
                  valeurActuelle={selectedFormat}
                  colonnes={3}
                  onSelectionner={setSelectedFormat}
                />
                <OptionRow
                  titre="Finition"
                  options={FINITIONS}
                  valeurActuelle={selectedFinish}
                  colonnes={2}
                  onSelectionner={setSelectedFinish}
                />
                <OptionRow
                  titre="Cadre aluminium"
                  options={CADRES}
                  valeurActuelle={selectedFrame}
                  colonnes={4}
                  onSelectionner={setSelectedFrame}
                  rendreOption={PastilleCadre}
                />
              </div>

              {/* Mise en situation : suit le cadre et le format choisis. */}
              <div className="flex flex-col gap-3">
                <span className="text-[11px] tracking-[0.16em] uppercase text-attenue">
                  Chez vous
                </span>
                <div className="bg-panneau px-9 py-7">
                  <PrintImage
                    src={apercuChezVous}
                    alt={`${print.title} — ${legendeChezVous}`}
                    sizes="(min-width: 640px) 30vw, 90vw"
                    unoptimized
                    ajustement="contain"
                    knownRatio={RATIOS_IMAGES[print.imageFolder]}
                  />
                </div>
                <p className="text-xs text-faible">{legendeChezVous}</p>
              </div>

              <div className="flex flex-col gap-2 border-t border-filet pt-5">
                <span className="text-[11px] tracking-[0.16em] uppercase text-attenue">
                  Le tirage
                </span>
                <p className="text-[13px] leading-[1.7] text-pretty text-texte">
                  Papier HP 250 g/m², traité pour le protéger de l&apos;humidité, de la
                  lumière et des rayures. Imprimé à la commande, expédié sous 5 à 7
                  jours.
                </p>
              </div>
            </div>

            {/* Barre d'action collée en bas : le prix reste sous les
                yeux pendant tout le choix des options. */}
            <div className="sticky bottom-0 mt-auto flex items-center gap-4 border-t border-filet bg-[var(--fond-voile)] px-6 py-4 backdrop-blur-md sm:px-12 sm:py-6">
              <div className="flex flex-col">
                <span className="text-lg text-encre sm:text-2xl">
                  {formaterPrixCHF(prix)}
                </span>
                <span className="text-[11px] text-attenue">
                  Livraison offerte en Suisse
                </span>
              </div>
              <button
                type="button"
                onClick={handleAddToCartClick}
                className="h-13 flex-1 bg-accent text-xs font-semibold tracking-[0.16em] uppercase text-fond transition-opacity hover:opacity-90 active:scale-[0.97]"
              >
                Ajouter au panier
              </button>
            </div>
          </div>
        </div>
      </div>

      {noFrameConfirmationOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Confirmation sans cadre"
          className="fixed inset-0 z-60 flex items-center justify-center bg-[var(--scrim)] p-6"
          onClick={() => setNoFrameConfirmationOpen(false)}
        >
          <div
            className="w-full max-w-md border border-filet bg-fond p-7"
            onClick={(event) => event.stopPropagation()}
          >
            <p className="text-encre">
              Êtes-vous sûr de vouloir continuer sans cadre&nbsp;?
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleChooseFrameClick}
                className="h-13 flex-1 bg-accent text-xs font-semibold tracking-[0.16em] uppercase text-fond transition-opacity hover:opacity-90"
              >
                Choisir un cadre
              </button>
              <button
                type="button"
                onClick={() => {
                  setNoFrameConfirmationOpen(false);
                  addToCart();
                }}
                className="h-13 flex-1 border border-filet text-xs tracking-[0.16em] uppercase text-attenue transition-colors hover:border-filet-fort hover:text-encre"
              >
                Continuer sans cadre
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function findLabel(options: SelectOption[], value: string): string {
  return options.find((option) => option.value === value)?.label ?? value;
}
