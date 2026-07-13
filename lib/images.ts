import type { Tirage } from "@/types/print";

// Construit le chemin de l'image exacte à afficher pour un tirage donné,
// selon le cadre et le format choisis (voir la convention de nommage des
// fichiers documentée dans data/prints.ts).
//
// Cas particulier : "aucun" (pas de cadre) ne varie pas selon le format
// — une seule image suffit, contrairement aux cadres colorés dont le
// rendu visuel change avec la taille du tirage.
export function obtenirUrlImageTirage(
  tirage: Tirage,
  cadre: string,
  format: string
): string {
  if (cadre === "aucun") {
    return `${tirage.dossierImage}/aucun.jpg`;
  }
  return `${tirage.dossierImage}/${cadre}-${format}.jpg`;
}
