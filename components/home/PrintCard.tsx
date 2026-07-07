import Image from "next/image";
import type { Print } from "@/types/print";
import { formaterPrixCHF, PRIX_MINIMUM } from "@/lib/pricing";

export function PrintCard({
  print,
  onOpen,
}: {
  print: Print;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group relative aspect-[4/5] overflow-hidden bg-stone-200 text-left"
    >
      <Image
        src={print.image}
        alt={print.title}
        fill
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />
      {/* Overlay revealed on hover: print title and starting price */}
      <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/0 to-black/0 p-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <span className="font-serif text-lg text-stone-50">{print.title}</span>
        <span className="mt-1 text-sm text-stone-300">
          à partir de {formaterPrixCHF(PRIX_MINIMUM)}
        </span>
      </div>
    </button>
  );
}
