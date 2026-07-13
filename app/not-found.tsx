import Link from "next/link";

// Shown automatically by Next.js for any URL that doesn't match a
// route (a real 404), or when a page explicitly calls notFound().
export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="font-serif text-3xl text-stone-900">Page introuvable</h1>
      <p className="text-stone-600">
        La page que vous recherchez n&apos;existe pas ou a été déplacée.
      </p>
      <Link
        href="/"
        className="mt-4 border border-stone-300 px-6 py-3 text-sm tracking-wide text-stone-600 transition hover:border-stone-900 hover:text-stone-900 active:scale-[0.97]"
      >
        Retour à la boutique
      </Link>
    </div>
  );
}
