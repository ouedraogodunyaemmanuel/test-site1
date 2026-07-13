import { Resend } from "resend";

// Like lib/stripe.ts: never imported in a client component, so the
// key never leaves the server.
const cleApi = process.env.RESEND_API_KEY;

if (!cleApi) {
  throw new Error(
    "La variable d'environnement RESEND_API_KEY est manquante. Ajoute-la dans .env.local."
  );
}

export const resend = new Resend(cleApi);
