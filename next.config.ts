import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Autorise next/image à charger et optimiser les photos hébergées sur Unsplash.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
