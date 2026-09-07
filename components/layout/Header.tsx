"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/components/cart/CartContext";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

const LIENS_NAV = [
  { href: "/#gallery", label: "Collection" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/#about", label: "À propos" },
  { href: "/#contact", label: "Contact" },
];

export function Header() {
  const [menuOuvert, setMenuOuvert] = useState(false);
  const { openCart, itemCount } = useCart();

  useEffect(() => {
    if (!menuOuvert) return;
    function gererTouche(evenement: KeyboardEvent) {
      if (evenement.key === "Escape") setMenuOuvert(false);
    }
    window.addEventListener("keydown", gererTouche);
    return () => window.removeEventListener("keydown", gererTouche);
  }, [menuOuvert]);

  return (
    // `bg-fond-voile` : l'en-tête reste lisible par-dessus la photo du
    // hero, qui défile sous lui.
    <header className="sticky top-0 z-40 bg-[var(--fond-voile)] backdrop-blur-md">
      <div className="mx-auto grid max-w-6xl grid-cols-[1fr_auto_1fr] items-center px-6 py-5 sm:px-10">
        <div className="flex items-center">
          <nav className="hidden gap-8 text-xs tracking-[0.14em] uppercase text-attenue md:flex">
            {LIENS_NAV.map((lien) => (
              <Link
                key={lien.href}
                href={lien.href}
                className="transition-colors hover:text-encre"
              >
                {lien.label}
              </Link>
            ))}
          </nav>

          <button
            type="button"
            onClick={() => setMenuOuvert((actuel) => !actuel)}
            aria-expanded={menuOuvert}
            aria-label={menuOuvert ? "Fermer le menu" : "Ouvrir le menu"}
            className="-ml-2 flex flex-col justify-center gap-1.5 p-2 transition active:scale-90 md:hidden"
          >
            <span
              className={`h-px w-5 bg-encre transition-transform duration-200 ${
                menuOuvert ? "translate-y-[3px] rotate-45" : ""
              }`}
            />
            <span
              className={`h-px w-5 bg-encre transition-transform duration-200 ${
                menuOuvert ? "-translate-y-[3px] -rotate-45" : ""
              }`}
            />
          </button>
        </div>

        <Link
          href="/"
          className="font-serif text-sm tracking-[0.28em] text-encre sm:text-base sm:tracking-[0.34em]"
        >
          DEO CRÉATION
        </Link>

        <div className="flex items-center justify-end gap-6">
          <div className="hidden md:block">
            <ThemeToggle />
          </div>
          <button
            type="button"
            onClick={openCart}
            className="flex items-center gap-2 text-[11px] tracking-[0.12em] uppercase text-accent transition-opacity hover:opacity-80"
          >
            <span>Panier</span>
            {itemCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center bg-accent px-1 text-[10px] tracking-normal text-fond">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {menuOuvert && (
        <nav className="flex flex-col border-t border-filet bg-fond px-6 pb-6 md:hidden">
          {LIENS_NAV.map((lien) => (
            <Link
              key={lien.href}
              href={lien.href}
              onClick={() => setMenuOuvert(false)}
              className="border-b border-filet py-4 font-serif text-xl text-encre"
            >
              {lien.label}
            </Link>
          ))}
          <div className="mt-6 flex flex-col gap-2">
            <span className="text-[10px] tracking-[0.18em] uppercase text-faible">
              Thème
            </span>
            <ThemeToggle pleineLargeur />
          </div>
        </nav>
      )}
    </header>
  );
}
