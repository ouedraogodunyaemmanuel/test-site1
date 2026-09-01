export function HeroSection() {
  return (
    <section className="relative flex h-[85vh] min-h-[520px] items-end overflow-hidden bg-white">
      <div className="absolute inset-0">
        {/* Plain <picture>, not next/image: the desktop file is already
            served as-is (see hero-section-mobile.jpg's own comment in
            scripts/generer-hero-mobile.mjs for why), and next/image has
            no built-in way to swap to a different *file* by screen size
            — only to different resolutions of the same one. The browser
            picks a source by evaluating `media` before downloading
            anything, so a phone never fetches the ~5 MB desktop photo. */}
        <picture>
          <source
            media="(max-width: 640px)"
            srcSet="/images/HeroSection/hero-section-mobile.jpg"
          />
          <img
            src="/images/HeroSection/hero-section.jpg"
            alt="Paysage mis en avant"
            // Signals to the browser that this is a high-priority
            // resource to fetch early — the equivalent of next/image's
            // `priority` prop, which isn't available here since this
            // isn't a next/image <Image>.
            fetchPriority="high"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </picture>
      </div>
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
          className="mt-8 inline-flex items-center gap-2 border border-stone-50 px-6 py-3 text-sm tracking-wide text-stone-50 transition hover:bg-stone-50 hover:text-stone-900 active:scale-[0.93]"
        >
          Découvrir la collection
        </a>
      </div>
    </section>
  );
}
