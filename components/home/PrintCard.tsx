import type { CSSProperties } from "react";
import { useRef } from "react";
import type { Print } from "@/types/print";
import { formaterPrixCHF, PRIX_MINIMUM } from "@/lib/pricing";
import { obtenirUrlImageTirage, obtenirUrlVignetteTirage } from "@/lib/images";
import { FORMATS } from "@/data/options";
import { PrintImage } from "@/components/shared/PrintImage";

export function PrintCard({
  tirage,
  categoryLabel,
  onOuvrir,
  style,
  sizes = "(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw",
  onRatioConnu,
  animationDelayMs = 0,
  priority = false,
}: {
  tirage: Print;
  categoryLabel: string;
  onOuvrir: () => void;
  // Exact pixel size computed by the justified-layout gallery used on
  // mobile (see JustifiedGallery.tsx) — overrides the fixed crop ratio
  // below so each photo keeps its real proportions there.
  style?: CSSProperties;
  sizes?: string;
  onRatioConnu?: (ratio: number) => void;
  // Staggers the card's entrance animation behind the ones before it
  // (see gallery-card-enter in globals.css and PrintGrid.tsx).
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
      className="group gallery-card-enter block text-left transition-transform active:scale-[0.97]"
      style={{ animationDelay: `${animationDelayMs}ms` }}
    >
      {/* Même format pour tous les tirages, quelle que soit leur
          orientation réelle : la photo est recadrée (object-cover)
          dans une case de ratio fixe, pour que la grille reste
          régulière (voir PrintGrid.tsx). Sans effet quand `style`
          impose déjà une largeur et une hauteur précises (mise en page
          justifiée, voir JustifiedGallery.tsx) : le ratio fixe ne
          s'applique alors plus, les deux dimensions étant déjà
          connues. */}
      <div className="aspect-[3/2] overflow-hidden" style={style}>
        <PrintImage
          src={obtenirUrlVignetteTirage(tirage)}
          alt={tirage.title}
          sizes={sizes}
          dimensionnement="rempli"
          unoptimized
          priority={priority}
          onRatioConnu={onRatioConnu}
          imageClassName="transition-transform duration-700 ease-out group-hover:scale-105"
        />
      </div>

      {/* Titre et prix sous la photo, toujours lisibles. Ils
          n'apparaissaient qu'au survol, donc jamais sur mobile. */}
      <div className="mt-3 flex items-baseline justify-between gap-4">
        <span className="font-serif text-lg text-encre">{tirage.title}</span>
        <span className="text-[11px] tracking-[0.08em] whitespace-nowrap uppercase text-accent">
          dès {formaterPrixCHF(PRIX_MINIMUM)}
        </span>
      </div>
      <span className="text-[10px] tracking-[0.14em] uppercase text-attenue">
        {categoryLabel}
      </span>
    </button>
  );
}
