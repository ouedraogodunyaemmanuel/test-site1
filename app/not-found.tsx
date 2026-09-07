import Link from "next/link";

// Shown automatically by Next.js for any URL that doesn't match a
// route (a real 404), or when a page explicitly calls notFound().
export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="font-serif text-3xl text-encre">Page introuvable</h1>
      <p className="text-texte">
        La page que vous recherchez n&apos;existe pas ou a été déplacée.
      </p>
      <Link
        href="/"
        className="mt-4 border border-filet px-6 py-3 text-sm tracking-wide text-attenue transition hover:border-filet-fort hover:text-encre active:scale-[0.93]"
      >
        Retour à la boutique
      </Link>
    </div>
  );
}
