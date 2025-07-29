// ARQUIVO: /src/app/layout.tsx - VERSÃO FINAL COM GOOGLE ANALYTICS

import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@rainbow-me/rainbowkit/styles.css';
import { ClientProviders } from './ClientProviders';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GoogleAnalytics from '@/components/GoogleAnalytics'; // <-- 1. IMPORTAMOS O GOOGLE ANALYTICS

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Blockchain Bet Brasil',
  description: 'O BBB da Web3!',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-slate-900 text-slate-50`}>
        {/* Adicionamos o GA aqui. Ele vai injetar os scripts no <head> da página,
            mas colocar o componente aqui é uma prática comum e segura. */}
        <GoogleAnalytics />

        <ClientProviders>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow w-full">
              <div className="container mx-auto p-4 md:p-6 mt-8 mb-8 flex justify-center">
                {children}
              </div>
            </main>
            <Footer />
          </div>
        </ClientProviders>
      </body>
    </html>
  );
}