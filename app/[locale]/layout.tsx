// app/layout.tsx (VERSÃO FINAL COM O AVISO)

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { WarningBanner } from "@/components/WarningBanner"; // <-- 1. IMPORTAR
import "./globals.css";
import '@rainbow-me/rainbowkit/styles.css';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Blockchain Bet Brasil",
  description: "O BBB da Web3 - Esse Jogo É Animal.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className={`${inter.className} bg-gray-900 text-white`}>
        <Providers>
            <Header />
            <WarningBanner /> {/* <-- 2. ADICIONAR O AVISO AQUI */}
            <main>{children}</main>
            <Footer />
        </Providers>
        <GoogleAnalytics />
      </body>
    </html>
  );
}