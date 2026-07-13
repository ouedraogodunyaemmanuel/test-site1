import type { OptionSelection } from "@/types/print";

// Un groupe d'options personnalisables : un bouton affichant le choix
// actuel, qui déplie un sous-menu de valeurs possibles au clic.
export function OptionGroup({
  titre,
  options,
  valeurActuelle,
  estOuvert,
  onBasculer,
  onSelectionner,
}: {
  titre: string;
  options: OptionSelection[];
  valeurActuelle: string;
  estOuvert: boolean;
  onBasculer: () => void;
  onSelectionner: (valeur: string) => void;
}) {
  const libelleActuel = options.find(
    (option) => option.valeur === valeurActuelle
  )?.libelle;

  return (
    <div className="border-b border-stone-200 py-3 first:border-t">
      <button
        type="button"
        onClick={onBasculer}
        aria-expanded={estOuvert}
        className="flex w-full items-center justify-between text-left"
      >
        <span className="text-sm text-stone-500">{titre}</span>
        <span className="flex items-center gap-2 text-sm text-stone-900">
          {libelleActuel}
          <span
            className={`text-xs transition-transform duration-200 ${
              estOuvert ? "rotate-180" : ""
            }`}
            aria-hidden
          >
            ▾
          </span>
        </span>
      </button>
      {estOuvert && (
        <div className="mt-3 flex flex-wrap gap-2">
          {options.map((option) => (
            <button
              key={option.valeur}
              type="button"
              onClick={() => {
                onSelectionner(option.valeur);
                onBasculer();
              }}
              className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                option.valeur === valeurActuelle
                  ? "border-stone-900 bg-stone-900 text-stone-50"
                  : "border-stone-300 text-stone-600 hover:border-stone-900 hover:text-stone-900"
              }`}
            >
              {option.libelle}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
