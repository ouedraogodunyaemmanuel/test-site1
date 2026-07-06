"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

// --- Données --------------------------------------------------------------
// En l'absence de backend, la collection de tirages est codée en dur ici.
// À terme, ces données viendront probablement d'une API ou d'un CMS.

type Categorie = "montagne" | "mer" | "desert" | "foret";

type Tirage = {
  id: number;
  titre: string;
  categorie: Categorie;
  format: string;
  prix: number;
  image: string;
};

const FILTRES: { valeur: Categorie | "tous"; libelle: string }[] = [
  { valeur: "tous", libelle: "Tous" },
  { valeur: "montagne", libelle: "Montagne" },
  { valeur: "mer", libelle: "Mer" },
  { valeur: "desert", libelle: "Désert" },
  { valeur: "foret", libelle: "Forêt" },
];

const TIRAGES: Tirage[] = [
  {
    id: 1,
    titre: "Sommets silencieux",
    categorie: "montagne",
    format: "60 × 90 cm",
    prix: 320,
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 2,
    titre: "Miroir alpin",
    categorie: "montagne",
    format: "50 × 70 cm",
    prix: 280,
    image:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 3,
    titre: "Marée du soir",
    categorie: "mer",
    format: "50 × 70 cm",
    prix: 260,
    image:
      "https://images.unsplash.com/photo-1505142468610-359e7d316be0?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 4,
    titre: "Vallée oubliée",
    categorie: "montagne",
    format: "60 × 90 cm",
    prix: 340,
    image:
      "https://images.unsplash.com/photo-1439066615861-d1af74d74000?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 5,
    titre: "Dunes de sable",
    categorie: "desert",
    format: "60 × 90 cm",
    prix: 300,
    image:
      "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 6,
    titre: "Lumière des bois",
    categorie: "foret",
    format: "50 × 70 cm",
    prix: 250,
    image:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 7,
    titre: "Étendue sauvage",
    categorie: "foret",
    format: "60 × 90 cm",
    prix: 290,
    image:
      "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 8,
    titre: "Aube sur les cimes",
    categorie: "montagne",
    format: "60 × 90 cm",
    prix: 310,
    image:
      "https://images.unsplash.com/photo-1500534623283-312aade485b7?q=80&w=1200&auto=format&fit=crop",
  },
];

// --- Page ------------------------------------------------------------------

export default function Home() {
  const [categorieActive, setCategorieActive] = useState<Categorie | "tous">(
    "tous"
  );
  const [tirageOuvert, setTirageOuvert] = useState<Tirage | null>(null);

  const tiragesAffiches =
    categorieActive === "tous"
      ? TIRAGES
      : TIRAGES.filter((tirage) => tirage.categorie === categorieActive);

  return (
    <div className="flex flex-1 flex-col bg-stone-50 font-sans text-stone-900">
      <EnTete />
      <SectionHero />
      <SectionGalerie
        filtres={FILTRES}
        categorieActive={categorieActive}
        onChangerCategorie={setCategorieActive}
        tirages={tiragesAffiches}
        onOuvrirTirage={setTirageOuvert}
      />
      <SectionAPropos />
      <PiedDePage />
      {tirageOuvert && (
        <FenetreDetailTirage
          tirage={tirageOuvert}
          onFermer={() => setTirageOuvert(null)}
        />
      )}
    </div>
  );
}

// --- En-tête -----------------------------------------------------------

function EnTete() {
  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/70 bg-stone-50/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 sm:px-10">
        <span className="font-serif text-xl tracking-[0.2em] text-stone-900">
          HORIZON
        </span>
        <nav className="hidden gap-8 text-sm text-stone-600 sm:flex">
          <a href="#galerie" className="transition-colors hover:text-stone-900">
            Collection
          </a>
          <a href="#a-propos" className="transition-colors hover:text-stone-900">
            À propos
          </a>
          <a href="#pied-de-page" className="transition-colors hover:text-stone-900">
            Contact
          </a>
        </nav>
      </div>
    </header>
  );
}

// --- Hero ----------------------------------------------------------------

function SectionHero() {
  return (
    <section className="relative flex h-[85vh] min-h-[520px] items-end overflow-hidden">
      <Image
        src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=2400&auto=format&fit=crop"
        alt="Chaîne de montagnes se reflétant dans un lac au lever du jour"
        fill
        priority
        className="object-cover"
      />
      {/* Voile sombre pour garder le texte lisible quelle que soit la photo */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />
      <div className="relative mx-auto w-full max-w-6xl px-6 pb-16 sm:px-10 sm:pb-24">
        <h1 className="max-w-xl font-serif text-4xl leading-tight text-stone-50 sm:text-5xl">
          Des paysages intemporels, tirés avec exigence.
        </h1>
        <p className="mt-4 max-w-md text-stone-200">
          Éditions limitées, impression fine art sur papier coton.
        </p>
        <a
          href="#galerie"
          className="mt-8 inline-flex items-center gap-2 border border-stone-50 px-6 py-3 text-sm tracking-wide text-stone-50 transition-colors hover:bg-stone-50 hover:text-stone-900"
        >
          Découvrir la collection
        </a>
      </div>
    </section>
  );
}

// --- Galerie ---------------------------------------------------------------

function SectionGalerie({
  filtres,
  categorieActive,
  onChangerCategorie,
  tirages,
  onOuvrirTirage,
}: {
  filtres: { valeur: Categorie | "tous"; libelle: string }[];
  categorieActive: Categorie | "tous";
  onChangerCategorie: (categorie: Categorie | "tous") => void;
  tirages: Tirage[];
  onOuvrirTirage: (tirage: Tirage) => void;
}) {
  return (
    <section id="galerie" className="mx-auto w-full max-w-6xl px-6 py-24 sm:px-10">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="font-serif text-3xl text-stone-900">La collection</h2>
        <div className="flex flex-wrap gap-2">
          {filtres.map((filtre) => (
            <button
              key={filtre.valeur}
              type="button"
              onClick={() => onChangerCategorie(filtre.valeur)}
              className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                categorieActive === filtre.valeur
                  ? "border-stone-900 bg-stone-900 text-stone-50"
                  : "border-stone-300 text-stone-600 hover:border-stone-900 hover:text-stone-900"
              }`}
            >
              {filtre.libelle}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {tirages.map((tirage) => (
          <CarteTirage
            key={tirage.id}
            tirage={tirage}
            onOuvrir={() => onOuvrirTirage(tirage)}
          />
        ))}
      </div>
    </section>
  );
}

function CarteTirage({
  tirage,
  onOuvrir,
}: {
  tirage: Tirage;
  onOuvrir: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOuvrir}
      className="group relative aspect-[4/5] overflow-hidden bg-stone-200 text-left"
    >
      <Image
        src={tirage.image}
        alt={tirage.titre}
        fill
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />
      {/* Overlay révélé au survol : titre, format et prix du tirage */}
      <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/0 to-black/0 p-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <span className="font-serif text-lg text-stone-50">{tirage.titre}</span>
        <span className="mt-1 text-sm text-stone-300">
          {tirage.format} — {tirage.prix} €
        </span>
      </div>
    </button>
  );
}

// --- À propos ----------------------------------------------------------

function SectionAPropos() {
  return (
    <section id="a-propos" className="border-t border-stone-200 bg-stone-100">
      <div className="mx-auto max-w-3xl px-6 py-24 text-center sm:px-10">
        <h2 className="font-serif text-3xl text-stone-900">Une exigence de qualité</h2>
        <p className="mt-6 text-stone-600 leading-relaxed">
          Chaque tirage est réalisé en édition limitée sur papier fine art
          100% coton, avec des encres pigmentaires garanties plus de 80 ans
          sans altération. Une manière de faire entrer un paysage chez soi,
          durablement.
        </p>
      </div>
    </section>
  );
}

// --- Pied de page ------------------------------------------------------

function PiedDePage() {
  return (
    <footer id="pied-de-page" className="border-t border-stone-200">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 py-10 text-sm text-stone-500 sm:flex-row sm:justify-between sm:px-10">
        <span className="font-serif tracking-[0.2em] text-stone-700">HORIZON</span>
        <span>© {new Date().getFullYear()} Horizon. Tous droits réservés.</span>
      </div>
    </footer>
  );
}

// --- Fenêtre de détail (lightbox) ---------------------------------------

function FenetreDetailTirage({
  tirage,
  onFermer,
}: {
  tirage: Tirage;
  onFermer: () => void;
}) {
  // Ferme la fenêtre avec la touche Échap, pour une navigation au clavier correcte.
  useEffect(() => {
    function gererTouche(evenement: KeyboardEvent) {
      if (evenement.key === "Escape") {
        onFermer();
      }
    }
    window.addEventListener("keydown", gererTouche);
    return () => window.removeEventListener("keydown", gererTouche);
  }, [onFermer]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 sm:p-10"
      onClick={onFermer}
    >
      <div
        className="relative flex w-full max-w-4xl flex-col overflow-hidden bg-stone-50 sm:flex-row"
        onClick={(evenement) => evenement.stopPropagation()}
      >
        <div className="relative aspect-[4/5] w-full sm:w-3/5">
          <Image
            src={tirage.image}
            alt={tirage.titre}
            fill
            sizes="(min-width: 640px) 60vw, 100vw"
            className="object-cover"
          />
        </div>
        <div className="flex w-full flex-col justify-between p-8 sm:w-2/5">
          <div>
            <h3 className="font-serif text-2xl text-stone-900">{tirage.titre}</h3>
            <p className="mt-2 text-stone-500">{tirage.format}</p>
            <p className="mt-6 text-2xl text-stone-900">{tirage.prix} €</p>
          </div>
          <div className="mt-8 flex flex-col gap-3">
            <button
              type="button"
              className="bg-stone-900 px-6 py-3 text-sm tracking-wide text-stone-50 transition-colors hover:bg-stone-700"
            >
              Ajouter au panier
            </button>
            <button
              type="button"
              onClick={onFermer}
              className="border border-stone-300 px-6 py-3 text-sm tracking-wide text-stone-600 transition-colors hover:border-stone-900 hover:text-stone-900"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
