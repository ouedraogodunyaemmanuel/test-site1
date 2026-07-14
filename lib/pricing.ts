// Price grid (CHF) by format, depending on whether a frame is chosen.
// The price doesn't depend on the photo: it's the same across the whole catalog.
export const GRILLE_PRIX: Record<string, { sansCadre: number; avecCadre: number }> = {
  "20x30": { sansCadre: 49, avecCadre: 79 },
  "40x60": { sansCadre: 69, avecCadre: 159 },
  "60x90": { sansCadre: 119, avecCadre: 299 },
};

// The price shown on the cards ("from ..."), i.e. the lowest rate in the catalog.
export const PRIX_MINIMUM = GRILLE_PRIX["20x30"].sansCadre;

export function calculerPrix(format: string, cadre: string): number {
  const prixFormat = GRILLE_PRIX[format];
  return cadre === "aucun" ? prixFormat.sansCadre : prixFormat.avecCadre;
}

// Swiss convention: a round amount is shown as "109.-", an amount with
// cents is shown as "34.90".
export function formaterPrixCHF(montant: number): string {
  return Number.isInteger(montant)
    ? `CHF ${montant}.-`
    : `CHF ${montant.toFixed(2)}`;
}
