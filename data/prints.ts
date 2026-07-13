import type { Print } from "@/types/print";
import type { CategoryFilterOption } from "@/types/CategoryFilter";

// Category filters displayed above the gallery.
export const FILTRES: CategoryFilterOption[] = [
  { value: "tous", label: "Tous" },
  { value: "montagne", label: "Montagne" },
  { value: "mer", label: "Mer" },
  { value: "desert", label: "Désert" },
  { value: "foret", label: "Forêt" },
];

// With no backend yet, the catalog is hardcoded here.
// It will probably come from an API or a CMS eventually.
//
// Each `imageFolder` points to a folder expected in
// /public/images/tirages/, which must contain 10 files with
// exactly these names:
//   aucun.jpg
//   noir-20x30.jpg, noir-40x60.jpg, noir-60x90.jpg
//   cuivre-20x30.jpg, cuivre-40x60.jpg, cuivre-60x90.jpg
//   argente-20x30.jpg, argente-40x60.jpg, argente-60x90.jpg
// "aucun.jpg" doesn't vary by format (no frame to adjust to the
// size). lib/images.ts is what picks the right file based on the
// format and frame selected by the customer.
export const TIRAGES: Print[] = [
  {
    id: 1,
    title: "Sommets silencieux",
    category: "montagne",
    imageFolder: "/images/tirages/sommets-silencieux",
  },
  {
    id: 2,
    title: "Miroir alpin",
    category: "montagne",
    imageFolder: "/images/tirages/miroir-alpin",
  },
  {
    id: 3,
    title: "Marée du soir",
    category: "mer",
    imageFolder: "/images/tirages/maree-du-soir",
  },
  {
    id: 4,
    title: "Vallée oubliée",
    category: "montagne",
    imageFolder: "/images/tirages/vallee-oubliee",
  },
  {
    id: 5,
    title: "Dunes de sable",
    category: "desert",
    imageFolder: "/images/tirages/dunes-de-sable",
  },
  {
    id: 6,
    title: "Lumière des bois",
    category: "foret",
    imageFolder: "/images/tirages/lumiere-des-bois",
  },
  {
    id: 7,
    title: "Étendue sauvage",
    category: "foret",
    imageFolder: "/images/tirages/etendue-sauvage",
  },
  {
    id: 8,
    title: "Aube sur les cimes",
    category: "montagne",
    imageFolder: "/images/tirages/aube-sur-les-cimes",
  },
];
