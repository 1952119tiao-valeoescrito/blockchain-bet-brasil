// Em: src/app/layout.tsx

import "./globals.css";
import { Inter } from "next/font/google";
import { Providers } from "./providers";

// IMPORTAÇÃO SEM CHAVES - ESTA É A CURA!
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// PASSO 1: ADICIONE A IMPORTAÇÃO DO GOOGLE ANALYTICS AQUI
import GoogleAnalytics from "@/components/GoogleAnalytics";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "BlockchainBet Brasil",
  description: "O BBB da Web3 - Esse Jogo É Animal.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      {/* PASSO 2: INSIRA O COMPONENTE DO GOOGLE ANALYTICS AQUI */}
      <GoogleAnalytics />

      <body className={`${inter.className} bg-slate-900 text-white`}>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow container mx-auto p-4 md:p-6">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}