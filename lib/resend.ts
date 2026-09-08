import { Resend } from "resend";

// Like lib/stripe.ts: never imported in a client component, so the
// key never leaves the server.
let instance: Resend | null = null;

function obtenirInstance(): Resend {
  if (instance) return instance;
  const cleApi = process.env.RESEND_API_KEY;
  if (!cleApi) {
    throw new Error(
      "La variable d'environnement RESEND_API_KEY est manquante. Ajoute-la dans .env.local."
    );
  }
  instance = new Resend(cleApi);
  return instance;
}

// Proxy plutôt qu'un `new Resend(...)` immédiat : voir le commentaire
// équivalent dans lib/stripe.ts — un throw au niveau du module casse
// le build entier de `next build`, qui importe toutes les routes pour
// analyser leurs exports.
export const resend = new Proxy({} as Resend, {
  get(_cible, propriete, receveur) {
    return Reflect.get(obtenirInstance(), propriete, receveur);
  },
});
