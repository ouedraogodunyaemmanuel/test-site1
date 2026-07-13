import Image from "next/image";

export function HeroSection() {
  return (
    <section className="relative flex h-[85vh] min-h-[520px] items-end overflow-hidden">
      {/* Drop your main photo in /public/images/hero.jpg */}
      <Image
        src="/images/hero.jpg"
        alt="Paysage mis en avant"
        fill
        priority
        className="object-cover"
      />
      {/* Dark overlay to keep the text readable regardless of the photo */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />
      <div className="relative mx-auto w-full max-w-6xl px-6 pb-16 sm:px-10 sm:pb-24">
        <h1 className="max-w-xl font-serif text-4xl leading-tight text-stone-50 sm:text-5xl">
          Des paysages intemporels, tirés avec exigence.
        </h1>
        <p className="mt-4 max-w-md text-stone-200">
          Éditions limitées, impression premium sur papier laminé de haute qualité.
        </p>
        <a
          href="#gallery"
          className="mt-8 inline-flex items-center gap-2 border border-stone-50 px-6 py-3 text-sm tracking-wide text-stone-50 transition hover:bg-stone-50 hover:text-stone-900 active:scale-[0.97]"
        >
          Découvrir la collection
        </a>
      </div>
    </section>
  );
}
