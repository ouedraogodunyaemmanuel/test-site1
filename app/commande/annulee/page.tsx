import Link from "next/link";

export default function PageAnnulee() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="font-serif text-3xl text-stone-900">Paiement annulé</h1>
      <p className="text-stone-600">
        Aucun montant n&apos;a été débité. Votre panier est toujours
        disponible si vous souhaitez réessayer.
      </p>
      <Link
        href="/"
        className="mt-4 border border-stone-300 px-6 py-3 text-sm tracking-wide text-stone-600 transition-colors hover:border-stone-900 hover:text-stone-900"
      >
        Retour à la boutique
      </Link>
    </div>
  );
}
