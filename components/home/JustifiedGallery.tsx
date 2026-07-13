"use client";

import { useEffect, useRef, useState } from "react";
import type { Print } from "@/types/print";
import { RATIOS_IMAGES } from "@/data/imageRatios.generated";
import { PrintCard } from "./PrintCard";

const ECART = 16; // px, between two photos (horizontally and between rows)
const HAUTEUR_LIGNE_MOBILE = 220; // px
const HAUTEUR_LIGNE_DESKTOP = 320; // px
const LARGEUR_SEUIL_MOBILE = 640; // px
// Ratio (width / height) used for a photo whose real proportions
// aren't known yet (before it has loaded for the first time).
const RATIO_PAR_DEFAUT = 2 / 3;

// Builds "justified" rows (à la Google Photos): each complete row is
// stretched so the photos' widths sum up to exactly fill the
// available width, at a shared row height — so every photo keeps its
// real proportions and is never cropped. The last row, if it doesn't
// have enough photos to naturally reach that width, keeps the target
// height instead of being stretched to excess.
function calculerLignes(
  ratios: number[],
  largeurDisponible: number,
  hauteurCible: number,
  ecart: number
) {
  const lignes: { index: number; ratio: number; largeur: number; hauteur: number }[][] = [];
  let ligneActuelle: { index: number; ratio: number }[] = [];
  let sommeRatios = 0;

  function clorreLigne(hauteur: number) {
    lignes.push(
      ligneActuelle.map((item) => ({ ...item, largeur: item.ratio * hauteur, hauteur }))
    );
    ligneActuelle = [];
    sommeRatios = 0;
  }

  ratios.forEach((ratio, index) => {
    ligneActuelle.push({ index, ratio });
    sommeRatios += ratio;
    const ecartsLigne = ecart * (ligneActuelle.length - 1);
    const largeurNaturelle = sommeRatios * hauteurCible + ecartsLigne;
    if (largeurNaturelle >= largeurDisponible) {
      clorreLigne((largeurDisponible - ecartsLigne) / sommeRatios);
    }
  });

  if (ligneActuelle.length > 0) {
    const ecartsLigne = ecart * (ligneActuelle.length - 1);
    const largeurNaturelle = sommeRatios * hauteurCible;
    const largeurDisponibleSansEcarts = largeurDisponible - ecartsLigne;
    const hauteur =
      largeurNaturelle >= largeurDisponibleSansEcarts
        ? largeurDisponibleSansEcarts / sommeRatios
        : hauteurCible;
    clorreLigne(hauteur);
  }

  return lignes;
}

export function JustifiedGallery({
  tirages,
  onOuvrirTirage,
}: {
  tirages: Print[];
  onOuvrirTirage: (tirage: Print) => void;
}) {
  const conteneurRef = useRef<HTMLDivElement>(null);
  const [largeurConteneur, setLargeurConteneur] = useState(0);
  // Real ratio of each photo, known once loaded in the browser
  // (indexed by the print's id — see PrintImage.tsx for the
  // detection). Only used as a safety net: the primary source is
  // RATIOS_IMAGES, precomputed by scripts/calculer-ratios.mjs before
  // the very first render, so there's no visual reflow on load.
  const [ratios, setRatios] = useState<Record<number, number>>({});

  useEffect(() => {
    const conteneur = conteneurRef.current;
    if (!conteneur) return;
    const observateur = new ResizeObserver((entrees) => {
      setLargeurConteneur(entrees[0].contentRect.width);
    });
    observateur.observe(conteneur);
    return () => observateur.disconnect();
  }, []);

  function gererRatioConnu(idTirage: number, ratio: number) {
    setRatios((current) =>
      current[idTirage] === ratio ? current : { ...current, [idTirage]: ratio }
    );
  }

  const hauteurCible =
    largeurConteneur > 0 && largeurConteneur < LARGEUR_SEUIL_MOBILE
      ? HAUTEUR_LIGNE_MOBILE
      : HAUTEUR_LIGNE_DESKTOP;

  const ratiosOrdonnes = tirages.map(
    (tirage) => ratios[tirage.id] ?? RATIOS_IMAGES[tirage.imageFolder] ?? RATIO_PAR_DEFAUT
  );
  const lignes =
    largeurConteneur > 0
      ? calculerLignes(ratiosOrdonnes, largeurConteneur, hauteurCible, ECART)
      : [];

  return (
    <div ref={conteneurRef} className="flex flex-col gap-4">
      {lignes.map((ligne, indexLigne) => (
        <div key={indexLigne} className="flex gap-4">
          {ligne.map(({ index, largeur, hauteur }) => {
            const tirage = tirages[index];
            return (
              <PrintCard
                key={tirage.id}
                tirage={tirage}
                onOuvrir={() => onOuvrirTirage(tirage)}
                style={{ width: largeur, height: hauteur }}
                sizes={`${Math.round(largeur)}px`}
                onRatioConnu={(ratio) => gererRatioConnu(tirage.id, ratio)}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}
