import Link from "next/link";

export function Footer() {
  return (
    <footer id="footer" className="border-t border-stone-200">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 py-10 text-sm text-stone-500 sm:flex-row sm:justify-between sm:px-10">
        <span className="font-serif tracking-[0.2em] text-stone-700">DEO CREATION</span>
        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          <Link
            href="/conditions-generales-de-vente"
            className="transition-colors hover:text-stone-900"
          >
            Conditions générales de vente
          </Link>
          <Link
            href="/politique-de-confidentialite"
            className="transition-colors hover:text-stone-900"
          >
            Politique de confidentialité
          </Link>
        </nav>
        <span>© {new Date().getFullYear()} Deo Création. Tous droits réservés.</span>
      </div>
    </footer>
  );
}
