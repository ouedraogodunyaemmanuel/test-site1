import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/cart/CartContext";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { DeliveryProvider } from "@/components/checkout/DeliveryContext";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

// Serif réservée aux titres, pour l'esprit galerie.
const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Deo Création — Tirages d'art de paysages",
  description: "Tirages photographiques d'exception, imprimés à la demande.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // `data-theme` est posé par ThemeProvider après l'hydratation ;
    // sans attribut, `:root` fournit déjà le mode sombre.
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} ${playfairDisplay.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-fond text-encre">
        <ThemeProvider>
          <CartProvider>
            <DeliveryProvider>
              {/* CartButton retiré : le panier vit dans l'en-tête,
                  ce qui libère la marge droite du Header. */}
              <CartDrawer />
              <div className="page-enter flex flex-1 flex-col">{children}</div>
            </DeliveryProvider>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
