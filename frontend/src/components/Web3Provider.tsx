// Caminho: src/components/Web3Provider.tsx
'use client';

import '@rainbow-me/rainbowkit/styles.css';
import { RainbowKitProvider, getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, sepolia } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';

const chains = [mainnet, sepolia] as const;

const config = getDefaultConfig({
  appName: 'Blockchain Bet Brasil',
  projectId: 'SEU_PROJECT_ID_AQUI', // <<< NÃO ESQUEÇA SEU ID REAL
  chains: chains,
  ssr: true, 
});

const queryClient = new QueryClient();

export function Web3Provider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider> {/* <<< CORRIGIDO */}
    </WagmiProvider>
  );
}