// src/app/ClientProviders.tsx

'use client'; // ESSA É A LINHA MAIS IMPORTANTE!

import '@rainbow-me/rainbowkit/styles.css';
import {RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { sepolia } from 'wagmi/chains'; // Ou a rede que você estiver usando
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';

// 1. Obtenha o projectId no https://cloud.walletconnect.com
const projectId = process.env.NEXT_PUBLIC_PROJECT_ID!;
if (!projectId) {
  throw new Error('Variável de ambiente NEXT_PUBLIC_PROJECT_ID não definida');
}

// 2. Configure as chains e crie a config do wagmi
const chains = [sepolia] as const;
const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata: {
    name: 'Blockchain Bet Brasil',
    description: 'O BBB da Web3!',
    url: 'https://blockchain-betbrasil.io', // Altere para seu domínio
    icons: ['https://avatars.githubusercontent.com/u/37784886'],
  },
});

const queryClient = new QueryClient();

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}