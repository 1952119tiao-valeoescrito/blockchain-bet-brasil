// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import '@rainbow-me/rainbowkit/styles.css'; 
import { ClientProviders } from './ClientProviders'; // Corrigido: ClientProviders
import Header from '@/components/Header';
import Footer from '@/components/Footer';

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
    <html lang="pt-br" suppressHydrationWarning>
      <body className={`${inter.className} bg-slate-900 text-slate-50 min-h-screen flex flex-col`}>
        {/*
          ESTA É A ESTRUTURA MAIS SEGURA E PADRÃO.
          O ClientProviders envolve TUDO, garantindo que qualquer componente,
          seja no Header, Footer ou na página principal, tenha acesso aos hooks.
        */}
        <ClientProviders>
          <Header />
          <main className="flex-grow p-4 md:p-6 flex justify-center">
            {children}
          </main>
          <Footer />
        </ClientProviders>
      </body>
    </html>
  );
}