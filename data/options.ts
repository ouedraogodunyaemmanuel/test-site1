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
  { value: "aucun", label: "Aucun" },
  { value: "blanc", label: "Blanc" },
  { value: "noir", label: "Noir" },
  { value: "cuivre", label: "Cuivre" },
];
