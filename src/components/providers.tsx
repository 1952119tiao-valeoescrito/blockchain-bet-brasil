// components/providers.tsx
"use client";

import React, { ReactNode } from 'react';
import { WagmiConfig } from 'wagmi';
import { sepolia, mainnet, hardhat } from 'wagmi/chains';
import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi';

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

if (!projectId) {
  console.warn(
    "ALERTA CRÍTICO: NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID não está definido! " +
    "Web3Modal não funcionará corretamente. " +
    "Obtenha um projectId em https://cloud.walletconnect.com."
  );
}

const metadata = {
  name: 'Blockchain Bet Brasil',
  description: 'Aposte no seu animal da sorte na Web3! O BBB da Web3!',
  url: 'https://blockchain-betbrasil.io',
  icons: ['https://blockchain-betbrasil.io/favicon.ico'] 
};

const chainsToConfigure = [
  sepolia,
  // mainnet, 
  ...(process.env.NODE_ENV === 'development' ? [hardhat] : [])
] as const;

const wagmiAppConfig = defaultWagmiConfig({
  chains: chainsToConfigure, // As chains são definidas aqui para o wagmiConfig
  projectId: projectId || "MISSING_PROJECT_ID_FALLBACK", 
  metadata,
  // ssr: true, // Descomente se estiver usando SSR/SSG com wagmi
});

if (projectId) {
  createWeb3Modal({
    wagmiConfig: wagmiAppConfig,
    projectId,
    // chains: chainsToConfigure, // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< LINHA REMOVIDA
    // themeMode: 'light',
    // themeVariables: {
    //   '--w3m-font-family': 'Roboto, sans-serif',
    //   '--w3m-accent': '#007bff',
    // },
    // enableAnalytics: true 
  });
}

export function Providers({ children }: { children: ReactNode }) {
  return <WagmiConfig config={wagmiAppConfig}>{children}</WagmiConfig>;
}