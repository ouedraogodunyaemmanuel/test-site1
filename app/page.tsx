"use client";

import { useState } from "react";
import type { CategoryFilter, Print } from "@/types/print";
import { FILTERS, PRINTS } from "@/data/prints";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { GallerySection } from "@/components/home/GallerySection";
import { AboutSection } from "@/components/home/AboutSection";
import { PrintDetailModal } from "@/components/print/PrintDetailModal";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("all");
  const [openPrint, setOpenPrint] = useState<Print | null>(null);

  const displayedPrints =
    activeCategory === "all"
      ? PRINTS
      : PRINTS.filter((print) => print.category === activeCategory);

  return (
    <div className="flex flex-1 flex-col bg-stone-50 font-sans text-stone-900">
      <Header />
      <HeroSection />
      <GallerySection
        filters={FILTERS}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        prints={displayedPrints}
        onOpenPrint={setOpenPrint}
      />
      <AboutSection />
      <Footer />
      {openPrint && (
        <PrintDetailModal
          print={openPrint}
          onClose={() => setOpenPrint(null)}
        />
      )}
    </div>
  );
}
