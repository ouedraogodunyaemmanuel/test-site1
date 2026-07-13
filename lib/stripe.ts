import Stripe from "stripe";

// This file is never imported by code that runs in the browser
// (only by API routes and Server Components), so the secret key
// never leaves the server.
const cleSecrete = process.env.STRIPE_SECRET_KEY;

if (!cleSecrete) {
  throw new Error(
    "La variable d'environnement STRIPE_SECRET_KEY est manquante. Ajoute-la dans .env.local."
  );
}

export const stripe = new Stripe(cleSecrete);
