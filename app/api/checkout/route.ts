import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { GRILLE_PRIX, calculerPrix } from "@/lib/pricing";
import type { CartItem } from "@/types/Cart";
import type { DeliveryInfo } from "@/types/Delivery";

// Maximum number of copies accepted for a single cart line, to avoid
// an absurd order sent by mistake or abuse.
const QUANTITE_MAXIMUM = 20;

export async function POST(requete: Request) {
  const { items, delivery }: { items: CartItem[]; delivery?: DeliveryInfo } =
    await requete.json();

  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "Le panier est vide." }, { status: 400 });
  }

  if (
    !delivery ||
    !delivery.firstName ||
    !delivery.lastName ||
    !delivery.phone ||
    !delivery.street ||
    !delivery.postalCode ||
    !delivery.city
  ) {
    return NextResponse.json(
      { error: "Les informations de livraison sont incomplètes." },
      { status: 400 }
    );
  }

  const origine = requete.headers.get("origin") ?? new URL(requete.url).origin;

  try {
    const lineItems = items.map((item) => {
      // The format must exist in our pricing grid: otherwise, the
      // request is rejected rather than crashing or accepting an
      // arbitrary price.
      if (!(item.format in GRILLE_PRIX)) {
        throw new Error(`Format inconnu : ${item.format}`);
      }
      if (
        !Number.isInteger(item.quantity) ||
        item.quantity < 1 ||
        item.quantity > QUANTITE_MAXIMUM
      ) {
        throw new Error(`Quantité invalide pour ${item.title}`);
      }

      // The price is never read from `item.unitPrice` (sent by
      // the browser): it is always recalculated here from the format
      // and frame, so that a price tampered with client-side has no effect.
      const unitPrice = calculerPrix(item.format, item.frame);

      return {
        quantity: item.quantity,
        price_data: {
          currency: "chf",
          unit_amount: Math.round(unitPrice * 100),
          product_data: {
            name: item.title,
            description: `${item.formatLabel} · ${item.finishLabel} · ${item.frameLabel}`,
            // Stripe needs an absolute, publicly accessible URL:
            // locally (localhost), Stripe won't be able to load it and
            // will simply show no image, without error — it will work
            // normally once the site is deployed with a real domain
            // name.
            images: [`${origine}${item.image}`],
          },
        },
      };
    });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      // Without this setting, Stripe guesses the language from the
      // client's browser ("auto") instead of using the dashboard's
      // language — since the site is in French, we set it explicitly.
      locale: "fr",
      // No `payment_method_types` here: Stripe dynamically chooses
      // which payment methods to show (card, TWINT...) based on the
      // client and the transaction. Accepted methods are managed from
      // the Stripe Dashboard (Settings → Payment methods), not in the
      // code.
      line_items: lineItems,
      // The delivery details have already been entered on our own
      // page (no need to ask again on Stripe): we attach them as
      // metadata to find them in the Stripe dashboard when it's time
      // to prepare the shipment.
      metadata: {
        prenom: delivery.firstName,
        nom: delivery.lastName,
        telephone: delivery.phone,
        adresse: `${delivery.street}, ${delivery.postalCode} ${delivery.city}`,
      },
      success_url: `${origine}/commande/succes?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origine}/commande/annulee`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur inconnue.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
