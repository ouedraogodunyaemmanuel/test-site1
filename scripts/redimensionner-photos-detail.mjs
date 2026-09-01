// Redimensionne en place chaque photo de tirage affichée dans la modale de
// détail (PrintDetailModal.tsx) — "aucun.jpg" (sans cadre, affichée par
// défaut) ET les variantes cadre×format (blanc/noir/cuivre × 20x30/40x60/
// 60x90) qu'on obtient en changeant les options — à une résolution
// raisonnable pour l'affichage web.
//
// Pourquoi : ces fichiers sont livrés en pleine résolution native, alors
// que la modale ne les affiche jamais au-delà d'environ 720px CSS (colonne
// à 60% d'une boîte plafonnée à max-w-7xl/max-w-4xl — des largeurs en
// pixels absolus, qui ne grandissent jamais avec l'écran). "aucun.jpg" ne
// pose plus de souci (déjà traité ici), mais les variantes cadre×format,
// elles, n'étaient jamais passées par ce script : ~1300px de large certes,
// mais 300 à 490 Ko chacune faute d'avoir été recompressées — c'est ce
// fichier-là qui se retélécharge à chaque changement d'option dans la
// modale, d'où la latence perceptible en changeant de cadre ou de format,
// surtout sur mobile.
//
// Écrase les fichiers source en place (confirmé web-only, aucun fichier
// maître d'impression stocké ici — Git garde l'historique si besoin de
// revenir en arrière). Doit tourner AVANT calculer-ratios.mjs et
// generer-vignettes.mjs, qui lisent ensuite "aucun.jpg" (voir predev/
// prebuild dans package.json).
//
// Run automatically before "npm run dev" and "npm run build" — no need to
// run it by hand, except to force an immediate update after replacing a
// photo.

import { readdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const DOSSIER_TIRAGES = path.join(process.cwd(), "public", "images", "tirages");
const DIMENSION_MAXIMALE = 1300; // px — marge retina pour l'affichage réel dans la modale
const QUALITE = 85;

async function redimensionnerPhotosDetail() {
  const entrees = await readdir(DOSSIER_TIRAGES, { withFileTypes: true });
  const dossiers = entrees.filter((entree) => entree.isDirectory());

  let redimensionne = 0;
  for (const dossier of dossiers) {
    const cheminDossier = path.join(DOSSIER_TIRAGES, dossier.name);
    const fichiers = await readdir(cheminDossier);
    // Toutes les photos affichées dans la modale de détail : "aucun.jpg"
    // et les variantes cadre×format. Exclut "aucun-vignette.jpg", générée
    // séparément par generer-vignettes.mjs à partir d'"aucun.jpg" une fois
    // celui-ci redimensionné ici.
    const photosDetail = fichiers.filter(
      (fichier) => fichier.endsWith(".jpg") && !fichier.includes("vignette"),
    );

    for (const fichier of photosDetail) {
      const cheminSource = path.join(cheminDossier, fichier);

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
          `⚠️  redimensionner-photos-detail: "${dossier.name}/${fichier}" ignoré (${erreur.message}).`
        );
      }
    }
  }

  console.log(`✓ redimensionner-photos-detail: ${redimensionne} photo(s) redimensionnée(s)`);
}

redimensionnerPhotosDetail();
