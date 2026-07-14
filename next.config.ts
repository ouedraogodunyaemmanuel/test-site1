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
};

export default nextConfig;
