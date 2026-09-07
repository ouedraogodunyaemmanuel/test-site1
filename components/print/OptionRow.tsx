"use client";

import type { SelectOption } from "@/types/print";

// Remplace OptionGroup (le menu dépliant) : les options tiennent en
// une grille de boutons toujours visibles. Le client voit d'un coup
// ce qui existe et ce qui est sélectionné, sans ouvrir trois menus —
// et sur mobile, sans que chaque choix demande deux taps.
export function OptionRow({
  titre,
  suffixe,
  options,
  valeurActuelle,
  colonnes,
  onSelectionner,
  rendreOption,
}: {
  titre: string;
  suffixe?: string;
  options: SelectOption[];
  valeurActuelle: string;
  colonnes: 2 | 3 | 4;
  onSelectionner: (valeur: string) => void;
  // Permet à la ligne « Cadre » d'afficher une pastille de couleur
  // plutôt que le mot « Cuivre ».
  rendreOption?: (option: SelectOption, actif: boolean) => React.ReactNode;
}) {
  const grille = {
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
  }[colonnes];

  return (
    <div>
      <div className="mb-2.5 flex items-baseline justify-between">
        <span className="text-[11px] tracking-[0.16em] uppercase text-attenue">
          {titre}
        </span>
        {suffixe && <span className="text-[11px] text-faible">{suffixe}</span>}
      </div>
      <div className={`grid gap-2.5 ${grille}`} role="group" aria-label={titre}>
        {options.map((option) => {
          const actif = valeurActuelle === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onSelectionner(option.value)}
              aria-pressed={actif}
              aria-label={option.label}
              className={`flex h-12 items-center justify-center border text-[13px] transition-colors active:scale-[0.96] ${
                actif
                  ? "border-accent text-accent-clair"
                  : "border-filet text-attenue hover:border-filet-fort hover:text-encre"
              }`}
            >
              {rendreOption ? rendreOption(option, actif) : option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Pastilles des cadres aluminium. « Sans » garde son libellé texte :
// une pastille vide ne dirait rien.
export const COULEURS_CADRES: Record<string, string> = {
  cuivre: "#b58455",
  noir: "#141210",
  blanc: "#efe9df",
};

export function PastilleCadre(option: SelectOption) {
  const couleur = COULEURS_CADRES[option.value];
  if (!couleur) return <span className="text-xs">{option.label}</span>;
  return (
    <span
      className="h-5 w-5 border border-filet-fort"
      style={{ background: couleur }}
      aria-hidden
    />
  );
}
