// Redimensionne en place chaque "aucun.jpg" (photo "sans cadre", affichée
// par défaut à l'ouverture de la modale de détail — voir
// PrintDetailModal.tsx et CADRES[0] dans data/options.ts) à une résolution
// raisonnable pour l'affichage web.
//
// Pourquoi : ces fichiers sont livrés en pleine résolution native (jusqu'à
// 3600x2400 px, ~2 Mo), alors que la modale ne les affiche jamais au-delà
// d'environ 720px CSS (colonne à 60% d'une boîte plafonnée à max-w-7xl/
// max-w-4xl — des largeurs en pixels absolus, qui ne grandissent jamais
// avec l'écran). Sans ce script, c'est la toute première photo que voit
// chaque visiteur en ouvrant la modale qui reste la plus lente à charger.
//
// Écrase le fichier source en place (confirmé web-only, aucun fichier
// maître d'impression stocké ici — Git garde l'historique si besoin de
// revenir en arrière). Doit tourner AVANT calculer-ratios.mjs et
// generer-vignettes.mjs, qui lisent ensuite ce même fichier (voir
// predev/prebuild dans package.json).
//
// Run automatically before "npm run dev" and "npm run build" — no need to
// run it by hand, except to force an immediate update after replacing a
// photo.

import { readdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const DOSSIER_TIRAGES = path.join(process.cwd(), "public", "images", "tirages");
const DIMENSION_MAXIMALE = 1600; // px — marge retina pour l'affichage réel dans la modale
const QUALITE = 85;

async function redimensionnerPhotosDetail() {
  const entrees = await readdir(DOSSIER_TIRAGES, { withFileTypes: true });
  const dossiers = entrees.filter((entree) => entree.isDirectory());

  let redimensionne = 0;
  for (const dossier of dossiers) {
    const cheminSource = path.join(DOSSIER_TIRAGES, dossier.name, "aucun.jpg");

    try {
      const { width, height } = await sharp(cheminSource).metadata();
      if (!width || !height) {
        throw new Error("unknown dimensions");
      }

      // Idempotent par dimension (pas par date de modification) : le
      // fichier de sortie est le fichier source lui-même, il n'y a donc
      // rien d'autre à comparer. Sans ce garde-fou, chaque "npm run dev"
      // recompresserait — et donc dégraderait un peu plus — un fichier
      // déjà correctement redimensionné.
      if (Math.max(width, height) <= DIMENSION_MAXIMALE) {
        continue;
      }

      const buffer = await sharp(cheminSource)
        .resize({
          width: width >= height ? DIMENSION_MAXIMALE : undefined,
          height: height > width ? DIMENSION_MAXIMALE : undefined,
          withoutEnlargement: true,
        })
        .jpeg({ quality: QUALITE, mozjpeg: true })
        .toBuffer();

      // sharp ne peut pas lire et écrire le même fichier directement,
      // d'où ce passage par un buffer intermédiaire (même idiome que
      // generer-vignettes.mjs).
      await sharp(buffer).toFile(cheminSource);
      redimensionne += 1;
    } catch (erreur) {
      console.warn(
        `⚠️  redimensionner-photos-detail: no valid "aucun.jpg" in "${dossier.name}" (${erreur.message}), skipped.`
      );
    }
  }

  console.log(`✓ redimensionner-photos-detail: ${redimensionne} photo(s) redimensionnée(s)`);
}

redimensionnerPhotosDetail();
