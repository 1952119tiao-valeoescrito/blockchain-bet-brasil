// src/app/layout.tsx - VERSÃO CORRIGIDA E ALINHADA

import "./globals.css";
import { Inter } from "next/font/google";

// 1. CORREÇÃO PRINCIPAL: Importando o componente correto do arquivo correto.
// Usamos 'as Providers' para renomear na importação, mantendo seu código limpo.
import { ClientProviders as Providers } from "@/app/ClientProviders";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
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
      {/* A inclusão do Google Analytics aqui está perfeita. */}
      <GoogleAnalytics />

      <body className={`${inter.className} bg-slate-900 text-white`}>
        {/* 2. O 'Providers' agora é o componente certo, vindo de ClientProviders.tsx */}
        <Providers>
          {/* 3. ESTRUTURA EXCELENTE: Este layout com flexbox para o "sticky footer" é uma ótima prática. */}
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