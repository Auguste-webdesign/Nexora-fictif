import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { MotionProvider } from "@/components/motion-provider";
import { FinishProvider } from "@/components/finish-provider";
import { Navbar } from "@/components/nav/navbar";
import { CartProvider } from "@/components/cart/cart-provider";
import { CartPanel } from "@/components/cart/cart-panel";

// Display grotesk + technical monospace (§3). Inter carries the optical-size
// axis, so headlines and body copy share one family without looking identical.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

// The wordmark gets its own face. Inter and JetBrains Mono carry the interface;
// a logotype that shares them reads as a label rather than a mark. Space Grotesk
// is a technical grotesk with distinctive letterforms — engineered, not decorative
// — so it sits with the brand without being mistaken for body copy.
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nexora — Technologie premium sélectionnée",
  description:
    "Nexora est une boutique de technologie sélectionnée. Chaque produit examiné jusqu'au dernier composant, à commencer par l'iPhone 18.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${inter.variable} ${jetbrainsMono.variable} ${spaceGrotesk.variable} h-full`}>
      {/* No background here: html/body already carry the finish tint (globals.css). */}
      <body className="min-h-full text-nx-black antialiased">
        <MotionProvider>
          <FinishProvider>
            <CartProvider>
              <Navbar />
              <main>{children}</main>
              {/* Mounted once at the root so the cart survives route changes. */}
              <CartPanel />
            </CartProvider>
          </FinishProvider>
        </MotionProvider>
      </body>
    </html>
  );
}
