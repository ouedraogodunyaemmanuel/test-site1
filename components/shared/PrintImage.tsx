"use client";

import Image from "next/image";
import { useState, type CSSProperties } from "react";

// Displays a print's photo with the aspect ratio matching its real
// orientation: a landscape photo keeps a wide frame, a portrait photo
// keeps a tall one, instead of forcing every photo into the same
// shape and cropping part of it away.
//
// When the caller already knows the ratio ahead of time (see
// `knownRatio` below — PrintDetailModal passes the one precomputed in
// data/imageRatios.generated.ts), the box uses it immediately. If not,
// we start with a portrait frame (the site's previous default) and
// switch to the photo's exact real ratio once the browser has
// actually loaded it and told us its real width/height.
export function PrintImage({
  src,
  alt,
  sizes,
  priority,
  containerClassName = "",
  imageClassName = "",
  // The photo's real width/height ratio, when the caller already knows
  // it ahead of time (see data/imageRatios.generated.ts) — avoids a
  // wrong "guess portrait" flash for a landscape photo while it loads.
  // Still gets confirmed by the actual `onLoad` below, in case a print
  // is missing from that generated table.
  knownRatio,
  // "cover" fills the frame and crops what doesn't fit. "contain"
  // always shows the photo in full, with a bit of white margin
  // around it — needed in the detail modal because our photos already
  // have a picture frame drawn into them, and cropping could cut that
  // frame off.
  ajustement = "cover",
  // "auto" (default): the box sizes itself (aspect-ratio guess, then
  // the photo's real ratio once known). "rempli": the box just fills
  // 100% of whatever size its parent already gave it — used by the
  // justified gallery layout, which computes each photo's exact pixel
  // box itself from its real ratio, so there's nothing left to crop.
  dimensionnement = "auto",
  // Reports the photo's real width/height ratio once loaded, so a
  // parent (like the justified gallery) can lay out photos using
  // their real proportions.
  onRatioConnu,
  // Caps the box's height to this share of the viewport (e.g. 70 for
  // "70vh") — used by PrintDetailModal so a tall portrait photo shrinks
  // to fit a short browser window instead of forcing a scrollbar. A
  // plain CSS `max-height` alone isn't enough here: once it clamps the
  // height, a `width: 100%` box does NOT shrink back down to match
  // (browsers only derive width from a clamped height for boxes whose
  // width was itself "auto", which ours isn't) — the photo would keep
  // its correct proportions via `object-contain`, but the surrounding
  // white box would stay too wide for it, leaving an oversized side
  // margin. We work around this by also computing the matching
  // max-width by hand from the same vh figure (see `calc(...)` below),
  // so the box always shrinks to fit the photo on both axes. Left
  // unset, sizing is unchanged (box always full width).
  hauteurMaximaleVh,
  // Sert le fichier tel quel, sans passer par l'optimiseur d'images de
  // Next.js. À réserver aux photos déjà pré-dimensionnées pour leur
  // contexte d'affichage (voir PrintCard.tsx, PrintDetailModal.tsx) :
  // sans ça, un aperçu minuscule (ex. le panier, 56px) téléchargerait
  // le fichier en pleine résolution pour rien.
  unoptimized = false,
  // Chemin d'une version très légère (vignette) de la même photo,
  // affichée immédiatement en fond flou pendant que la vraie image
  // charge, plutôt que de laisser une boîte vide. N'a de sens que si
  // cette version légère est déjà en cache (voir le préchargement au
  // survol dans PrintCard.tsx) — sinon elle chargerait, elle aussi,
  // pour la première fois.
  apercuFlouSrc,
}: {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  containerClassName?: string;
  imageClassName?: string;
  ajustement?: "cover" | "contain";
  dimensionnement?: "auto" | "rempli";
  onRatioConnu?: (ratio: number) => void;
  hauteurMaximaleVh?: number;
  unoptimized?: boolean;
  apercuFlouSrc?: string;
  knownRatio?: number;
}) {
  // Real width / real height. Seeded from `knownRatio` when the caller
  // already has it, otherwise known only once the browser has loaded
  // the image. Used in "contain" mode to make the box match the photo
  // exactly — otherwise a mismatch between the box's ratio and the
  // photo's real ratio would leave extra empty space on only two of
  // the four sides (on top of the padding below), making the white
  // margin look uneven.
  //
  // Locked in on the FIRST load and never updated afterwards: in
  // PrintDetailModal, `src` changes every time the customer picks a
  // different format or frame, and every variant is meant to share the
  // same proportions as the base photo — so the card should stay the
  // same size while browsing options, not resize on every click.
  const [ratioReel, setRatioReel] = useState<number | null>(knownRatio ?? null);
  const [estCharge, setEstCharge] = useState(false);
  // Dernière photo qui était déjà pleinement affichée avant que `src`
  // ne change (ex. le client choisit un autre cadre ou format dans
  // PrintDetailModal). Reste affichée, nette, pendant que la nouvelle
  // charge — sans ça, le changement d'option faisait clignoter la zone
  // (l'ancienne image disparaît dès que le navigateur commence à
  // charger la nouvelle, avant qu'elle soit prête à s'afficher). Elle
  // s'estompe ensuite EN MÊME TEMPS que la nouvelle apparaît (voir plus
  // bas) : un vrai fondu croisé, plutôt que la nouvelle photo qui
  // "révèle" par-dessus une ancienne restée pleinement visible jusqu'au
  // bout — ce second comportement laissait les deux photos se
  // chevaucher nettement pendant toute la transition.
  const [imagePrecedente, setImagePrecedente] = useState<string | null>(null);
  // Permet de détecter, pendant le rendu, que `src` vient de changer —
  // voir https://react.dev/reference/react/useState#storing-information-from-previous-renders.
  // On ne peut pas attendre un useEffect : il s'exécute après l'affichage,
  // ce qui laisserait passer une image visible pendant un instant avant
  // sa propre transition d'apparition.
  const [srcPrecedent, setSrcPrecedent] = useState(src);
  if (src !== srcPrecedent) {
    setImagePrecedente(estCharge ? srcPrecedent : imagePrecedente);
    setSrcPrecedent(src);
    setEstCharge(false);
  }

  function gererChargement(evenement: React.SyntheticEvent<HTMLImageElement>) {
    const cible = evenement.currentTarget;
    const ratio = cible.naturalWidth / cible.naturalHeight;
    setRatioReel((ratioActuel) => ratioActuel ?? ratio);
    setEstCharge(true);
    onRatioConnu?.(ratio);
  }

  // Rien à afficher du tout derrière la photo en cours de chargement :
  // ni un aperçu flou, ni une photo précédente. Seul ce cas fait
  // "respirer" le fond — sinon la pulsation serait visible par-dessus
  // une image déjà là, ce qui distrairait pour rien.
  const boiteVide = !estCharge && !imagePrecedente && !apercuFlouSrc;

  // Zoomé à 110% et flouté, pour cacher les bords qui deviendraient
  // visibles à cause du flou lui-même. Reste monté tout du long : une
  // fois la vraie photo (ou imagePrecedente) chargée et opaque
  // par-dessus, il est simplement recouvert — pas besoin de le faire
  // disparaître explicitement.
  const apercuFlou = apercuFlouSrc ? (
    <img
      src={apercuFlouSrc}
      alt=""
      aria-hidden="true"
      className="absolute inset-0 h-full w-full scale-110 object-cover blur-xl"
    />
  ) : null;

  const photoPrecedente = imagePrecedente ? (
    <Image
      src={imagePrecedente}
      alt=""
      aria-hidden="true"
      fill
      sizes={sizes}
      unoptimized={unoptimized}
      className={`${ajustement === "contain" ? "object-contain" : "object-cover"} transition-opacity duration-500 ease-out ${
        estCharge ? "opacity-0" : "opacity-100"
      }`}
    />
  ) : null;

  // Two different load-in effects depending on context:
  // - Gallery grid ("rempli"): a plain, quick opacity fade. Grid photos
  //   are small and their load timing doesn't line up with the card's
  //   own entrance animation (see gallery-card-enter in globals.css) —
  //   a heavier zoom/blur effect popping in late, out of sync, reads as
  //   a jerk. A short fade stays unobtrusive even when it lands after
  //   the card has already settled.
  // - Everywhere else (the detail modal's big hero photo): the fuller
  //   "camera focus" effect — arrives slightly zoomed and blurred, then
  //   settles sharp at normal size — reads well at that size since
  //   there's no competing entrance animation to stay in sync with.
  const transitionChargement =
    dimensionnement === "rempli"
      ? `transition-opacity duration-300 ease-out ${estCharge ? "opacity-100" : "opacity-0"}`
      : `transition-all duration-500 ease-out ${
          estCharge ? "scale-100 opacity-100 blur-none" : "scale-105 opacity-0 blur-md"
        }`;

  if (dimensionnement === "rempli") {
    return (
      <div
        className={`relative h-full w-full overflow-hidden bg-stone-200 ${
          boiteVide ? "animate-pulse" : ""
        } ${containerClassName}`}
      >
        {apercuFlou}
        {photoPrecedente}
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          unoptimized={unoptimized}
          onLoad={gererChargement}
          className={`object-cover ${transitionChargement} ${imageClassName}`}
        />
      </div>
    );
  }

  const estPaysage = (ratioReel ?? 2 / 3) >= 1;
  const ratioConnu = ajustement === "contain" && ratioReel !== null;

  const styleBoite: CSSProperties = {
    ...(ratioConnu ? { aspectRatio: ratioReel } : undefined),
    ...(hauteurMaximaleVh ? { maxHeight: `${hauteurMaximaleVh}vh` } : undefined),
    // Voir le commentaire de `hauteurMaximaleVh` ci-dessus : sans ce
    // max-width calculé à la main, la boîte reste trop large une fois
    // sa hauteur plafonnée par max-height.
    ...(ratioConnu && hauteurMaximaleVh
      ? { maxWidth: `calc(${hauteurMaximaleVh}vh * ${ratioReel})` }
      : undefined),
  };

  const image = (
    <div
      style={styleBoite}
      className={`relative w-full overflow-hidden ${
        ajustement === "contain" ? "bg-white transition-all duration-500 ease-out" : "bg-stone-200"
      } ${boiteVide ? "animate-pulse" : ""} ${
        ratioConnu ? "" : estPaysage ? "aspect-[3/2]" : "aspect-[2/3]"
      } ${ajustement === "cover" ? containerClassName : ""}`}
    >
      {apercuFlou}
      {photoPrecedente}
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        unoptimized={unoptimized}
        onLoad={gererChargement}
        className={`${
          ajustement === "contain" ? "object-contain" : "object-cover"
        } ${transitionChargement} ${imageClassName}`}
      />
    </div>
  );

  // Adds the white margin around the photo, outside the box that
  // actually clips/frames the image (padding on that same box would
  // get covered by the `fill` image instead of staying visible).
  //
  // Flex + centered: when hauteurMaximaleVh shrinks the box below full
  // width (to respect the height cap), this re-centers it instead of
  // leaving it stuck to one side. With no height cap, the box still
  // fills 100% width as before, so this has no visible effect on other
  // callers.
  if (ajustement === "contain") {
    return (
      <div className={`flex items-center justify-center bg-white p-4 sm:p-6 ${containerClassName}`}>
        {image}
      </div>
    );
  }

  return image;
}
