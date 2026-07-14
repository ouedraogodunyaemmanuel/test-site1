"use client";

import Image from "next/image";
import { useState } from "react";

// Displays a print's photo with the aspect ratio matching its real
// orientation: a landscape photo keeps a wide frame, a portrait photo
// keeps a tall one, instead of forcing every photo into the same
// shape and cropping part of it away.
//
// The catalog (data/prints.ts) only stores a folder path, not the
// image's real dimensions, so we can't know the orientation ahead of
// time. We start with a portrait frame (the site's previous default)
// and switch to the photo's exact real ratio once the browser has
// actually loaded it and told us its real width/height.
export function PrintImage({
  src,
  alt,
  sizes,
  priority,
  containerClassName = "",
  imageClassName = "",
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
  // Caps the box's height (e.g. "max-h-[70vh]"). The box still starts
  // from 100% width, but combined with `aspect-ratio`, the browser
  // re-derives a narrower width whenever the height cap is the
  // binding constraint — used by PrintDetailModal so a tall portrait
  // photo shrinks to fit a short browser window instead of forcing a
  // scrollbar. Left unset, sizing is unchanged (box always full width).
  hauteurMaximaleClassName = "",
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
  hauteurMaximaleClassName?: string;
  unoptimized?: boolean;
  apercuFlouSrc?: string;
}) {
  // Real width / real height, known only once the browser has loaded
  // the image. Used in "contain" mode to make the box match the photo
  // exactly — otherwise a mismatch between the box's guessed ratio and
  // the photo's real ratio would leave extra empty space on only two
  // of the four sides (on top of the padding below), making the white
  // margin look uneven.
  //
  // Locked in on the FIRST load and never updated afterwards: in
  // PrintDetailModal, `src` changes every time the customer picks a
  // different format or frame, which reloads a new (slightly
  // different) image. If we kept recalculating the ratio each time,
  // the box — and the whole modal — would resize on every option
  // change. Freezing it keeps every variant of the same photo the
  // same size.
  const [ratioReel, setRatioReel] = useState<number | null>(null);
  const [estCharge, setEstCharge] = useState(false);

  function gererChargement(evenement: React.SyntheticEvent<HTMLImageElement>) {
    const cible = evenement.currentTarget;
    const ratio = cible.naturalWidth / cible.naturalHeight;
    setRatioReel((ratioActuel) => ratioActuel ?? ratio);
    setEstCharge(true);
    onRatioConnu?.(ratio);
  }

  // Zoomé à 110% et flouté, pour cacher les bords qui deviendraient
  // visibles à cause du flou lui-même. Reste sous la vraie photo tout
  // du long : une fois celle-ci chargée et opaque, il est simplement
  // recouvert — pas besoin de le faire disparaître explicitement.
  const apercuFlou = apercuFlouSrc ? (
    <img
      src={apercuFlouSrc}
      alt=""
      aria-hidden="true"
      className="absolute inset-0 h-full w-full scale-110 object-cover blur-xl"
    />
  ) : null;

  // Le fondu "sec" a été remplacé par un effet plus doux, à trois
  // dimensions à la fois : la photo arrive légèrement zoomée et floue,
  // puis se stabilise nette à sa taille normale — comme une mise au
  // point d'appareil photo, plutôt qu'un simple "pop".
  const transitionChargement = `transition-all duration-500 ease-out ${
    estCharge ? "scale-100 opacity-100 blur-none" : "scale-105 opacity-0 blur-md"
  }`;

  if (dimensionnement === "rempli") {
    return (
      <div
        className={`relative h-full w-full overflow-hidden bg-stone-200 ${
          estCharge ? "" : "animate-pulse"
        } ${containerClassName}`}
      >
        {apercuFlou}
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

  const image = (
    <div
      style={ratioConnu ? { aspectRatio: ratioReel } : undefined}
      className={`relative w-full overflow-hidden ${hauteurMaximaleClassName} ${
        ajustement === "contain" ? "bg-white" : "bg-stone-200"
      } ${estCharge ? "" : "animate-pulse"} ${
        ratioConnu ? "" : estPaysage ? "aspect-[3/2]" : "aspect-[2/3]"
      } ${ajustement === "cover" ? containerClassName : ""}`}
    >
      {apercuFlou}
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
  // Flex + centered: when hauteurMaximaleClassName shrinks the box
  // below full width (to respect the height cap), this re-centers it
  // instead of leaving it stuck to one side. With no height cap, the
  // box still fills 100% width as before, so this has no visible
  // effect on other callers.
  if (ajustement === "contain") {
    return (
      <div className={`flex items-center justify-center bg-white p-4 sm:p-6 ${containerClassName}`}>
        {image}
      </div>
    );
  }

  return image;
}
