import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AboutSection } from "@/components/home/AboutSection";

export const metadata: Metadata = {
  title: "À propos — Deo Création",
  description: "Notre exigence de qualité : papier premium, tirages d'exception.",
};

export default function AProposPage() {
  return (
    <div className="flex flex-1 flex-col bg-fond text-encre">
      <Header />
      <main className="flex-1">
        <AboutSection />
      </main>
      <Footer />
    </div>
  );
}
