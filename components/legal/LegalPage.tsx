import Link from "next/link";
import type { ReactNode } from "react";

// Shared layout for legal pages (terms of sale, privacy policy), so
// the title + back-link structure isn't duplicated on every page.
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
        className="text-sm text-attenue transition-colors hover:text-encre"
      >
        ← Retour à la boutique
      </Link>
      <h1 className="mt-6 font-serif text-3xl text-encre">{title}</h1>
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
      <h2 className="font-serif text-xl text-encre">{title}</h2>
      <div className="mt-3 space-y-3 text-texte leading-relaxed">
        {children}
      </div>
    </section>
  );
}
