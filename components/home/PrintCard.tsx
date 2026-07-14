import type { CSSProperties } from "react";
import type { Print } from "@/types/print";
import { formaterPrixCHF, PRIX_MINIMUM } from "@/lib/pricing";
import { obtenirUrlImageTirage } from "@/lib/images";
import { FORMATS } from "@/data/options";
import { PrintImage } from "@/components/shared/PrintImage";

export function PrintCard({
  tirage,
  onOuvrir,
  style,
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  onRatioConnu,
  animationDelayMs = 0,
}: {
  tirage: Print;
  onOuvrir: () => void;
  // Exact pixel size computed by the justified gallery layout, so the
  // photo displays at its real aspect ratio instead of a fixed shape.
  style?: CSSProperties;
  sizes?: string;
  onRatioConnu?: (ratio: number) => void;
  // Staggers the card's entrance animation behind the ones before it
  // (see gallery-card-enter in globals.css and JustifiedGallery.tsx).
  animationDelayMs?: number;
}) {
  return (
    <button
      type="button"
      onClick={onOuvrir}
      style={{ ...style, animationDelay: `${animationDelayMs}ms` }}
      className="group relative block overflow-hidden text-left transition-transform active:scale-[0.94] gallery-card-enter"
    >
      <PrintImage
        // No options chosen yet at this stage (just hovering the
        // gallery): we show the "no frame" variant by default — the
        // format doesn't matter here since "aucun" ignores it.
        src={obtenirUrlImageTirage(tirage, "aucun", FORMATS[0].value)}
        alt={tirage.title}
        sizes={sizes}
        dimensionnement="rempli"
        onRatioConnu={onRatioConnu}
        imageClassName="transition-transform duration-700 ease-out group-hover:scale-105"
      />
      {/* Overlay revealed on hover: print title and starting price */}
      <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/0 to-black/0 p-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <span className="font-serif text-lg text-stone-50">{tirage.title}</span>
        <span className="mt-1 text-sm text-stone-300">
          à partir de {formaterPrixCHF(PRIX_MINIMUM)}
        </span>
      </div>
    </button>
  );
}
