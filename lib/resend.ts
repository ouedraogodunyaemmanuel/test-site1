import { Resend } from "resend";

// Comme lib/stripe.ts : jamais importé dans un composant client, donc la
// clé ne quitte jamais le serveur.
const cleApi = process.env.RESEND_API_KEY;

if (!cleApi) {
  throw new Error(
    "La variable d'environnement RESEND_API_KEY est manquante. Ajoute-la dans .env.local."
  );
}

export const resend = new Resend(cleApi);
