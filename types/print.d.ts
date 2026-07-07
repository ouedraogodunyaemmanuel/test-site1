// Types du domaine "tirages" (catalogue, options d'achat, panier).
// Centralisés ici pour être importés depuis n'importe quel fichier avec :
//   import type { Print, Category, ... } from "@/types/print";

// Les catégories existantes dans le catalogue.
export type Category = "montagne" | "mer" | "desert" | "foret";

// Une catégorie du catalogue, ou "all" pour ne pas filtrer.
// Utilisé par les boutons de filtre au-dessus de la galerie.
export type CategoryFilter = Category | "all";

export type Print = {
  id: number;
  title: string;
  category: Category;
  image: string;
};

// Une option affichable dans un menu déroulant (filtre de catégorie,
// format, finition ou cadre). `value` est volontairement une chaîne
// simple : le format/la finition/le cadre ne sont pas encore des unions
// strictes comme `Category`, donc pas besoin de généricité ici.
export type SelectOption = {
  value: string;
  label: string;
};

// Nom des trois groupes d'options personnalisables dans la fenêtre de
// détail d'un tirage (utilisé pour savoir lequel est actuellement ouvert).
export type OptionGroupName = "format" | "finish" | "frame";

// Une ligne du panier correspond à une combinaison précise
// photo + format + finition + cadre (deux choix différents d'une même
// photo sont donc deux lignes distinctes).
export type CartItem = {
  id: string;
  printId: number;
  title: string;
  image: string;
  // Valeurs techniques (ex. "60x90", "noir") en plus des libellés
  // lisibles : elles permettent de recalculer le prix côté serveur au
  // moment du paiement, sans faire confiance au prix envoyé par le
  // navigateur.
  format: string;
  frame: string;
  formatLabel: string;
  finishLabel: string;
  frameLabel: string;
  unitPrice: number;
  quantity: number;
};

// Coordonnées de livraison saisies avant paiement, sur la page
// /commande/livraison.
export type DeliveryInfo = {
  firstName: string;
  lastName: string;
  phone: string;
  street: string;
  postalCode: string;
  city: string;
};
