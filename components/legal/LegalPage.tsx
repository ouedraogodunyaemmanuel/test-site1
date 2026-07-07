import Link from "next/link";
import type { ReactNode } from "react";

// Mise en page commune aux pages légales (CGV, confidentialité), pour ne
// pas dupliquer la structure de titre + lien retour dans chaque page.
export function LegalPage({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 sm:px-10">
      <Link
        href="/"
        className="text-sm text-stone-500 transition-colors hover:text-stone-900"
      >
        ← Retour à la boutique
      </Link>
      <h1 className="mt-6 font-serif text-3xl text-stone-900">{title}</h1>
      <div className="mt-8 space-y-8">{children}</div>
    </div>
  );
}

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h2 className="font-serif text-xl text-stone-900">{title}</h2>
      <div className="mt-3 space-y-3 text-stone-600 leading-relaxed">
        {children}
      </div>
    </section>
  );
}
