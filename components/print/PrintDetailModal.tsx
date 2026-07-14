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
  // "aucun" (no frame) is the frame shown by default when the modal opens.
  const [selectedFrame, setSelectedFrame] = useState(CADRES[0].value);
  // The photo's real width/height ratio, reported by PrintImage once
  // loaded. Used to widen the modal for landscape photos — with a
  // fixed dialog width, a landscape photo renders much shorter than a
  // portrait one, so it looks noticeably smaller by comparison.
  const [knownRatio, setKnownRatio] = useState<number | null>(null);
  // A Set (not a single value) so several dropdowns can stay open at
  // once — picking a sub-option no longer closes its group either,
  // only clicking the group's own button toggles it.
  const [openGroups, setOpenGroups] = useState<Set<OptionGroupName>>(new Set());
  // Shown when the customer tries to add a print without a frame, so
  // they can confirm this choice on purpose (whatever format/finish
  // they picked otherwise).
  const [noFrameConfirmationOpen, setNoFrameConfirmationOpen] = useState(false);

  // Controls the fade/scale-in and fade/scale-out animation: the modal
  // starts hidden, becomes visible right after mounting, and is marked
  // "closing" for the short time the exit transition plays before the
  // parent actually removes it from the page.
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setIsVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // Plays the exit transition, then tells the parent to actually
  // unmount the modal once it's finished.
  const closeWithAnimation = useCallback(() => {
    setIsClosing(true);
    setTimeout(onClose, ANIMATION_DURATION_MS);
  }, [onClose]);

  function toggleGroup(name: OptionGroupName) {
    setOpenGroups((current) => {
      const next = new Set(current);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  }

  // Adds the print to the cart with the currently selected options,
  // then opens the cart to visually confirm the addition worked.
  function addToCart() {
    addItem({
      id: `${print.id}-${selectedFormat}-${selectedFinish}-${selectedFrame}`,
      printId: print.id,
      title: print.title,
      // The image saved in the cart matches exactly the frame chosen
      // at the time it was added — it won't change afterwards even if
      // the customer reopens the product page and changes their mind.
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

  // Without a frame, the print is added straight away. With "aucun"
  // selected as the frame, we ask for confirmation first — regardless
  // of the format or finish chosen — since customers sometimes forget
  // to pick a frame rather than actively choosing to go without one.
  function handleAddToCartClick() {
    if (selectedFrame === "aucun") {
      setNoFrameConfirmationOpen(true);
      return;
    }
    addToCart();
  }

  // Pre-selects the "blanc" frame as a sensible default and opens the
  // frame dropdown, so the customer can immediately pick a different
  // one if they prefer, instead of having to reopen the group by hand.
  function handleChooseFrameClick() {
    setSelectedFrame("blanc");
    setOpenGroups((current) => new Set(current).add("cadre"));
    setNoFrameConfirmationOpen(false);
  }

  // Close the modal with the Escape key, for correct keyboard navigation.
  // While the "sans cadre" confirmation is open, Escape only dismisses
  // it and leaves the print detail modal open.
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        if (noFrameConfirmationOpen) {
          setNoFrameConfirmationOpen(false);
        } else {
          closeWithAnimation();
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeWithAnimation, noFrameConfirmationOpen]);

  // Lock background scrolling while the modal is open, and restore the
  // previous value on close (fixes the page scrolling behind the modal).
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const isShown = isVisible && !isClosing;
  // Before the photo loads, guess portrait (matches PrintImage's own
  // default guess) so the dialog doesn't flash wide then shrink back.
  const isLandscape = (knownRatio ?? 2 / 3) >= 1;

  return (
    <>
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 transition-opacity duration-200 sm:p-10 ${
          isShown ? "opacity-100" : "opacity-0"
        }`}
        onClick={closeWithAnimation}
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="print-detail-title"
          className={`relative flex max-h-full w-full flex-col overflow-y-auto bg-stone-50 transition-all duration-200 sm:flex-row ${
            isLandscape ? "max-w-7xl" : "max-w-4xl"
          } ${isShown ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex w-full shrink-0 items-center justify-center sm:w-3/5">
            <PrintImage
              // Changes dynamically with the format and frame selected
              // below.
              src={obtenirUrlImageTirage(print, selectedFrame, selectedFormat)}
              alt={print.title}
              sizes="(min-width: 640px) 60vw, 100vw"
              // Ces fichiers sont déjà pré-dimensionnés pour cet
              // affichage (voir la compression des public/images/tirages/*
              // et scripts/generer-vignettes.mjs) : pas besoin de
              // repasser par l'optimiseur d'images de Next.js, qui
              // ajoutait un vrai temps de traitement à chaque nouvelle
              // taille demandée.
              unoptimized
              ajustement="contain"
              containerClassName="w-full"
              onRatioConnu={setKnownRatio}
              // Caps the photo's height to a share of the viewport so a
              // tall portrait photo shrinks on a short browser window
              // instead of pushing the modal into a scrollbar.
              hauteurMaximaleClassName="max-h-[70vh]"
            />
          </div>
          <div className="flex w-full flex-col justify-between p-8 sm:w-2/5">
            <div>
              <h3 id="print-detail-title" className="font-serif text-2xl text-stone-900">
                {print.title}
              </h3>
              <p className="mt-6 text-2xl text-stone-900">
                {formaterPrixCHF(calculerPrix(selectedFormat, selectedFrame))}
              </p>

              <div className="mt-6">
                <OptionGroup
                  titre="Format"
                  options={FORMATS}
                  valeurActuelle={selectedFormat}
                  estOuvert={openGroups.has("format")}
                  onBasculer={() => toggleGroup("format")}
                  onSelectionner={setSelectedFormat}
                />
                <OptionGroup
                  titre="Finition"
                  options={FINITIONS}
                  valeurActuelle={selectedFinish}
                  estOuvert={openGroups.has("finition")}
                  onBasculer={() => toggleGroup("finition")}
                  onSelectionner={setSelectedFinish}
                />
                <OptionGroup
                  titre="Cadre aluminium"
                  options={CADRES}
                  valeurActuelle={selectedFrame}
                  estOuvert={openGroups.has("cadre")}
                  onBasculer={() => toggleGroup("cadre")}
                  onSelectionner={setSelectedFrame}
                />
              </div>
            </div>
            <div className="mt-8 flex flex-col gap-3">
              <button
                type="button"
                onClick={handleAddToCartClick}
                className="bg-stone-900 px-6 py-3 text-sm tracking-wide text-stone-50 transition hover:bg-stone-700 active:scale-[0.93]"
              >
                Ajouter au panier
              </button>
              <button
                type="button"
                onClick={closeWithAnimation}
                className="border border-stone-300 px-6 py-3 text-sm tracking-wide text-stone-600 transition hover:border-stone-900 hover:text-stone-900 active:scale-[0.93]"
              >
                Fermer
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
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4"
          onClick={() => setNoFrameConfirmationOpen(false)}
        >
          <div
            className="w-full max-w-md bg-stone-50 p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <p className="text-stone-900">
              Êtes-vous sûr de vouloir continuer sans cadre&nbsp;?
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <button
                type="button"
                onClick={handleChooseFrameClick}
                className="bg-stone-900 px-6 py-3 text-sm tracking-wide text-stone-50 transition hover:bg-stone-700 active:scale-[0.93]"
              >
                Choisir un cadre
              </button>
              <button
                type="button"
                onClick={() => {
                  setNoFrameConfirmationOpen(false);
                  addToCart();
                }}
                className="border border-stone-300 px-6 py-3 text-sm tracking-wide text-stone-600 transition hover:border-stone-900 hover:text-stone-900 active:scale-[0.93]"
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

// Finds the human-readable label (e.g. "Mat") matching a technical
// value (e.g. "mat") in a list of options.
function findLabel(options: SelectOption[], value: string): string {
  return options.find((option) => option.value === value)?.label ?? value;
}
