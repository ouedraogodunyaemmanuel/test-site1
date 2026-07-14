import Link from "next/link";
import { DeliveryForm } from "@/components/checkout/DeliveryForm";

export default function DeliveryPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16 sm:px-10">
      <Link
        href="/"
        className="group flex items-center gap-2 text-sm text-stone-500 transition-colors hover:text-stone-900"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-900 text-stone-50 transition group-hover:bg-stone-700">
          ←
        </span>
        Retour à la boutique
      </Link>
      <h1 className="mt-6 font-serif text-3xl text-stone-900">
        Informations de livraison
      </h1>
      <p className="mt-3 text-stone-600">
        Ces informations serviront uniquement à vous livrer votre commande.
      </p>
      <DeliveryForm />
    </div>
  );
}
