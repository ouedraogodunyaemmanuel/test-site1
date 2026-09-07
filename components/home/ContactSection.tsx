const ADRESSE_EMAIL = "ouedraogodunya@gmail.com";

const COORDONNEES = [
  { label: "Délai de réponse", valeur: "24 à 48 heures" },
  { label: "Atelier", valeur: "Suisse" },
];

export function ContactSection() {
  return (
    // Liste de coordonnées, pas un second bloc centré : la section se
    // distingue d'À propos au premier regard.
    <section
      id="contact"
      className="relative z-10 flex flex-col border-t border-filet bg-fond lg:flex-row"
    >
      <div className="flex flex-1 flex-col gap-4 px-6 py-14 sm:px-10 lg:border-r lg:border-filet lg:px-14">
        <h2 className="font-serif text-3xl text-encre">Contact</h2>
        <p className="max-w-md leading-[1.75] text-pretty text-texte">
          Un tirage, une commande ou un projet sur mesure ? Écrivez-nous directement —
          nous répondons personnellement à chaque demande.
        </p>

        <div className="mt-4 border-t border-filet lg:hidden">
          <div className="flex flex-col gap-1.5 border-b border-filet py-5">
            <span className="text-[10px] tracking-[0.18em] uppercase text-faible">
              E-mail
            </span>
            <a href={`mailto:${ADRESSE_EMAIL}`} className="text-accent-clair">
              {ADRESSE_EMAIL}
            </a>
          </div>
          {COORDONNEES.map((ligne) => (
            <div
              key={ligne.label}
              className="flex flex-col gap-1.5 border-b border-filet py-5"
            >
              <span className="text-[10px] tracking-[0.18em] uppercase text-faible">
                {ligne.label}
              </span>
              <span className="text-encre">{ligne.valeur}</span>
            </div>
          ))}
        </div>

        <a
          href={`mailto:${ADRESSE_EMAIL}`}
          className="mt-6 flex h-13 items-center justify-center border border-accent px-8 text-xs tracking-[0.16em] uppercase text-accent-clair transition-colors hover:bg-accent hover:text-fond lg:mt-2 lg:self-start lg:tracking-[0.1em] lg:normal-case"
        >
          <span className="lg:hidden">Écrire un message</span>
          <span className="hidden lg:inline">{ADRESSE_EMAIL}</span>
        </a>
      </div>

      <div className="hidden shrink-0 flex-col gap-5 px-14 py-14 lg:flex lg:w-[420px]">
        {COORDONNEES.map((ligne) => (
          <div key={ligne.label} className="flex flex-col gap-1.5">
            <span className="text-[10px] tracking-[0.18em] uppercase text-faible">
              {ligne.label}
            </span>
            <span className="text-encre">{ligne.valeur}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
