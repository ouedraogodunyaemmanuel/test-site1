"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import type { Print } from "@/types/print";
import { obtenirUrlImageTirage } from "@/lib/images";
import { RATIOS_IMAGES } from "@/data/imageRatios.generated";
import { FORMATS } from "@/data/options";

// Largeur de référence pour next/image. La hauteur est déduite du
// ratio réel de chaque photo (data/imageRatios.generated.ts), donc
// aucune image n'est recadrée.
const LARGEUR_REFERENCE = 1600;

// Les photographies seules, dans leur format d'origine : aucun
// recadrage, aucun titre, aucune catégorie. Flux vertical pleine
// largeur sur mobile, maçonnerie deux puis trois colonnes ensuite.
//
// N'utilise pas PrintImage : son mode `ajustement="contain"` ajoute un
// passe-partout blanc en dur (`bg-white p-4`), correct pour la fiche
// tirage mais faux ici — il faut que le fond suive le thème.
export function PortfolioGrid({ tirages }: { tirages: Print[] }) {
  const router = useRouter();

  return (
    <div className="mt-11 sm:columns-2 sm:gap-7 lg:columns-3 lg:gap-[30px]">
      {tirages.map((tirage) => {
        const ratio = RATIOS_IMAGES[tirage.imageFolder] ?? 2 / 3;
        return (
          <button
            key={tirage.id}
            type="button"
            // Ouvre la fiche du tirage sur la page d'accueil.
            onClick={() => router.push(`/?tirage=${tirage.id}#gallery`)}
            aria-label={tirage.title}
            className="mb-7 block w-full break-inside-avoid transition-opacity hover:opacity-90 lg:mb-[30px]"
          >
            <Image
              src={obtenirUrlImageTirage(tirage, "aucun", FORMATS[0].value)}
              alt={tirage.title}
              width={LARGEUR_REFERENCE}
              height={Math.round(LARGEUR_REFERENCE / ratio)}
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              // Fichiers déjà pré-dimensionnés, comme ailleurs sur le
              // site : inutile de repasser par l'optimiseur.
              unoptimized
              // Bordures latérales aux couleurs du thème : elles
              // séparent les photos sans jamais rester noires en mode
              // clair.
              className="h-auto w-full border-x-8 border-fond"
            />
          </button>
        );
      })}
    </div>
  );
}
