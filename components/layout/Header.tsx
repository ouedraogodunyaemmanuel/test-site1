"use client";

import { useEffect, useState } from "react";

const LIENS_NAV = [
  { href: "#gallery", label: "Collection" },
  { href: "#about", label: "À propos" },
  { href: "#contact", label: "Contact" },
];

export function Header() {
  const [menuOuvert, setMenuOuvert] = useState(false);

  // Closes the mobile menu with the Escape key, like the rest of the
  // site's panels (see CartDrawer, PrintDetailModal).
  useEffect(() => {
    if (!menuOuvert) return;
    function gererTouche(evenement: KeyboardEvent) {
      if (evenement.key === "Escape") {
        setMenuOuvert(false);
      }
    }
    window.addEventListener("keydown", gererTouche);
    return () => window.removeEventListener("keydown", gererTouche);
  }, [menuOuvert]);

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/70 bg-stone-50/80 backdrop-blur-md">
      <div
        // The right padding is deliberately wider than the left one:
        // it reserves space for the cart button (CartButton), which
        // is `fixed`-positioned on top of the whole site, including
        // this header — without this margin, the nav links or the
        // menu button would end up hidden behind it.
        className="mx-auto flex max-w-6xl items-center justify-between py-5 pl-6 pr-20 sm:pl-10 sm:pr-36"
      >
        <span className="font-serif text-lg tracking-[0.15em] text-stone-900 sm:text-xl sm:tracking-[0.2em]">
          DEO CREATION
        </span>

        <nav className="hidden gap-8 text-sm text-stone-600 md:flex">
          {LIENS_NAV.map((lien) => (
            <a
              key={lien.href}
              href={lien.href}
              className="transition-colors hover:text-stone-900"
            >
              {lien.label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setMenuOuvert((current) => !current)}
          aria-expanded={menuOuvert}
          aria-label={menuOuvert ? "Fermer le menu" : "Ouvrir le menu"}
          className="flex flex-col items-center justify-center gap-1.5 p-2 transition active:scale-85 md:hidden"
        >
          <span
            className={`h-px w-6 bg-stone-900 transition-transform duration-200 ${
              menuOuvert ? "translate-y-[7px] rotate-45" : ""
            }`}
          />
          <span
            className={`h-px w-6 bg-stone-900 transition-opacity duration-200 ${
              menuOuvert ? "opacity-0" : ""
            }`}
          />
          <span
            className={`h-px w-6 bg-stone-900 transition-transform duration-200 ${
              menuOuvert ? "-translate-y-[7px] -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      {menuOuvert && (
        <nav className="flex flex-col gap-1 border-t border-stone-200/70 bg-stone-50 px-6 py-4 text-sm text-stone-600 md:hidden">
          {LIENS_NAV.map((lien) => (
            <a
              key={lien.href}
              href={lien.href}
              onClick={() => setMenuOuvert(false)}
              className="rounded px-2 py-2 transition-colors hover:bg-stone-100 hover:text-stone-900"
            >
              {lien.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
