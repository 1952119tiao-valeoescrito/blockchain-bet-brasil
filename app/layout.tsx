"use client";

import { Inter } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import "./globals.css";

import { WagmiProvider, createConfig, http } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { injected } from 'wagmi/connectors';

const chainsToUse = [sepolia] as const;

const sepoliaRpcUrlFromEnv = process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL;
const sepoliaRpcUrl = sepoliaRpcUrlFromEnv || 'https://rpc.sepolia.org';

if (!sepoliaRpcUrlFromEnv) {
  console.warn(
    "AVISO: NEXT_PUBLIC_SEPOLIA_RPC_URL não está definida em .env.local. Usando RPC público para Sepolia. Para melhor performance e evitar rate limits, configure sua própria URL RPC."
  );
}

const config = createConfig({
  chains: chainsToUse,
  connectors: [
    injected(),
  ],
  transports: {
    [sepolia.id]: http(sepoliaRpcUrl),
  },
});

const queryClient = new QueryClient();
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" style={{ height: '100%' }}>
      <body
        className={inter.className}
        style={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        <WagmiProvider config={config} reconnectOnMount={true}>
          <QueryClientProvider client={queryClient}>
            <Navbar />
            <main style={{ flexGrow: 1 }}>
              {children}
            </main>
            <Footer />
          </QueryClientProvider>
        </WagmiProvider>
      </body>
    </html>
  );
}