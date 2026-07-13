"use client";

import { useEffect } from "react";
import Link from "next/link";

// Next.js wraps the whole app in an error boundary that renders this
// component whenever a page throws during rendering. Must be a client
// component: error boundaries only work on the client. `reset()` lets
// the customer retry without a full page reload.
export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // A real project would send this to an error-tracking service
    // (Sentry, etc.) instead of just logging it.
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="font-serif text-3xl text-stone-900">Une erreur est survenue</h1>
      <p className="text-stone-600">
        Quelque chose s&apos;est mal passé. Vous pouvez réessayer, ou revenir à
        l&apos;accueil.
      </p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={reset}
          className="bg-stone-900 px-6 py-3 text-sm tracking-wide text-stone-50 transition hover:bg-stone-700 active:scale-[0.97]"
        >
          Réessayer
        </button>
        <Link
          href="/"
          className="border border-stone-300 px-6 py-3 text-sm tracking-wide text-stone-600 transition hover:border-stone-900 hover:text-stone-900 active:scale-[0.97]"
        >
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}
