import Link from "next/link";
import { stripe } from "@/lib/stripe";
import { ClearOrderOnSuccess } from "@/components/checkout/ClearOrderOnSuccess";

// This page runs server-side: it queries Stripe directly to verify
// that the payment actually succeeded, rather than trusting the mere
// fact that the browser was redirected here (a redirect can be
// replayed or forged, a server-side check cannot).
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
          <h1 className="font-serif text-3xl text-encre">
            Merci pour votre commande !
          </h1>
          <p className="text-texte">
            Votre paiement a bien été reçu. Vous recevrez votre tirage
            prochainement.
          </p>
          <ClearOrderOnSuccess />
        </>
      ) : (
        <>
          <h1 className="font-serif text-3xl text-encre">
            Paiement introuvable
          </h1>
          <p className="text-texte">
            Nous n&apos;avons pas pu confirmer ce paiement. Si vous pensez
            qu&apos;il s&apos;agit d&apos;une erreur, contactez-nous.
          </p>
        </>
      )}
      <Link
        href="/"
        className="mt-4 border border-filet px-6 py-3 text-sm tracking-wide text-attenue transition hover:border-filet-fort hover:text-encre active:scale-[0.93]"
      >
        Retour à la boutique
      </Link>
    </div>
  );
}
