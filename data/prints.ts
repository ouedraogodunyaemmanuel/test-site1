import type { OptionFiltreCategorie, Tirage } from "@/types/print";

// Filtres de catégories affichés au-dessus de la galerie.
export const FILTRES: OptionFiltreCategorie[] = [
  { valeur: "tous", libelle: "Tous" },
  { valeur: "montagne", libelle: "Montagne" },
  { valeur: "mer", libelle: "Mer" },
  { valeur: "desert", libelle: "Désert" },
  { valeur: "foret", libelle: "Forêt" },
];

// Avec pas encore de backend, le catalogue est codé en dur ici.
// Il viendra probablement d'une API ou d'un CMS eventuellement.
//
// Chaque `dossierImage` pointe vers un dossier attendu dans
// /public/images/tirages/, qui doit contenir 10 fichiers avec
// exactement ces noms :
//   aucun.jpg
//   noir-20x30.jpg, noir-40x60.jpg, noir-60x90.jpg
//   cuivre-20x30.jpg, cuivre-40x60.jpg, cuivre-60x90.jpg
//   argente-20x30.jpg, argente-40x60.jpg, argente-60x90.jpg
// "aucun.jpg" ne varie pas selon le format (pas de cadre à ajuster à la
// taille). C'est lib/images.ts qui choisit le bon fichier selon le
// format et le cadre sélectionnés par le client.
export const TIRAGES: Tirage[] = [
  {
    id: 1,
    titre: "Sommets silencieux",
    categorie: "montagne",
    dossierImage: "/images/tirages/sommets-silencieux",
  },
  {
    id: 2,
    titre: "Miroir alpin",
    categorie: "montagne",
    dossierImage: "/images/tirages/miroir-alpin",
  },
  {
    id: 3,
    titre: "Marée du soir",
    categorie: "mer",
    dossierImage: "/images/tirages/maree-du-soir",
  },
  {
    id: 4,
    titre: "Vallée oubliée",
    categorie: "montagne",
    dossierImage: "/images/tirages/vallee-oubliee",
  },
  {
    id: 5,
    titre: "Dunes de sable",
    categorie: "desert",
    dossierImage: "/images/tirages/dunes-de-sable",
  },
  {
    id: 6,
    titre: "Lumière des bois",
    categorie: "foret",
    dossierImage: "/images/tirages/lumiere-des-bois",
  },
  {
    id: 7,
    titre: "Étendue sauvage",
    categorie: "foret",
    dossierImage: "/images/tirages/etendue-sauvage",
  },
  {
    id: 8,
    titre: "Aube sur les cimes",
    categorie: "montagne",
    dossierImage: "/images/tirages/aube-sur-les-cimes",
  },
];
