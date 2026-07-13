import type { FiltreCategorie, OptionFiltreCategorie, Tirage } from "@/types/print";
import { PrintCard } from "./PrintCard";

export function GallerySection({
  filtres,
  categorieActive,
  onChangementCategorie,
  tirages,
  onOuvrirTirage,
}: {
  filtres: OptionFiltreCategorie[];
  categorieActive: FiltreCategorie;
  onChangementCategorie: (categorie: FiltreCategorie) => void;
  tirages: Tirage[];
  onOuvrirTirage: (tirage: Tirage) => void;
}) {
  return (
    <section id="gallery" className="mx-auto w-full max-w-6xl px-6 py-24 sm:px-10">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="font-serif text-3xl text-stone-900">La collection</h2>
        <div className="flex flex-wrap gap-2">
          {filtres.map((filtre) => (
            <button
              key={filtre.valeur}
              type="button"
              onClick={() => onChangementCategorie(filtre.valeur)}
              className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                categorieActive === filtre.valeur
                  ? "border-stone-900 bg-stone-900 text-stone-50"
                  : "border-stone-300 text-stone-600 hover:border-stone-900 hover:text-stone-900"
              }`}
            >
              {filtre.libelle}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {tirages.map((tirage) => (
          <PrintCard
            key={tirage.id}
            tirage={tirage}
            onOuvrir={() => onOuvrirTirage(tirage)}
          />
        ))}
      </div>
    </section>
  );
}
