// src/components/providers/Web3Provider.tsx

'use client';

import React from 'react';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { walletConnect } from 'wagmi/connectors';

// 1. Crie seu QueryClient
const queryClient = new QueryClient();

// 2. Crie sua configuração do Wagmi
// Use o seu Project ID do .env.local aqui
const projectId = process.env.NEXT_PUBLIC_PROJECT_ID!; // O '!' garante ao TypeScript que essa variável existe

export const config = createConfig({
  chains: [sepolia],
  connectors: [
    walletConnect({ projectId, metadata: {
        name: 'Blockchain Bet Brasil',
        description: 'Plataforma de apostas descentralizada',
        url: 'https://blockchain-betbrasil.io', // substitua pelo seu site
        icons: ['https://avatars.githubusercontent.com/u/37784886'] // substitua pelo seu ícone
    }}),
  ],
  transports: {
    [sepolia.id]: http(process.env.SEPOLIA_RPC_URL="https://eth-sepolia.g.alchemy.com/v2/alcht_Gkq4BbgVZ6BHgIFuoTugUbtB908ZiW") // Use a URL RPC do seu .env.local
  },
});

// 3. Crie o componente Provedor
export function Web3Provider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}