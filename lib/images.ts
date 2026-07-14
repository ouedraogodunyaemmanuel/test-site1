import type { Print } from "@/types/print";

// Builds the exact image path to display for a given print, based on
// the chosen frame and format (see the file naming convention
// documented in data/prints.ts).
//
// Special case: "aucun" (no frame) doesn't vary by format — one
// image is enough, unlike colored frames whose visual rendering
// changes with the print size.
export function obtenirUrlImageTirage(
  tirage: Print,
  cadre: string,
  format: string
): string {
  if (cadre === "aucun") {
    return `${tirage.imageFolder}/aucun.jpg`;
  }
  return `${tirage.imageFolder}/${cadre}-${format}.jpg`;
}

// Version légère de la photo "aucun" (voir scripts/generer-vignettes.mjs),
// utilisée uniquement dans la grille de la galerie : à cette taille
// d'affichage, la pleine résolution de obtenirUrlImageTirage serait
// téléchargée pour rien.
export function obtenirUrlVignetteTirage(tirage: Print): string {
  return `${tirage.imageFolder}/aucun-vignette.jpg`;
}
