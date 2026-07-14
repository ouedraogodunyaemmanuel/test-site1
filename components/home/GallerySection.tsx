import type { Print } from "@/types/print";
import type { CategoryFilter, CategoryFilterOption } from "@/types/CategoryFilter";
import { CategoryFilterMenu } from "./CategoryFilterMenu";
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
        <CategoryFilterMenu
          filtres={filtres}
          categorieActive={categorieActive}
          onChangementCategorie={onChangementCategorie}
        />
      </div>

      <div className="mt-12">
        <JustifiedGallery tirages={tirages} onOuvrirTirage={onOuvrirTirage} />
      </div>
    </section>
  );
}
