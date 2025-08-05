// app/providers.tsx

"use client";

import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, createConfig } from 'wagmi';
import { mainnet, polygon, sepolia } from 'wagmi/chains';
import { RainbowKitProvider, getDefaultConfig } from '@rainbow-me/rainbowkit';

// Importe o CSS do RainbowKit
import '@rainbow-me/rainbowkit/styles.css';

// Configuração simplificada usando o padrão do RainbowKit
const config = getDefaultConfig({
  appName: 'Blockchain BetBrasil',
  projectId: 'edee62a1f005a9d0ba32911ada1ef2c9', // Obtenha um em https://cloud.walletconnect.com/
  chains: [mainnet, polygon, sepolia],
  ssr: true,
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
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