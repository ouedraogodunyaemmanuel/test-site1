import Link from "next/link";
import { OrderSummary } from "@/components/checkout/OrderSummary";

export default function PageRecapitulatif() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16 sm:px-10">
      <Link
        href="/commande/livraison"
        className="text-sm text-stone-500 transition-colors hover:text-stone-900"
      >
        ← Modifier mes informations
      </Link>
      <h1 className="mt-6 font-serif text-3xl text-stone-900">
        Récapitulatif de votre commande
      </h1>
      <OrderSummary />
    </div>
  );
}
