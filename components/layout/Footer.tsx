import Link from "next/link";

const LIENS_LEGAUX = [
  { href: "/conditions-generales-de-vente", label: "Conditions générales de vente" },
  { href: "/politique-de-confidentialite", label: "Politique de confidentialité" },
];

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-filet bg-fond">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 px-6 py-10 sm:px-10 lg:flex-row lg:items-start lg:justify-between">
        <span className="font-serif text-sm tracking-[0.3em] text-attenue">
          DEO CRÉATION
        </span>

        <div className="flex flex-col gap-2.5">
          {LIENS_LEGAUX.map((lien) => (
            <Link
              key={lien.href}
              href={lien.href}
              className="text-sm text-faible transition-colors hover:text-encre"
            >
              {lien.label}
            </Link>
          ))}
        </div>

        <span className="text-xs text-faible">
          © {new Date().getFullYear()} Deo Création. Tous droits réservés.
        </span>
      </div>
    </footer>
  );
}
