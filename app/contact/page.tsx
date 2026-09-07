import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ContactSection } from "@/components/home/ContactSection";

export const metadata: Metadata = {
  title: "Contact — Deo Création",
  description: "Un tirage, une commande ou un projet sur mesure : contactez-nous.",
};

export default function ContactPage() {
  return (
    <div className="flex flex-1 flex-col bg-fond text-encre">
      <Header />
      <main className="flex-1">
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
