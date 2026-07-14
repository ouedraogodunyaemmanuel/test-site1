import type { SelectOption } from "@/types/print";

// A customizable option group: a button showing the current choice,
// which expands a submenu of possible values on click.
export function OptionGroup({
  titre,
  options,
  valeurActuelle,
  estOuvert,
  onBasculer,
  onSelectionner,
}: {
  titre: string;
  options: SelectOption[];
  valeurActuelle: string;
  estOuvert: boolean;
  onBasculer: () => void;
  onSelectionner: (valeur: string) => void;
}) {
  const libelleActuel = options.find(
    (option) => option.value === valeurActuelle
  )?.label;

  return (
    <div className="border-b border-stone-200 py-3 first:border-t">
      <button
        type="button"
        onClick={onBasculer}
        aria-expanded={estOuvert}
        className="flex w-full items-center justify-between text-left transition-transform active:scale-[0.98]"
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
              key={option.value}
              type="button"
              onClick={() => onSelectionner(option.value)}
              className={`rounded-full border px-3 py-1.5 text-sm transition active:scale-[0.90] ${
                option.value === valeurActuelle
                  ? "border-stone-900 bg-stone-900 text-stone-50"
                  : "border-stone-300 text-stone-600 hover:border-stone-900 hover:text-stone-900"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
