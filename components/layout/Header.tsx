export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/70 bg-stone-50/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 sm:px-10">
        <span className="font-serif text-xl tracking-[0.2em] text-stone-900">
          DEO CREATION
        </span>
        <nav className="hidden gap-8 text-sm text-stone-600 sm:flex">
          <a href="#gallery" className="transition-colors hover:text-stone-900">
            Collection
          </a>
          <a href="#about" className="transition-colors hover:text-stone-900">
            À propos
          </a>
          <a href="#footer" className="transition-colors hover:text-stone-900">
            Contact
          </a>
        </nav>
      </div>
    </header>
  );
}
