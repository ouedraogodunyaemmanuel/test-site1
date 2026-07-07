import type { CategoryFilter, Print } from "@/types/print";

// Filtres de catégories affichés au-dessus de la galerie.
export const FILTERS: { value: CategoryFilter; label: string }[] = [
  { value: "all", label: "Tous" },
  { value: "montagne", label: "Montagne" },
  { value: "mer", label: "Mer" },
  { value: "desert", label: "Désert" },
  { value: "foret", label: "Forêt" },
];

// Avec pas encore de backend, le catalogue est codé en dur ici.
// Il viendra probablement d'une API ou d'un CMS eventuellement.
//
// Chaque `imageFolder` pointe vers un dossier attendu dans
// /public/images/tirages/, qui doit contenir 10 fichiers avec
// exactement ces noms :
//   aucun.jpg
//   noir-20x30.jpg, noir-40x60.jpg, noir-60x90.jpg
//   cuivre-20x30.jpg, cuivre-40x60.jpg, cuivre-60x90.jpg
//   argente-20x30.jpg, argente-40x60.jpg, argente-60x90.jpg
// "aucun.jpg" ne varie pas selon le format (pas de cadre à ajuster à la
// taille). C'est lib/images.ts qui choisit le bon fichier selon le
// format et le cadre sélectionnés par le client.
export const PRINTS: Print[] = [
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
