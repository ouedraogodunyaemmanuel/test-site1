import { PrintImage } from "@/components/shared/PrintImage";

const CHIFFRES = [
  { valeur: "250", legende: "g/m² HP" },
  { valeur: "3", legende: "formats" },
  { valeur: "5–7", legende: "jours" },
];

export function AboutSection() {
  return (
    // Photo pleine largeur puis texte sur mobile, deux colonnes sur
    // desktop : À propos et Contact ne se ressemblent plus (ils
    // étaient deux blocs centrés identiques l'un après l'autre).
    <section
      id="about"
      className="relative z-10 flex flex-col border-t border-filet bg-fond lg:h-[480px] lg:flex-row"
    >
      <div className="relative h-72 shrink-0 overflow-hidden lg:h-full lg:w-[620px]">
        <PrintImage
          src="/images/tirages/vertige/aucun.jpg"
          alt=""
          sizes="(min-width: 1024px) 620px, 100vw"
          dimensionnement="rempli"
        />
        {/* Fondu vers la page : vers le bas sur mobile, vers la droite
            sur desktop. */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--fond)] from-[2%] to-transparent to-60% lg:bg-gradient-to-r lg:from-transparent lg:from-55% lg:to-[var(--fond)]" />
      </div>

      <div className="flex flex-1 flex-col gap-5 px-6 pt-2 pb-12 sm:px-10 lg:px-14 lg:pt-[76px]">
        <span className="h-px w-9 bg-accent sm:w-10" />
        <h2 className="font-serif text-3xl leading-[1.16] text-encre sm:text-4xl">
          Une exigence de qualité
        </h2>
        <p className="leading-[1.8] text-pretty text-texte">
          Chaque tirage est réalisé avec soin sur un papier premium HP 250&nbsp;g/m²,
          traité pour le protéger durablement de l&apos;humidité, de la lumière et des
          rayures. Un tirage d&apos;exception, fait pour sublimer votre intérieur sans
          jamais faiblir.
        </p>
        {/* Ce second paragraphe était collé au précédent : un double
            saut de ligne dans le JSX ne crée pas de paragraphe. */}
        <p className="leading-[1.8] text-pretty text-texte">
          Une manière intemporelle de faire entrer un paysage chez soi.
        </p>

        <div className="mt-2 grid grid-cols-3 gap-px bg-filet">
          {CHIFFRES.map((chiffre) => (
            <div
              key={chiffre.legende}
              className="flex flex-col gap-1.5 bg-fond py-4 pr-4"
            >
              <span className="font-serif text-xl text-encre sm:text-2xl">
                {chiffre.valeur}
              </span>
              <span className="text-[10px] tracking-[0.14em] uppercase text-faible">
                {chiffre.legende}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
