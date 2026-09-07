import type { Metadata } from "next";
import { TIRAGES } from "@/data/prints";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PortfolioGrid } from "@/components/portfolio/PortfolioGrid";

export const metadata: Metadata = {
  title: "Portfolio — Deo Création",
  description: "Toutes les photographies, dans leur format d'origine.",
};

export default function PortfolioPage() {
  return (
    <div className="flex flex-1 flex-col bg-fond text-encre">
      <Header />
      <main className="w-full flex-1 px-6 pt-14 pb-20 sm:px-10 lg:px-[56px] lg:pt-[56px] lg:pb-[70px]">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-3.5">
            <span className="h-px w-9 bg-accent sm:w-10" />
            <h1 className="font-serif text-3xl text-encre sm:text-4xl">Portfolio</h1>
          </div>
          <p className="max-w-xs text-sm leading-[1.7] text-pretty text-attenue">
            Toutes les photographies, dans leur format d&apos;origine, sans recadrage.
          </p>
        </div>

        <PortfolioGrid tirages={TIRAGES} />
      </main>
      <Footer />
    </div>
  );
}
