import Image from "next/image";
import type { CartItem } from "@/types/Cart";
import { formaterPrixCHF } from "@/lib/pricing";

export function CartLine({
  item,
  onRemove,
  onQuantityChange,
}: {
  item: CartItem;
  onRemove: () => void;
  onQuantityChange: (quantity: number) => void;
}) {
  return (
    <div className="flex gap-4 border-b border-stone-900 pb-6">
      <div className="relative h-20 w-16 shrink-0 overflow-hidden bg-stone-200">
        <Image
          src={item.image}
          alt={item.title}
          fill
          sizes="64px"
          className="object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col text-sm">
        <span className="font-serif text-stone-900">{item.title}</span>
        <span className="mt-1 text-stone-500">
          {item.formatLabel} · {item.finishLabel} · {item.frameLabel}
        </span>
        <span className="mt-1 text-stone-900">
          {formaterPrixCHF(item.unitPrice)}
        </span>
        <div className="mt-2 flex items-center gap-3">
          <div className="flex items-center border border-stone-300">
            <button
              type="button"
              onClick={() => onQuantityChange(item.quantity - 1)}
              aria-label="Diminuer la quantité"
              className="px-2 py-1 text-stone-600 transition hover:text-stone-900 active:scale-[0.85]"
            >
              −
            </button>
            <span className="px-2 text-stone-900">{item.quantity}</span>
            <button
              type="button"
              onClick={() => onQuantityChange(item.quantity + 1)}
              aria-label="Augmenter la quantité"
              className="px-2 py-1 text-stone-600 transition hover:text-stone-900 active:scale-[0.85]"
            >
              +
            </button>
          </div>
          <button
            type="button"
            onClick={onRemove}
            className="text-stone-500 underline transition-colors hover:text-stone-900"
          >
            Retirer
          </button>
        </div>
      </div>
    </div>
  );
}
