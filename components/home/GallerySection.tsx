import type { Print } from "@/types/print";
import type { CategoryFilter, CategoryFilterOption } from "@/types/CategoryFilter";
import { JustifiedGallery } from "./JustifiedGallery";

export function GallerySection({
  filtres,
  categorieActive,
  onChangementCategorie,
  tirages,
  onOuvrirTirage,
}: {
  filtres: CategoryFilterOption[];
  categorieActive: CategoryFilter;
  onChangementCategorie: (categorie: CategoryFilter) => void;
  tirages: Print[];
  onOuvrirTirage: (tirage: Print) => void;
}) {
  return (
    <section id="gallery" className="mx-auto w-full max-w-6xl px-6 py-24 sm:px-10">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="font-serif text-3xl text-stone-900">La collection</h2>
        <div className="flex flex-wrap gap-2">
          {filtres.map((filtre) => (
            <button
              key={filtre.value}
              type="button"
              onClick={() => onChangementCategorie(filtre.value)}
              className={`rounded-full border px-4 py-1.5 text-sm transition active:scale-[0.95] ${
                categorieActive === filtre.value
                  ? "border-stone-900 bg-stone-900 text-stone-50"
                  : "border-stone-300 text-stone-600 hover:border-stone-900 hover:text-stone-900"
              }`}
            >
              {filtre.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-12">
        <JustifiedGallery tirages={tirages} onOuvrirTirage={onOuvrirTirage} />
      </div>
    </section>
  );
}
