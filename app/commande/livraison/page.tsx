import Link from "next/link";
import { DeliveryForm } from "@/components/checkout/DeliveryForm";

export default function DeliveryPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16 sm:px-10">
      <Link
        href="/"
        className="group flex items-center gap-2 text-sm text-attenue transition-colors hover:text-encre"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-fond transition group-hover:opacity-90">
          ←
        </span>
        Retour à la boutique
      </Link>
      <h1 className="mt-6 font-serif text-3xl text-encre">
        Informations de livraison
      </h1>
      <p className="mt-3 text-texte">
        Ces informations serviront uniquement à vous livrer votre commande.
      </p>
      <DeliveryForm />
    </div>
  );
}
