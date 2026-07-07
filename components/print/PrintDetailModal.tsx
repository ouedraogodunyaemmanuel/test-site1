"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { OptionGroupName, Print, SelectOption } from "@/types/print";
import { calculerPrix, formaterPrixCHF } from "@/lib/pricing";
import { FORMATS, FINISHES, FRAMES } from "@/data/options";
import { useCart } from "@/components/cart/CartContext";
import { OptionGroup } from "./OptionGroup";

export function PrintDetailModal({
  print,
  onClose,
}: {
  print: Print;
  onClose: () => void;
}) {
  const { addItem, openCart } = useCart();
  const [selectedFormat, setSelectedFormat] = useState(FORMATS[0].value);
  const [selectedFinish, setSelectedFinish] = useState(FINISHES[0].value);
  const [selectedFrame, setSelectedFrame] = useState(FRAMES[0].value);
  const [openGroup, setOpenGroup] = useState<OptionGroupName | null>(null);

  function toggleGroup(name: OptionGroupName) {
    setOpenGroup((current) => (current === name ? null : name));
  }

  // Ajoute le tirage au panier avec les options actuellement sélectionnées,
  // puis ouvre le panier pour confirmer visuellement que l'ajout a marché.
  function handleAddToCart() {
    addItem({
      id: `${print.id}-${selectedFormat}-${selectedFinish}-${selectedFrame}`,
      printId: print.id,
      title: print.title,
      image: print.image,
      format: selectedFormat,
      frame: selectedFrame,
      formatLabel: trouverLabel(FORMATS, selectedFormat),
      finishLabel: trouverLabel(FINISHES, selectedFinish),
      frameLabel: trouverLabel(FRAMES, selectedFrame),
      unitPrice: calculerPrix(selectedFormat, selectedFrame),
    });
    onClose();
    openCart();
  }

  // Close the modal with the Escape key, for correct keyboard navigation.
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Lock background scrolling while the modal is open, and restore the
  // previous value on close (fixes the page scrolling behind the modal).
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 sm:p-10"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="print-detail-title"
        className="relative flex max-h-full w-full max-w-4xl flex-col overflow-y-auto bg-stone-50 sm:flex-row"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="relative aspect-[4/5] w-full shrink-0 sm:w-3/5">
          <Image
            src={print.image}
            alt={print.title}
            fill
            sizes="(min-width: 640px) 60vw, 100vw"
            className="object-cover"
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
                title="Format"
                options={FORMATS}
                currentValue={selectedFormat}
                isOpen={openGroup === "format"}
                onToggle={() => toggleGroup("format")}
                onSelect={setSelectedFormat}
              />
              <OptionGroup
                title="Finition"
                options={FINISHES}
                currentValue={selectedFinish}
                isOpen={openGroup === "finish"}
                onToggle={() => toggleGroup("finish")}
                onSelect={setSelectedFinish}
              />
              <OptionGroup
                title="Cadre"
                options={FRAMES}
                currentValue={selectedFrame}
                isOpen={openGroup === "frame"}
                onToggle={() => toggleGroup("frame")}
                onSelect={setSelectedFrame}
              />
            </div>
          </div>
          <div className="mt-8 flex flex-col gap-3">
            <button
              type="button"
              onClick={handleAddToCart}
              className="bg-stone-900 px-6 py-3 text-sm tracking-wide text-stone-50 transition-colors hover:bg-stone-700"
            >
              Ajouter au panier
            </button>
            <button
              type="button"
              onClick={onClose}
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
function trouverLabel(options: SelectOption[], value: string): string {
  return options.find((option) => option.value === value)?.label ?? value;
}
