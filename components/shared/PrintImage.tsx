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
  // "cover" fills the frame and crops what doesn't fit — good for a
  // uniform gallery grid. "contain" always shows the photo in full,
  // with a bit of white margin around it — needed here because our
  // photos already have a picture frame drawn into them, and cropping
  // could cut that frame off.
  ajustement = "cover",
}: {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  containerClassName?: string;
  imageClassName?: string;
  ajustement?: "cover" | "contain";
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

  const estPaysage = (ratioReel ?? 2 / 3) >= 1;
  const ratioConnu = ajustement === "contain" && ratioReel !== null;

  const image = (
    <div
      style={ratioConnu ? { aspectRatio: ratioReel } : undefined}
      className={`relative w-full overflow-hidden ${
        ajustement === "contain" ? "bg-white" : "bg-stone-200"
      } ${ratioConnu ? "" : estPaysage ? "aspect-[3/2]" : "aspect-[2/3]"} ${
        ajustement === "cover" ? containerClassName : ""
      }`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        onLoad={(evenement) => {
          const cible = evenement.currentTarget;
          setRatioReel((ratioActuel) => ratioActuel ?? cible.naturalWidth / cible.naturalHeight);
          setEstCharge(true);
        }}
        className={`transition-opacity duration-300 ${
          ajustement === "contain" ? "object-contain" : "object-cover"
        } ${estCharge ? "opacity-100" : "opacity-0"} ${imageClassName}`}
      />
    </div>
  );

  // Adds the white margin around the photo, outside the box that
  // actually clips/frames the image (padding on that same box would
  // get covered by the `fill` image instead of staying visible).
  if (ajustement === "contain") {
    return <div className={`bg-white p-4 sm:p-6 ${containerClassName}`}>{image}</div>;
  }

  return image;
}
