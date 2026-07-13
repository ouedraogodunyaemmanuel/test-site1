import type { OptionSelection } from "@/types/print";

// Options personnalisables proposées lors de l'achat d'un tirage.
export const FORMATS: OptionSelection[] = [
  { valeur: "20x30", libelle: "20 × 30 cm" },
  { valeur: "40x60", libelle: "40 × 60 cm" },
  { valeur: "60x90", libelle: "60 × 90 cm" },
];

export const FINITIONS: OptionSelection[] = [
  { valeur: "mat", libelle: "Mat" },
  { valeur: "brillant", libelle: "Brillant" },
];

export const CADRES: OptionSelection[] = [
  { valeur: "aucun", libelle: "Pas de cadre" },
  { valeur: "noir", libelle: "Alu noir" },
  { valeur: "cuivre", libelle: "Alu cuivre" },
  { valeur: "argente", libelle: "Alu argenté" },
];
