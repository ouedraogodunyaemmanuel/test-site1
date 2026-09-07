import type { Print } from "@/types/print";
import type { CategoryFilterOption } from "@/types/CategoryFilter";
import { PrintCard } from "./PrintCard";

// Grille régulière : chaque tirage occupe une case du même format
// (photo recadrée), pour une collection lisible d'un coup d'œil —
// contrairement à une mise en page justifiée dont la largeur de
// chaque carte varie avec l'orientation réelle de la photo.
export function PrintGrid({
  tirages,
  filtres,
  onOuvrirTirage,
}: {
  tirages: Print[];
  filtres: CategoryFilterOption[];
  onOuvrirTirage: (tirage: Print) => void;
}) {
  // Identifies the current filtered set of photos, not just this
  // render — included in each card's key below so every card gets a
  // fresh mount (and replays its entrance animation) whenever the
  // category filter changes, even a card that was already visible
  // before under a different position.
  const signatureFiltre = tirages.map((tirage) => tirage.id).join(",");

  return (
    <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 sm:gap-8 lg:grid-cols-4 lg:gap-[30px]">
      {tirages.map((tirage, index) => (
        <PrintCard
          key={`${signatureFiltre}-${tirage.id}`}
          tirage={tirage}
          categoryLabel={trouverLibelleCategorie(filtres, tirage.category)}
          onOuvrir={() => onOuvrirTirage(tirage)}
          // Staggered by position, capped so a large gallery doesn't
          // end up with a long tail of slow entrances.
          animationDelayMs={Math.min(index, 12) * 80}
          // First row is above the fold — skip lazy-load scheduling so
          // it starts downloading immediately, keeping pace with its
          // own entrance animation.
          priority={index < 4}
        />
      ))}
    </div>
  );
}

function trouverLibelleCategorie(filtres: CategoryFilterOption[], categorie: string) {
  return filtres.find((filtre) => filtre.value === categorie)?.label ?? categorie;
}
