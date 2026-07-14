import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Les tirages sont des photos figées (uploadées à la main, jamais
    // remplacées dynamiquement) : sans ce réglage, Next.js retraite
    // l'image depuis le fichier source dès que le cache expire (~1 minute
    // par défaut), ce qui provoquait la latence perçue à chaque
    // cache-miss. Un an de cache est sûr ici justement parce que rien ne
    // change ces fichiers en place.
    minimumCacheTTL: 31536000,
  },
  // Les photos de tirages (public/images/tirages) sont maintenant
  // servies telles quelles (voir `unoptimized` dans PrintCard.tsx et
  // PrintDetailModal.tsx) : ce sont de simples fichiers statiques, pas
  // des requêtes à l'optimiseur d'images, donc `images.minimumCacheTTL`
  // ci-dessus ne s'applique pas à elles. Sans cet en-tête, le fichier
  // ne serait pas mis en cache long par le navigateur — même règle que
  // ci-dessus : ces photos ne changent jamais en place.
  async headers() {
    return [
      {
        source: "/images/tirages/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;
