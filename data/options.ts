import type { SelectOption } from "@/types/print";

// Customizable options offered when purchasing a print.
export const FORMATS: SelectOption[] = [
  { value: "20x30", label: "20 × 30 cm" },
  { value: "40x60", label: "40 × 60 cm" },
  { value: "60x90", label: "60 × 90 cm" },
];

export const FINITIONS: SelectOption[] = [
  { value: "mat", label: "Mat" },
  { value: "brillant", label: "Brillant" },
];

export const CADRES: SelectOption[] = [
  { value: "aucun", label: "Pas de cadre" },
  { value: "noir", label: "Alu noir" },
  { value: "cuivre", label: "Alu cuivre" },
  { value: "argente", label: "Alu argenté" },
];
