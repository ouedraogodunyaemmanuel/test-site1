export function Footer() {
  return (
    <footer id="footer" className="border-t border-stone-200">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 py-10 text-sm text-stone-500 sm:flex-row sm:justify-between sm:px-10">
        <span className="font-serif tracking-[0.2em] text-stone-700">DEO CREATION</span>
        <span>© {new Date().getFullYear()} Deo Création. Tous droits réservés.</span>
      </div>
    </footer>
  );
}
