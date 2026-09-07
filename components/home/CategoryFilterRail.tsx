"use client";

import type { CategoryFilter, CategoryFilterOption } from "@/types/CategoryFilter";

// Remplace CategoryFilterMenu : le menu déroulant « Filtrer : Tous »
// cachait les catégories derrière un clic et n'en montrait qu'une à la
// fois. Les sept tiennent sur un rail défilant, la catégorie active
// est immédiatement lisible.
export function CategoryFilterRail({
  filtres,
  categorieActive,
  onChangementCategorie,
}: {
  filtres: CategoryFilterOption[];
  categorieActive: CategoryFilter;
  onChangementCategorie: (categorie: CategoryFilter) => void;
}) {
  return (
    <div
      className="rail-sans-barre -mx-6 flex gap-2.5 overflow-x-auto px-6 sm:mx-0 sm:flex-wrap sm:px-0"
      role="group"
      aria-label="Filtrer par catégorie"
    >
      {filtres.map((filtre) => {
        const actif = categorieActive === filtre.value;
        return (
          <button
            key={filtre.value}
            type="button"
            onClick={() => onChangementCategorie(filtre.value)}
            aria-pressed={actif}
            className={`shrink-0 border px-3.5 py-2 text-[11px] tracking-[0.14em] whitespace-nowrap uppercase transition-colors active:scale-[0.96] ${
              actif
                ? "border-accent bg-accent text-fond"
                : "border-filet text-attenue hover:border-filet-fort hover:text-encre"
            }`}
          >
            {filtre.label}
          </button>
        );
      })}
    </div>
  );
}
