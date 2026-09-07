import Link from "next/link";

export default function PageAnnulee() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="font-serif text-3xl text-encre">Paiement annulé</h1>
      <p className="text-texte">
        Aucun montant n&apos;a été débité. Votre panier est toujours
        disponible si vous souhaitez réessayer.
      </p>
      <Link
        href="/"
        className="mt-4 border border-filet px-6 py-3 text-sm tracking-wide text-attenue transition hover:border-filet-fort hover:text-encre active:scale-[0.93]"
      >
        Retour à la boutique
      </Link>
    </div>
  );
}
