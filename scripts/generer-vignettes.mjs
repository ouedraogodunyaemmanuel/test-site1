// Generates a small "aucun-vignette.jpg" next to each print's
// "aucun.jpg", for the gallery grid (see lib/images.ts,
// obtenirUrlVignetteTirage).
//
// Why a separate file instead of resizing on the fly: the gallery and
// the detail modal display the same "aucun.jpg" photo at very
// different sizes (a few hundred px vs. up to 60% of the viewport).
// Serving both from Next.js's on-demand image optimizer means a first
// visit at a size that hasn't been requested yet (or one whose cache
// entry expired from low traffic) pays for a real-time resize on the
// server before the photo shows up. Pre-generating a fixed small file
// and serving it — and the detail photo — unoptimized (see
// PrintCard.tsx, PrintDetailModal.tsx) removes that on-demand step
// entirely: both are then just static files, load-tested and
// identically fast in dev and in production.
//
// Run automatically before "npm run dev" and "npm run build" (see the
// "predev"/"prebuild" scripts in package.json) — no need to run it by
// hand, except to force an immediate update after replacing a photo.

import { readdir, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const DOSSIER_TIRAGES = path.join(process.cwd(), "public", "images", "tirages");
const DIMENSION_MAXIMALE = 1000; // px — large marge retina pour la taille réelle en grille
const QUALITE = 82;

async function genererVignettes() {
  const entrees = await readdir(DOSSIER_TIRAGES, { withFileTypes: true });
  const dossiers = entrees.filter((entree) => entree.isDirectory());

  let genere = 0;
  for (const dossier of dossiers) {
    const cheminSource = path.join(DOSSIER_TIRAGES, dossier.name, "aucun.jpg");
    const cheminVignette = path.join(DOSSIER_TIRAGES, dossier.name, "aucun-vignette.jpg");

    try {
      const [metaSource, metaVignette] = await Promise.all([
        stat(cheminSource),
        stat(cheminVignette).catch(() => null),
      ]);
      // Ne régénère que si la vignette n'existe pas encore ou si la
      // photo source a été remplacée depuis (évite de retraiter les
      // 7 photos à chaque "npm run dev").
      if (metaVignette && metaVignette.mtimeMs >= metaSource.mtimeMs) {
        continue;
      }

      const image = sharp(cheminSource);
      const { width, height } = await image.metadata();
      if (!width || !height) {
        throw new Error("unknown dimensions");
      }

      const buffer = await image
        .resize({
          width: width >= height ? DIMENSION_MAXIMALE : undefined,
          height: height > width ? DIMENSION_MAXIMALE : undefined,
          withoutEnlargement: true,
        })
        .jpeg({ quality: QUALITE, mozjpeg: true })
        .toBuffer();

      await sharp(buffer).toFile(cheminVignette);
      genere += 1;
    } catch (erreur) {
      console.warn(
        `⚠️  generer-vignettes: no valid "aucun.jpg" in "${dossier.name}" (${erreur.message}), skipped.`
      );
    }
  }

  console.log(`✓ generer-vignettes: ${genere} vignette(s) régénérée(s)`);
}

genererVignettes();
