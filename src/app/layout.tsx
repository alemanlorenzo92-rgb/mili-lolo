import type { Metadata } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mili & Lolo — Nuestra Historia",
  description: "Archivo íntimo y cinematográfico de recuerdos, cartas y diario personal.",
};

export const instant = false;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${cormorant.variable} ${jakarta.variable}`}>
      <body className="min-h-screen bg-[#FAF8F5] text-[#1C1A17] flex flex-col font-sans selection:bg-[#E8DED4] selection:text-[#2B231D]">
        {children}
      </body>
    </html>
  );
}
