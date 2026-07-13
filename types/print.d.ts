// Types du domaine "tirages" (catalogue, options d'achat, panier).
// Centralisés ici pour être importés depuis n'importe quel fichier avec :
//   import type { Tirage, Categorie, ... } from "@/types/print";

// Les catégories existantes dans le catalogue.
export type Categorie = "montagne" | "mer" | "desert" | "foret";

// Une catégorie du catalogue, ou "tous" pour ne pas filtrer.
// Utilisé par les boutons de filtre au-dessus de la galerie.
export type FiltreCategorie = Categorie | "tous";

// Un bouton de filtre de catégorie affiché au-dessus de la galerie.
export type OptionFiltreCategorie = {
  valeur: FiltreCategorie;
  libelle: string;
};

export type Tirage = {
  id: number;
  titre: string;
  categorie: Categorie;
  // Dossier contenant les 10 variantes de cette photo : une image
  // "aucun.jpg" (sans cadre, ne varie pas selon le format) et une image
  // par combinaison cadre × format pour les 3 cadres colorés (ex.
  // "noir-20x30.jpg", "noir-40x60.jpg", "noir-60x90.jpg", idem pour
  // cuivre et argente). Voir lib/images.ts pour résoudre le fichier
  // exact à afficher.
  dossierImage: string;
};

// Une option affichable dans un menu déroulant (filtre de catégorie,
// format, finition ou cadre). `valeur` est volontairement une chaîne
// simple : le format/la finition/le cadre ne sont pas encore des unions
// strictes comme `Categorie`, donc pas besoin de généricité ici.
export type OptionSelection = {
  valeur: string;
  libelle: string;
};

// Nom des trois groupes d'options personnalisables dans la fenêtre de
// détail d'un tirage (utilisé pour savoir lequel est actuellement ouvert).
export type NomGroupeOption = "format" | "finition" | "cadre";

// Une ligne du panier correspond à une combinaison précise
// photo + format + finition + cadre (deux choix différents d'une même
// photo sont donc deux lignes distinctes).
export type ArticlePanier = {
  id: string;
  idTirage: number;
  titre: string;
  image: string;
  // Valeurs techniques (ex. "60x90", "noir") en plus des libellés
  // lisibles : elles permettent de recalculer le prix côté serveur au
  // moment du paiement, sans faire confiance au prix envoyé par le
  // navigateur.
  format: string;
  cadre: string;
  libelleFormat: string;
  libelleFinition: string;
  libelleCadre: string;
  prixUnitaire: number;
  quantite: number;
};

// Coordonnées de livraison saisies avant paiement, sur la page
// /commande/livraison.
export type InfosLivraison = {
  prenom: string;
  nom: string;
  telephone: string;
  rue: string;
  codePostal: string;
  ville: string;
};

// Ce que CartProvider expose via useCart() (components/cart/CartContext.tsx).
export type ValeurContextePanier = {
  articles: ArticlePanier[];
  ajouterArticle: (article: Omit<ArticlePanier, "quantite">) => void;
  retirerArticle: (id: string) => void;
  mettreAJourQuantite: (id: string, quantite: number) => void;
  viderPanier: () => void;
  // true une fois le panier chargé depuis le navigateur : évite qu'une
  // page vérifie "le panier est vide" avant la fin du chargement et
  // redirige à tort (ex. après un rafraîchissement de page).
  estPret: boolean;
  nombreArticles: number;
  prixTotal: number;
  estOuvert: boolean;
  ouvrirPanier: () => void;
  fermerPanier: () => void;
  basculerPanier: () => void;
};

// Ce que DeliveryProvider expose via useDelivery()
// (components/checkout/DeliveryContext.tsx).
export type ValeurContexteLivraison = {
  livraison: InfosLivraison;
  definirLivraison: (infos: InfosLivraison) => void;
  viderLivraison: () => void;
  estPret: boolean;
};
