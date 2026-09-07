"use client";

import { useEffect, useRef } from "react";
import { PrintImage } from "@/components/shared/PrintImage";

// Hauteur du hero une fois réduit. La hauteur de départ, elle, n'est
// pas une constante : c'est la hauteur réelle de la fenêtre, relue à
// chaque redimensionnement (voir `mesurer` plus bas). Un chiffre fixe
// comme 844 px donnait un hero trop court sur un grand écran et trop
// long sur un petit.
const HAUTEUR_MIN = 300;
// Fraction de la course de réduction : le hero atteint sa hauteur
// minimale après avoir défilé 75 % de sa hauteur de départ.
const COURSE = 0.75;

export function HeroSection() {
  const refPhoto = useRef<HTMLDivElement>(null);
  const refCale = useRef<HTMLDivElement>(null);
  const refTexte = useRef<HTMLDivElement>(null);
  const refIndicateur = useRef<HTMLDivElement>(null);
  const refVoile = useRef<HTMLDivElement>(null);
  const hauteurDepart = useRef(0);

  // La hauteur est écrite directement sur les nœuds pendant
  // l'événement de défilement, sans passer par un état React : un
  // re-render par frame décalerait la photo d'une frame sur le
  // contenu qui la suit, ce qui se voit comme un décrochage.
  useEffect(() => {
    function mesurer() {
      // Hauteur de l'en-tête collant, mesurée plutôt que devinée :
      // elle change entre mobile et desktop (taille du logo, présence
      // de la bascule de thème).
      const entete = document.querySelector("header");
      const hauteurEntete = entete?.getBoundingClientRect().height ?? 0;
      hauteurDepart.current = window.innerHeight;
      if (refCale.current) {
        refCale.current.style.marginTop = `-${hauteurEntete}px`;
      }
      // Le voile de lisibilité garde une hauteur fixe ancrée en bas,
      // pour que son intensité ne change pas quand le hero se réduit.
      if (refVoile.current) {
        refVoile.current.style.height = `${hauteurDepart.current}px`;
      }
      appliquer();
    }

    function appliquer() {
      const depart = hauteurDepart.current;
      if (!depart) return;
      const parcours = window.scrollY;
      const hauteur = Math.max(HAUTEUR_MIN, depart - parcours * COURSE);
      if (refPhoto.current) refPhoto.current.style.height = `${hauteur}px`;
      if (refCale.current) refCale.current.style.height = `${hauteur}px`;
      // Les seuils d'estompage suivent la hauteur de la fenêtre, pour
      // que le rythme soit le même sur un petit et un grand écran.
      if (refTexte.current) {
        refTexte.current.style.opacity = `${Math.max(0, 1 - parcours / (depart * 0.5))}`;
      }
      if (refIndicateur.current) {
        refIndicateur.current.style.opacity = `${Math.max(0, 1 - parcours / (depart * 0.2))}`;
      }
    }

    mesurer();
    window.addEventListener("scroll", appliquer, { passive: true });
    window.addEventListener("resize", mesurer);
    // Les polices web décalent la hauteur de l'en-tête une fois
    // chargées : on remesure alors.
    document.fonts?.ready.then(mesurer);
    return () => {
      window.removeEventListener("scroll", appliquer);
      window.removeEventListener("resize", mesurer);
    };
  }, []);

  return (
    // La cale réserve la place du hero dans le flux et suit sa hauteur,
    // pour que la collection reste collée au bas de la photo pendant
    // toute la réduction. Sa marge négative (posée par `mesurer`) fait
    // passer la photo sous l'en-tête collant, pour qu'elle soit plein
    // cadre au premier écran.
    // Les valeurs `h-screen` / `-mt-[71px]` ne servent qu'au premier
    // rendu, avant que l'effet ne prenne la main : sans elles, le hero
    // apparaîtrait à zéro pixel de haut.
    <div
      ref={refCale}
      // `overflow-anchor: none` : sans ça, le navigateur essaie de
      // compenser chaque changement de hauteur écrit ici par
      // `appliquer()` en réajustant lui-même le scroll (ancrage de
      // défilement) — les deux mécanismes se battent et produisent un
      // saut de défilement visible, en particulier quand le contenu
      // sous le hero change de hauteur (ex. un filtre de catégorie qui
      // ne renvoie aucun tirage).
      style={{ overflowAnchor: "none" }}
      className="-mt-[71px] h-screen"
    >
      <div
        ref={refPhoto}
        // La photo garde son fond sombre dans les deux thèmes : du
        // texte blanc posé sur une image ne peut pas s'éclaircir.
        data-theme="sombre"
        style={{ overflowAnchor: "none" }}
        className="sticky top-0 h-screen overflow-hidden text-encre"
      >
        {/* Deux rendus, comme dans PrintDetailModal : next/image n'a pas
            d'équivalent au <picture>/<source media> qui servait ici un
            fichier différent (pas juste une résolution différente) selon
            la largeur d'écran — indispensable pour ne pas faire
            télécharger la photo desktop (~5 Mo) à un téléphone. */}
        <div className="h-full w-full sm:hidden">
          <PrintImage
            src="/images/HeroSection/hero-section-mobile.jpg"
            alt=""
            sizes="100vw"
            dimensionnement="rempli"
            priority
          />
        </div>
        <div className="hidden h-full w-full sm:block">
          <PrintImage
            src="/images/HeroSection/hero-section.jpg"
            alt=""
            sizes="100vw"
            dimensionnement="rempli"
            priority
          />
        </div>

        <div
          ref={refVoile}
          className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[var(--fond)] via-black/30 to-black/50"
        />

        {/* Fondu solidaire du bas de la photo : suit le bord inférieur
            pendant la réduction, et prend l'ivoire en mode clair. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[150px] bg-gradient-to-t from-[var(--fond)] from-[4%] to-transparent" />

        <div
          ref={refTexte}
          className="absolute inset-x-6 bottom-24 flex flex-col gap-4 sm:inset-x-10 lg:inset-x-14 lg:bottom-28"
        >
          <span className="h-px w-9 bg-accent lg:w-10" />
          <h1 className="max-w-3xl font-serif text-4xl leading-[1.14] text-pretty sm:text-5xl lg:text-6xl lg:leading-[1.06]">
            Des paysages intemporels, tirés avec exigence.
          </h1>
          <p className="text-sm leading-relaxed text-encre/60">
            Papier HP 250 g/m² · Cadre aluminium en option
          </p>
        </div>

        <div
          ref={refIndicateur}
          className="absolute inset-x-0 bottom-8 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] tracking-[0.2em] uppercase text-encre/40">
            Faire défiler
          </span>
          <span className="h-6 w-px bg-gradient-to-b from-encre/45 to-transparent" />
        </div>
      </div>
    </div>
  );
}
