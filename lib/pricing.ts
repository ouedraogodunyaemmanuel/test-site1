// Grille de prix (CHF) par format, selon qu'un cadre est choisi ou non.
// Le prix ne dépend pas de la photo : il est le même pour tout le catalogue.
export const PRICING: Record<string, { sansCadre: number; avecCadre: number }> = {
  "20x30": { sansCadre: 39, avecCadre: 69 },
  "40x60": { sansCadre: 59, avecCadre: 99 },
  "60x90": { sansCadre: 109, avecCadre: 209 },
};

// Le prix affiché sur les cartes ("à partir de ..."), soit le tarif le plus bas du catalogue.
export const PRIX_MINIMUM = PRICING["20x30"].sansCadre;

export function calculerPrix(format: string, frame: string): number {
  const prixFormat = PRICING[format];
  return frame === "aucun" ? prixFormat.sansCadre : prixFormat.avecCadre;
}

// Convention suisse : un montant rond s'affiche "109.-", un montant avec
// centimes s'affiche "34.90".
export function formaterPrixCHF(montant: number): string {
  return Number.isInteger(montant)
    ? `CHF ${montant}.-`
    : `CHF ${montant.toFixed(2)}`;
}
