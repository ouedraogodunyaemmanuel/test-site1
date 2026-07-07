import Stripe from "stripe";

// Ce fichier n'est jamais importé par du code exécuté dans le navigateur
// (uniquement par des routes API et des Server Components), donc la clé
// secrète ne quitte jamais le serveur.
const secretKey = process.env.STRIPE_SECRET_KEY;

if (!secretKey) {
  throw new Error(
    "La variable d'environnement STRIPE_SECRET_KEY est manquante. Ajoute-la dans .env.local."
  );
}

export const stripe = new Stripe(secretKey);
