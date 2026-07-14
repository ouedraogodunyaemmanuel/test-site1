"use client";

import { useState } from "react";
import type { CategoryFilter, CategoryFilterOption } from "@/types/CategoryFilter";

// A single toggle button that expands into the list of category
// filters on click, instead of showing every filter pill at once —
// keeps the gallery header compact now that there are several
// categories to choose from.
export function CategoryFilterMenu({
  filtres,
  categorieActive,
  onChangementCategorie,
}: {
  filtres: CategoryFilterOption[];
  categorieActive: CategoryFilter;
  onChangementCategorie: (categorie: CategoryFilter) => void;
}) {
  const [estOuvert, setEstOuvert] = useState(false);
  const libelleActuel = filtres.find((filtre) => filtre.value === categorieActive)?.label;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setEstOuvert((current) => !current)}
        aria-expanded={estOuvert}
        className="flex items-center gap-2 rounded-full border border-stone-300 px-4 py-1.5 text-sm text-stone-600 transition hover:border-stone-900 hover:text-stone-900 active:scale-[0.95]"
      >
        <span>Filtrer : {libelleActuel}</span>
        <span
          className={`text-xs transition-transform duration-200 ${estOuvert ? "rotate-180" : ""}`}
          aria-hidden
        >
          ▾
        </span>
      </button>
      {estOuvert && (
        <div className="absolute right-0 z-10 mt-2 flex w-48 flex-col rounded-lg border border-stone-200 bg-stone-50 py-2 shadow-lg">
          {filtres.map((filtre) => (
            <button
              key={filtre.value}
              type="button"
              onClick={() => {
                onChangementCategorie(filtre.value);
                setEstOuvert(false);
              }}
              className={`px-4 py-2 text-left text-sm transition active:scale-[0.98] ${
                categorieActive === filtre.value
                  ? "bg-stone-900 text-stone-50"
                  : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
              }`}
            >
              {filtre.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
