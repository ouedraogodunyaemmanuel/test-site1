import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { resend } from "@/lib/resend";

// Stripe notifies this route directly from its servers as soon as a
// payment succeeds — independent of whatever the client's browser
// does afterwards (unlike the /commande/succes page, which depends on
// a redirect that might never arrive).
export async function POST(requete: Request) {
  const secretWebhook = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secretWebhook) {
    throw new Error(
      "La variable d'environnement STRIPE_WEBHOOK_SECRET est manquante. Ajoute-la dans .env.local."
    );
  }

  // The raw (unparsed) body is essential to verify the signature: the
  // slightest modification of a single byte would invalidate the
  // check.
  const corpsBrut = await requete.text();
  const signature = requete.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Signature manquante." }, { status: 400 });
  }

  let evenement: Stripe.Event;
  try {
    // This check is what guarantees the request really comes from
    // Stripe, and not from a third party simulating a successful
    // payment to get a free delivery.
    evenement = stripe.webhooks.constructEvent(corpsBrut, signature, secretWebhook);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Signature invalide.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  if (evenement.type === "checkout.session.completed") {
    const session = evenement.data.object as Stripe.Checkout.Session;
    await envoyerEmailDeCommande(session);
  }

  return NextResponse.json({ received: true });
}

async function envoyerEmailDeCommande(session: Stripe.Checkout.Session) {
  const { data: ligneArticles } = await stripe.checkout.sessions.listLineItems(
    session.id
  );

  const detailArticles = ligneArticles
    .map((ligne) => {
      const montant = ((ligne.amount_total ?? 0) / 100).toFixed(2);
      return `- ${ligne.description} × ${ligne.quantity} — CHF ${montant}`;
    })
    .join("\n");

  const { prenom, nom, telephone, adresse } = session.metadata ?? {};
  const total = ((session.amount_total ?? 0) / 100).toFixed(2);

  await resend.emails.send({
    from: "Deo Création <onboarding@resend.dev>",
    to: "ouedraogodunya@gmail.com",
    subject: `Nouvelle commande — CHF ${total}`,
    text: `Nouvelle commande payée sur le site.

Client : ${prenom ?? "?"} ${nom ?? "?"}
Téléphone : ${telephone ?? "?"}
Adresse de livraison : ${adresse ?? "?"}

Articles commandés :
${detailArticles}

Total payé : CHF ${total}
`,
  });
}
