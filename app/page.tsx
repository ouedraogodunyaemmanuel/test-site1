"use client";

import { useState } from "react";
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

export default function Home() {
  const [categorieActive, setCategorieActive] = useState<CategoryFilter>("tous");
  const [tirageOuvert, setTirageOuvert] = useState<Print | null>(null);

  const tiragesAffiches =
    categorieActive === "tous"
      ? TIRAGES
      : TIRAGES.filter((tirage) => tirage.category === categorieActive);

  return (
    <div className="flex flex-1 flex-col bg-stone-50 font-sans text-stone-900">
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
