import Link from "next/link";
import { OrderSummary } from "@/components/checkout/OrderSummary";

export default function PageRecapitulatif() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16 sm:px-10">
      <Link
        href="/commande/livraison"
        className="text-sm text-attenue transition-colors hover:text-encre"
      >
        ← Modifier mes informations
      </Link>
      <h1 className="mt-6 font-serif text-3xl text-encre">
        Récapitulatif de votre commande
      </h1>
      <OrderSummary />
    </div>
  );
}
