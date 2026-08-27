import type { CSSProperties } from "react";
import { useRef } from "react";
import type { Print } from "@/types/print";
import { formaterPrixCHF, PRIX_MINIMUM } from "@/lib/pricing";
import { obtenirUrlImageTirage, obtenirUrlVignetteTirage } from "@/lib/images";
import { FORMATS } from "@/data/options";
import { PrintImage } from "@/components/shared/PrintImage";

export function PrintCard({
  tirage,
  onOuvrir,
  style,
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  onRatioConnu,
  animationDelayMs = 0,
  priority = false,
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
  // Skips the browser's native lazy-loading delay for above-the-fold
  // cards, so the photo starts downloading immediately instead of
  // waiting for a lazy-load scheduling pass — otherwise that small
  // delay can push the photo's own load-in past the card's entrance
  // animation, making it "pop" in visibly late.
  priority?: boolean;
}) {
  // Réchauffe le cache du navigateur avec la photo pleine taille avant
  // même le clic : ouvrir la modale de détail affiche cette même photo
  // en beaucoup plus grand (voir PrintDetailModal.tsx), donc sans ce
  // préchargement, le clic déclenche un tout premier téléchargement de
  // ce fichier — perceptible comme un temps de chargement. Ne se
  // déclenche qu'une fois par carte (deuxième survol : plus rien à
  // faire, déjà en cache).
  const dejaPrechargee = useRef(false);

  function prechargerImageDetail() {
    if (dejaPrechargee.current) return;
    dejaPrechargee.current = true;
    new window.Image().src = obtenirUrlImageTirage(tirage, "aucun", FORMATS[0].value);
  }

  return (
    <button
      type="button"
      onClick={onOuvrir}
      onMouseEnter={prechargerImageDetail}
      onFocus={prechargerImageDetail}
      style={{ ...style, animationDelay: `${animationDelayMs}ms` }}
      className="group relative block overflow-hidden text-left transition-transform active:scale-[0.94] gallery-card-enter"
    >
      <PrintImage
        // No options chosen yet at this stage (just hovering the
        // gallery): we show the "no frame" variant by default — the
        // format doesn't matter here since "aucun" ignores it. Uses the
        // small pre-generated vignette (see lib/images.ts) rather than
        // the full-resolution photo, since the grid never displays it
        // that large.
        src={obtenirUrlVignetteTirage(tirage)}
        alt={tirage.title}
        sizes={sizes}
        dimensionnement="rempli"
        unoptimized
        priority={priority}
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
