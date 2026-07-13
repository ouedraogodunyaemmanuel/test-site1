import Image from "next/image";
import type { ArticlePanier } from "@/types/print";
import { formaterPrixCHF } from "@/lib/pricing";

export function CartLine({
  article,
  onRetirer,
  onChangementQuantite,
}: {
  article: ArticlePanier;
  onRetirer: () => void;
  onChangementQuantite: (quantite: number) => void;
}) {
  return (
    <div className="flex gap-4">
      <div className="relative h-20 w-16 shrink-0 overflow-hidden bg-stone-200">
        <Image
          src={article.image}
          alt={article.titre}
          fill
          sizes="64px"
          className="object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col text-sm">
        <span className="font-serif text-stone-900">{article.titre}</span>
        <span className="mt-1 text-stone-500">
          {article.libelleFormat} · {article.libelleFinition} · {article.libelleCadre}
        </span>
        <span className="mt-1 text-stone-900">
          {formaterPrixCHF(article.prixUnitaire)}
        </span>
        <div className="mt-2 flex items-center gap-3">
          <div className="flex items-center border border-stone-300">
            <button
              type="button"
              onClick={() => onChangementQuantite(article.quantite - 1)}
              aria-label="Diminuer la quantité"
              className="px-2 py-1 text-stone-600 transition-colors hover:text-stone-900"
            >
              −
            </button>
            <span className="px-2 text-stone-900">{article.quantite}</span>
            <button
              type="button"
              onClick={() => onChangementQuantite(article.quantite + 1)}
              aria-label="Augmenter la quantité"
              className="px-2 py-1 text-stone-600 transition-colors hover:text-stone-900"
            >
              +
            </button>
          </div>
          <button
            type="button"
            onClick={onRetirer}
            className="text-stone-500 underline transition-colors hover:text-stone-900"
          >
            Retirer
          </button>
        </div>
      </div>
    </div>
  );
}
