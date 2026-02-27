import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "RavvedimentoFacile - Calcolatore Ravvedimento Operoso",
  description: "Calcola il ravvedimento operoso in pochi secondi. Sostituisci i tuoi fogli Excel con uno strumento professionale sempre aggiornato.",
  keywords: ["ravvedimento operoso", "calcolatore", "sanzioni", "interessi legali", "F24", "commercialisti"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body className={`${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
