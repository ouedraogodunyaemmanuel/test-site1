import type { CategoryFilter, CategoryFilterOption, Print } from "@/types/print";
import { PrintCard } from "./PrintCard";

export function GallerySection({
  filters,
  activeCategory,
  onCategoryChange,
  prints,
  onOpenPrint,
}: {
  filters: CategoryFilterOption[];
  activeCategory: CategoryFilter;
  onCategoryChange: (category: CategoryFilter) => void;
  prints: Print[];
  onOpenPrint: (print: Print) => void;
}) {
  return (
    <section id="gallery" className="mx-auto w-full max-w-6xl px-6 py-24 sm:px-10">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="font-serif text-3xl text-stone-900">La collection</h2>
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter.value}
              type="button"
              onClick={() => onCategoryChange(filter.value)}
              className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                activeCategory === filter.value
                  ? "border-stone-900 bg-stone-900 text-stone-50"
                  : "border-stone-300 text-stone-600 hover:border-stone-900 hover:text-stone-900"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {prints.map((print) => (
          <PrintCard
            key={print.id}
            print={print}
            onOpen={() => onOpenPrint(print)}
          />
        ))}
      </div>
    </section>
  );
}
