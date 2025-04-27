// src/app/providers.tsx
"use client";

import { ReactNode } from 'react';
import { Web3Modal } from '@web3modal/ethers5/react';

// Configuração do projeto no WalletConnect Cloud
const projectId = 'SEU_PROJECT_ID_WALLETCONNECT'; // Pega no https://cloud.walletconnect.com

// Chains suportadas (pode adicionar outras)
const chains = [
  {
    chainId: 1,
    name: 'Ethereum',
    currency: 'ETH',
    explorerUrl: 'https://etherscan.io',
    rpcUrl: 'https://cloudflare-eth.com'
  },
  {
    chainId: 11155111,
    name: 'Sepolia',
    currency: 'ETH',
    explorerUrl: 'https://sepolia.etherscan.io',
    rpcUrl: 'https://rpc.sepolia.org'
  },
  // Adiciona outras chains se precisar (Polygon, BSC, etc)
];

const metadata = {
  name: 'BetBrasil',
  description: 'App de apostas descentralizado',
  url: 'https://seudominio.com', // Cola teu site aqui
  icons: ['https://seudominio.com/logo.png'] // Coloca teu logo
};

export function Providers({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <Web3Modal
        projectId={projectId}
        chains={chains}
        themeMode="light" // Pode mudar pra "dark" se quiser
        themeVariables={{
          '--w3m-color-mix': '#00BB7F', // Cor principal (verde do Brasil)
          '--w3m-accent': '#FFCC29', // Cor de destaque (amarelo)
          '--w3m-font-family': 'Roboto, sans-serif'
        }}
        metadata={metadata}
        enableAnalytics={true}
      />
    </>
  );
}