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
// Chaque `image` pointe vers un fichier attendu dans /public/images/tirages/.
// Dépose tes photos là-bas avec exactement ces noms pour qu'elles s'affichent.
export const PRINTS: Print[] = [
  {
    id: 1,
    title: "Sommets silencieux",
    category: "montagne",
    image: "/images/tirages/sommets-silencieux.jpg",
  },
  {
    id: 2,
    title: "Miroir alpin",
    category: "montagne",
    image: "/images/tirages/miroir-alpin.jpg",
  },
  {
    id: 3,
    title: "Marée du soir",
    category: "mer",
    image: "/images/tirages/maree-du-soir.jpg",
  },
  {
    id: 4,
    title: "Vallée oubliée",
    category: "montagne",
    image: "/images/tirages/vallee-oubliee.jpg",
  },
  {
    id: 5,
    title: "Dunes de sable",
    category: "desert",
    image: "/images/tirages/dunes-de-sable.jpg",
  },
  {
    id: 6,
    title: "Lumière des bois",
    category: "foret",
    image: "/images/tirages/lumiere-des-bois.jpg",
  },
  {
    id: 7,
    title: "Étendue sauvage",
    category: "foret",
    image: "/images/tirages/etendue-sauvage.jpg",
  },
  {
    id: 8,
    title: "Aube sur les cimes",
    category: "montagne",
    image: "/images/tirages/aube-sur-les-cimes.jpg",
  },
];
