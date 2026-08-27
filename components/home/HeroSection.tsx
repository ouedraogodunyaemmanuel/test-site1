"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";

// Only replays the aperture-opening entrance once per browser session
// (see the effects below) — without this, it would fire again every
// time the visitor comes back to the homepage in the same tab, which
// gets old fast. A hard page reload (F5) is treated as a fresh session
// on purpose, so the entrance always plays again there.
const SESSION_KEY = "hero-reveal-played";

// True only for an actual browser reload (F5, refresh button), not for
// a client-side route change — that distinction lives in the Navigation
// Timing API's `type` field.
function isHardPageReload(): boolean {
  if (typeof window === "undefined" || !window.performance) return false;
  const [navigationEntry] = window.performance.getEntriesByType(
    "navigation",
  ) as PerformanceNavigationTiming[];
  return navigationEntry?.type === "reload";
}

function alreadyPlayedThisSession(): boolean {
  if (typeof window === "undefined") return false;
  if (isHardPageReload()) {
    window.sessionStorage.removeItem(SESSION_KEY);
    return false;
  }
  return window.sessionStorage.getItem(SESSION_KEY) !== null;
}

// Class removed from an entrance-animated element to skip straight to
// its settled state, plus its `animation-delay` (only meaningful while
// the animation classes are present, but harmless to clear too).
function skipToSettled(element: HTMLElement | null, closedClass: string) {
  if (!element) return;
  element.classList.remove(closedClass, "hero-aperture-open", "hero-content-enter");
  element.style.animationDelay = "";
}

export function HeroSection() {
  const photoRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  // Set synchronously from sessionStorage on the very first render (not
  // in an effect) so it's already correct by the time onLoad below can
  // fire — reading it here only feeds a ref, never changes what gets
  // rendered, so it can't cause a hydration mismatch.
  const revealedRef = useRef(alreadyPlayedThisSession());

  // Covers the repeat-session case: the markup always starts in its
  // "closed"/pending state (so server and first client render agree —
  // no hydration mismatch), and this effect fixes it up to the settled
  // state directly via refs, before the browser paints, if this session
  // has already played the entrance once. No animation, no flash.
  useLayoutEffect(() => {
    if (!revealedRef.current) return;
    skipToSettled(photoRef.current, "hero-aperture-closed");
    skipToSettled(titleRef.current, "hero-text-pending");
    skipToSettled(subtitleRef.current, "hero-text-pending");
    skipToSettled(ctaRef.current, "hero-text-pending");
  }, []);

  // Triggered by the hero photo's own `onLoad`, not by mount: the
  // photo is a large, unoptimized file (see the comment below), so
  // starting the "aperture" reveal on a fixed timer could open onto a
  // still-blank image on a slow connection. Waiting for the real photo
  // to be ready means the reveal always uncovers something real.
  function handlePhotoLoaded() {
    if (revealedRef.current) return;
    revealedRef.current = true;
    window.sessionStorage.setItem(SESSION_KEY, "1");

    photoRef.current?.classList.replace("hero-aperture-closed", "hero-aperture-open");
    for (const el of [titleRef.current, subtitleRef.current, ctaRef.current]) {
      el?.classList.replace("hero-text-pending", "hero-content-enter");
    }
  }

  return (
    <section className="relative flex h-[85vh] min-h-[520px] items-end overflow-hidden bg-white">
      <div ref={photoRef} className="absolute inset-0 hero-aperture-closed">
        <Image
          src="/images/HeroSection/hero-section.jpg"
          alt="Paysage mis en avant"
          fill
          priority
          // Serves the original file as-is, bypassing Next.js's image
          // optimizer (which resizes and recompresses by default — that
          // was causing the quality loss). Deliberate: this is the only
          // photo on the site shown this large, so the original file's
          // weight (~5.4 MB) stays acceptable.
          unoptimized
          onLoad={handlePhotoLoaded}
          className="object-cover"
        />
      </div>
      {/* Dark overlay to keep the text readable regardless of the photo */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />
      <div className="relative mx-auto w-full max-w-6xl px-6 pb-16 sm:px-10 sm:pb-24">
        <h1
          ref={titleRef}
          className="hero-text-pending max-w-xl font-serif text-4xl leading-tight text-stone-50 sm:text-5xl"
          style={{ animationDelay: "150ms" }}
        >
          Des paysages intemporels, tirés avec exigence.
        </h1>
        <p
          ref={subtitleRef}
          className="hero-text-pending mt-4 max-w-md text-stone-200"
          style={{ animationDelay: "300ms" }}
        >
          Éditions limitées, impression premium sur papier laminé de haute qualité.
        </p>
        <a
          ref={ctaRef}
          href="#gallery"
          className="hero-text-pending mt-8 inline-flex items-center gap-2 border border-stone-50 px-6 py-3 text-sm tracking-wide text-stone-50 transition hover:bg-stone-50 hover:text-stone-900 active:scale-[0.93]"
          style={{ animationDelay: "450ms" }}
        >
          Découvrir la collection
        </a>
      </div>
    </section>
  );
}
