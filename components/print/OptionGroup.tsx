import type { SelectOption } from "@/types/print";

// Un groupe d'options personnalisables : un bouton affichant le choix
// actuel, qui déplie un sous-menu de valeurs possibles au clic.
export function OptionGroup({
  title,
  options,
  currentValue,
  isOpen,
  onToggle,
  onSelect,
}: {
  title: string;
  options: SelectOption[];
  currentValue: string;
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (value: string) => void;
}) {
  const currentLabel = options.find(
    (option) => option.value === currentValue
  )?.label;

  return (
    <div className="border-b border-stone-200 py-3 first:border-t">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between text-left"
      >
        <span className="text-sm text-stone-500">{title}</span>
        <span className="flex items-center gap-2 text-sm text-stone-900">
          {currentLabel}
          <span
            className={`text-xs transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
            aria-hidden
          >
            ▾
          </span>
        </span>
      </button>
      {isOpen && (
        <div className="mt-3 flex flex-wrap gap-2">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onSelect(option.value);
                onToggle();
              }}
              className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                option.value === currentValue
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
