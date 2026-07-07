import Link from "next/link";
import { stripe } from "@/lib/stripe";
import { ClearCartOnSuccess } from "@/components/checkout/ClearCartOnSuccess";

// Cette page tourne côté serveur : elle interroge directement Stripe pour
// vérifier que le paiement a réellement abouti, plutôt que de faire
// confiance au simple fait que le navigateur ait été redirigé ici (une
// redirection peut être rejouée ou falsifiée, une vérification serveur non).
export default async function PageSucces({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id: sessionId } = await searchParams;
  const session = sessionId
    ? await stripe.checkout.sessions.retrieve(sessionId)
    : null;
  const paiementConfirme = session?.payment_status === "paid";

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center gap-4 px-6 text-center">
      {paiementConfirme ? (
        <>
          <h1 className="font-serif text-3xl text-stone-900">
            Merci pour votre commande !
          </h1>
          <p className="text-stone-600">
            Votre paiement a bien été reçu. Vous recevrez votre tirage
            prochainement.
          </p>
          <ClearCartOnSuccess />
        </>
      ) : (
        <>
          <h1 className="font-serif text-3xl text-stone-900">
            Paiement introuvable
          </h1>
          <p className="text-stone-600">
            Nous n&apos;avons pas pu confirmer ce paiement. Si vous pensez
            qu&apos;il s&apos;agit d&apos;une erreur, contactez-nous.
          </p>
        </>
      )}
      <Link
        href="/"
        className="mt-4 border border-stone-300 px-6 py-3 text-sm tracking-wide text-stone-600 transition-colors hover:border-stone-900 hover:text-stone-900"
      >
        Retour à la boutique
      </Link>
    </div>
  );
}
