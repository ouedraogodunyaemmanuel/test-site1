// "Print" domain types (catalog, purchase options).
// Centralized here to be imported from any file with:
//   import type { Print, Category, ... } from "@/types/print";

// The categories that exist in the catalog.
export type Category = "montagne" | "mer" | "desert" | "foret";

export type Print = {
  id: number;
  title: string;
  category: Category;
  // Folder containing the 10 variants of this photo: one "aucun.jpg"
  // image (no frame, doesn't vary by format) and one image per
  // frame × format combination for the 3 colored frames (e.g.
  // "noir-20x30.jpg", "noir-40x60.jpg", "noir-60x90.jpg", same for
  // cuivre and argente). See lib/images.ts to resolve the exact
  // file to display.
  imageFolder: string;
};

// An option displayable in a dropdown menu (category filter,
// format, finish or frame). `value` is deliberately a plain
// string: format/finish/frame aren't strict unions yet like
// `Category`, so there's no need for generics here.
export type SelectOption = {
  value: string;
  label: string;
};

// Name of the three customizable option groups in the print detail
// modal (used to know which one is currently open).
export type OptionGroupName = "format" | "finition" | "cadre";
