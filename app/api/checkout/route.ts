import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { PRICING, calculerPrix } from "@/lib/pricing";
import type { CartItem } from "@/types/print";

// Nombre maximum d'exemplaires acceptés pour une même ligne du panier,
// pour éviter une commande absurde envoyée par erreur ou par abus.
const QUANTITE_MAXIMUM = 20;

export async function POST(request: Request) {
  const { items }: { items: CartItem[] } = await request.json();

  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "Le panier est vide." }, { status: 400 });
  }

  const origin = request.headers.get("origin") ?? new URL(request.url).origin;

  try {
    const line_items = items.map((item) => {
      // Le format doit exister dans notre grille de prix : sinon, la
      // requête est rejetée plutôt que de planter ou d'accepter un prix
      // arbitraire.
      if (!(item.format in PRICING)) {
        throw new Error(`Format inconnu : ${item.format}`);
      }
      if (
        !Number.isInteger(item.quantity) ||
        item.quantity < 1 ||
        item.quantity > QUANTITE_MAXIMUM
      ) {
        throw new Error(`Quantité invalide pour ${item.title}`);
      }

      // Le prix n'est jamais lu depuis `item.unitPrice` (envoyé par le
      // navigateur) : il est toujours recalculé ici à partir du format et
      // du cadre, pour qu'un prix modifié côté client n'ait aucun effet.
      const unitPrice = calculerPrix(item.format, item.frame);

      return {
        quantity: item.quantity,
        price_data: {
          currency: "chf",
          unit_amount: Math.round(unitPrice * 100),
          product_data: {
            name: item.title,
            description: `${item.formatLabel} · ${item.finishLabel} · ${item.frameLabel}`,
          },
        },
      };
    });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card", "twint"],
      line_items,
      success_url: `${origin}/commande/succes?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/commande/annulee`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur inconnue.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
