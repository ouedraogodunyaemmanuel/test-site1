// Generates a lightweight "hero-section-mobile.jpg" next to the full-size
// hero photo, for phones (see components/home/HeroSection.tsx, which lets
// the browser pick between the two via a <picture> element).
//
// Why a separate file instead of resizing on the fly: same reasoning as
// scripts/generer-vignettes.mjs — a pre-generated static file, served
// unoptimized, is simpler and load-tested identically in dev and
// production, with no on-demand resize step on first visit.
//
// Run automatically before "npm run dev" and "npm run build" (see the
// "predev"/"prebuild" scripts in package.json) — no need to run it by
// hand, except to force an immediate update after replacing the photo.

import { stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const DOSSIER_HERO = path.join(process.cwd(), "public", "images", "HeroSection");
const CHEMIN_SOURCE = path.join(DOSSIER_HERO, "hero-section.jpg");
const CHEMIN_MOBILE = path.join(DOSSIER_HERO, "hero-section-mobile.jpg");
const LARGEUR_MOBILE = 900; // px — largement suffisant sur un écran de téléphone, y compris en Retina
const QUALITE = 82;

async function genererHeroMobile() {
  try {
    const [metaSource, metaMobile] = await Promise.all([
      stat(CHEMIN_SOURCE),
      stat(CHEMIN_MOBILE).catch(() => null),
    ]);
    // Ne régénère que si la version mobile n'existe pas encore ou si la
    // photo source a été remplacée depuis (évite de retraiter le fichier
    // à chaque "npm run dev").
    if (metaMobile && metaMobile.mtimeMs >= metaSource.mtimeMs) {
      console.log("✓ generer-hero-mobile: déjà à jour");
      return;
    }

    await sharp(CHEMIN_SOURCE)
      .resize({ width: LARGEUR_MOBILE, withoutEnlargement: true })
      .jpeg({ quality: QUALITE, mozjpeg: true })
      .toFile(CHEMIN_MOBILE);

    console.log("✓ generer-hero-mobile: hero-section-mobile.jpg régénéré");
  } catch (erreur) {
    console.warn(`⚠️  generer-hero-mobile: échec (${erreur.message}), ignoré.`);
  }
}

genererHeroMobile();
