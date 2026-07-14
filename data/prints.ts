import type { Print } from "@/types/print";
import type { CategoryFilterOption } from "@/types/CategoryFilter";

// Category filters displayed above the gallery.
export const FILTRES: CategoryFilterOption[] = [
  { value: "tous", label: "Tous" },
  { value: "diurne", label: "Diurne" },
  { value: "enneige", label: "Enneigé" },
  { value: "aurore", label: "Aurore" },
  { value: "crepuscule", label: "Crépuscule" },
  { value: "faune", label: "Faune" },
  { value: "nocturne", label: "Nocturne" },
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
//   blanc-20x30.jpg, blanc-40x60.jpg, blanc-60x90.jpg
// "aucun.jpg" doesn't vary by format (no frame to adjust to the
// size). lib/images.ts is what picks the right file based on the
// format and frame selected by the customer.
export const TIRAGES: Print[] = [
  {
    id: 1,
    title: "Ambre",
    category: "crepuscule",
    imageFolder: "/images/tirages/ambre",
  },
  {
    id: 2,
    title: "Ivoire",
    category: "enneige",
    imageFolder: "/images/tirages/Ivoire",
  },
  {
    id: 3,
    title: "Migration",
    category: "aurore",
    imageFolder: "/images/tirages/migration",
  },
  {
    id: 4,
    title: "Roads not taken",
    category: "diurne",
    imageFolder: "/images/tirages/roads-not-taken",
  },
  {
    id: 5,
    title: "Sentinelles",
    category: "faune",
    imageFolder: "/images/tirages/sentinelles",
  },
  {
    id: 6,
    title: "Vertige",
    category: "enneige",
    imageFolder: "/images/tirages/vertige",
  },
  {
    id: 9,
    title: "Traits d'azur",
    category: "diurne",
    imageFolder: "/images/tirages/traits-d-azur",
  },
];
