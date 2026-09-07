import type { Print } from "@/types/print";
import type { CategoryFilter, CategoryFilterOption } from "@/types/CategoryFilter";
import { CategoryFilterRail } from "./CategoryFilterRail";
import { JustifiedGallery } from "./JustifiedGallery";
import { PrintGrid } from "./PrintGrid";

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
    // `relative z-10` + fond opaque : la section passe par-dessus la
    // photo du hero, qui est en `sticky` derrière elle.
    <section
      id="gallery"
      className="relative z-10 w-full bg-fond px-6 pt-9 pb-16 sm:px-10 lg:px-[56px] lg:pt-[60px] lg:pb-[70px]"
    >
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-3.5">
          <span className="h-px w-9 bg-accent sm:w-10" />
          <h2 className="font-serif text-3xl text-encre sm:text-4xl">
            La collection
          </h2>
          <p className="text-sm text-attenue">
            Sept tirages, imprimés à la demande.
          </p>
        </div>
        <CategoryFilterRail
          filtres={filtres}
          categorieActive={categorieActive}
          onChangementCategorie={onChangementCategorie}
        />
      </div>

      <div className="mt-10">
        {tirages.length > 0 ? (
          <>
            {/* Mobile : mise en page justifiée (largeur de chaque
                photo proportionnelle à son ratio réel), comme avant la
                refonte visuelle. Desktop : grille régulière au format
                uniforme (voir PrintGrid.tsx). Même URL de vignette dans
                les deux cas (voir PrintCard.tsx), donc un seul
                téléchargement malgré les deux montages. */}
            <div className="sm:hidden">
              <JustifiedGallery
                tirages={tirages}
                filtres={filtres}
                onOuvrirTirage={onOuvrirTirage}
              />
            </div>
            <div className="hidden sm:block">
              <PrintGrid tirages={tirages} filtres={filtres} onOuvrirTirage={onOuvrirTirage} />
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2.5 py-16 text-center">
            <span className="font-serif text-xl text-encre">Aucun tirage</span>
            <span className="text-sm text-attenue">
              Cette catégorie n&apos;a pas encore de tirage. Choisissez-en une autre.
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
