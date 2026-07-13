import Image from "next/image";
import type { Tirage } from "@/types/print";
import { formaterPrixCHF, PRIX_MINIMUM } from "@/lib/pricing";
import { obtenirUrlImageTirage } from "@/lib/images";
import { FORMATS } from "@/data/options";

export function PrintCard({
  tirage,
  onOuvrir,
}: {
  tirage: Tirage;
  onOuvrir: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOuvrir}
      className="group relative aspect-[4/5] overflow-hidden bg-stone-200 text-left"
    >
      <Image
        // Pas encore d'options choisies à ce stade (simple survol de la
        // galerie) : on affiche la variante "sans cadre" par défaut — le
        // format n'a pas d'importance ici puisque "aucun" l'ignore.
        src={obtenirUrlImageTirage(tirage, "aucun", FORMATS[0].valeur)}
        alt={tirage.titre}
        fill
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />
      {/* Overlay révélé au survol : titre du tirage et prix de départ */}
      <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/0 to-black/0 p-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <span className="font-serif text-lg text-stone-50">{tirage.titre}</span>
        <span className="mt-1 text-sm text-stone-300">
          à partir de {formaterPrixCHF(PRIX_MINIMUM)}
        </span>
      </div>
    </button>
  );
}
