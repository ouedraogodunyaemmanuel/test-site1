import Stripe from "stripe";

// This file is never imported by code that runs in the browser
// (only by API routes and Server Components), so the secret key
// never leaves the server.
let instance: Stripe | null = null;

function obtenirInstance(): Stripe {
  if (instance) return instance;
  const cleSecrete = process.env.STRIPE_SECRET_KEY;
  if (!cleSecrete) {
    throw new Error(
      "La variable d'environnement STRIPE_SECRET_KEY est manquante. Ajoute-la dans .env.local."
    );
  }
  instance = new Stripe(cleSecrete);
  return instance;
}

// Un Proxy plutôt qu'un `new Stripe(...)` immédiat : `next build`
// importe toutes les routes (y compris dynamiques) pour en analyser
// les exports, sans forcément exécuter leur code — mais un throw au
// niveau du module, lui, s'exécute dès l'import et fait échouer le
// build entier si la variable n'est pas disponible à cette étape (elle
// peut très bien ne l'être qu'à l'exécution selon l'hébergeur). Avec
// le Proxy, la vérification n'a lieu qu'au premier accès réel, au
// moment d'une requête — chaque appelant garde la même syntaxe
// (`stripe.checkout...`), sans rien changer de son côté.
export const stripe = new Proxy({} as Stripe, {
  get(_cible, propriete, receveur) {
    return Reflect.get(obtenirInstance(), propriete, receveur);
  },
});
