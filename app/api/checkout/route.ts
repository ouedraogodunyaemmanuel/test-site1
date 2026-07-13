import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { GRILLE_PRIX, calculerPrix } from "@/lib/pricing";
import type { ArticlePanier, InfosLivraison } from "@/types/print";

// Nombre maximum d'exemplaires acceptés pour une même ligne du panier,
// pour éviter une commande absurde envoyée par erreur ou par abus.
const QUANTITE_MAXIMUM = 20;

export async function POST(requete: Request) {
  const { articles, livraison }: { articles: ArticlePanier[]; livraison?: InfosLivraison } =
    await requete.json();

  if (!Array.isArray(articles) || articles.length === 0) {
    return NextResponse.json({ error: "Le panier est vide." }, { status: 400 });
  }

  if (
    !livraison ||
    !livraison.prenom ||
    !livraison.nom ||
    !livraison.telephone ||
    !livraison.rue ||
    !livraison.codePostal ||
    !livraison.ville
  ) {
    return NextResponse.json(
      { error: "Les informations de livraison sont incomplètes." },
      { status: 400 }
    );
  }

  const origine = requete.headers.get("origin") ?? new URL(requete.url).origin;

  try {
    const articlesLignes = articles.map((article) => {
      // Le format doit exister dans notre grille de prix : sinon, la
      // requête est rejetée plutôt que de planter ou d'accepter un prix
      // arbitraire.
      if (!(article.format in GRILLE_PRIX)) {
        throw new Error(`Format inconnu : ${article.format}`);
      }
      if (
        !Number.isInteger(article.quantite) ||
        article.quantite < 1 ||
        article.quantite > QUANTITE_MAXIMUM
      ) {
        throw new Error(`Quantité invalide pour ${article.titre}`);
      }

      // Le prix n'est jamais lu depuis `article.prixUnitaire` (envoyé par
      // le navigateur) : il est toujours recalculé ici à partir du format
      // et du cadre, pour qu'un prix modifié côté client n'ait aucun effet.
      const prixUnitaire = calculerPrix(article.format, article.cadre);

      return {
        quantity: article.quantite,
        price_data: {
          currency: "chf",
          unit_amount: Math.round(prixUnitaire * 100),
          product_data: {
            name: article.titre,
            description: `${article.libelleFormat} · ${article.libelleFinition} · ${article.libelleCadre}`,
            // Stripe a besoin d'une URL absolue et publiquement
            // accessible : en local (localhost), Stripe ne pourra pas la
            // charger et n'affichera simplement pas d'image, sans
            // erreur — ça fonctionnera normalement une fois le site
            // déployé avec un vrai nom de domaine.
            images: [`${origine}${article.image}`],
          },
        },
      };
    });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      // Sans ce réglage, Stripe devine la langue depuis le navigateur du
      // client ("auto") plutôt que d'utiliser la langue du tableau de
      // bord — comme le site est en français, on la fixe explicitement.
      locale: "fr",
      // Pas de `payment_method_types` ici : Stripe choisit dynamiquement
      // les moyens de paiement à afficher (carte, TWINT...) selon le
      // client et la transaction. Les moyens acceptés se gèrent depuis le
      // Dashboard Stripe (Paramètres → Moyens de paiement), pas dans le
      // code.
      line_items: articlesLignes,
      // Les coordonnées de livraison ont déjà été saisies sur notre propre
      // page (pas besoin de les redemander sur Stripe) : on les attache en
      // metadata pour les retrouver dans le dashboard Stripe au moment de
      // préparer l'envoi.
      metadata: {
        prenom: livraison.prenom,
        nom: livraison.nom,
        telephone: livraison.telephone,
        adresse: `${livraison.rue}, ${livraison.codePostal} ${livraison.ville}`,
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
