"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Print } from "@/types/print";
import type { CategoryFilter } from "@/types/CategoryFilter";
import { FILTRES, TIRAGES } from "@/data/prints";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { GallerySection } from "@/components/home/GallerySection";
import { AboutSection } from "@/components/home/AboutSection";
import { ContactSection } from "@/components/home/ContactSection";
import { PrintDetailModal } from "@/components/print/PrintDetailModal";

// Isolé dans son propre composant car `useSearchParams()` exige une
// limite <Suspense> autour de lui (sans quoi Next.js échoue au
// build/prerendering) — voir son usage dans Home ci-dessous.
function TiragePreselectionne({
  onTirageTrouve,
}: {
  onTirageTrouve: (tirage: Print) => void;
}) {
  // Permet au portfolio d'ouvrir directement une fiche
  // (/?tirage=3). Voir PortfolioGrid.tsx.
  const parametres = useSearchParams();
  const idDemande = parametres.get("tirage");

  useEffect(() => {
    if (!idDemande) return;
    const trouve = TIRAGES.find((tirage) => String(tirage.id) === idDemande);
    if (trouve) onTirageTrouve(trouve);
  }, [idDemande, onTirageTrouve]);

  return null;
}

export default function Home() {
  const [categorieActive, setCategorieActive] = useState<CategoryFilter>("tous");
  const [tirageOuvert, setTirageOuvert] = useState<Print | null>(null);

  const tiragesAffiches =
    categorieActive === "tous"
      ? TIRAGES
      : TIRAGES.filter((tirage) => tirage.category === categorieActive);

  return (
    <div className="flex flex-1 flex-col bg-fond font-sans text-encre">
      <Suspense fallback={null}>
        <TiragePreselectionne onTirageTrouve={setTirageOuvert} />
      </Suspense>
      <Header />
      <HeroSection />
      <GallerySection
        filtres={FILTRES}
        categorieActive={categorieActive}
        onChangementCategorie={setCategorieActive}
        tirages={tiragesAffiches}
        onOuvrirTirage={setTirageOuvert}
      />
      <AboutSection />
      <ContactSection />
      <Footer />
      {tirageOuvert && (
        <PrintDetailModal
          tirage={tirageOuvert}
          onFermer={() => setTirageOuvert(null)}
        />
      )}
    </div>
  );
}
