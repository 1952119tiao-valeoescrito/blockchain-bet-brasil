// src/app/ClientProviders.tsx

'use client';

import '@rainbow-me/rainbowkit/styles.css';
import { RainbowKitProvider, getDefaultConfig } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { sepolia } from 'wagmi/chains'; // Ou a rede que você estiver usando
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

// 1. Obtenha o projectId no https://cloud.walletconnect.com
const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;
if (!projectId) {
  throw new Error('Variável de ambiente NEXT_PUBLIC_PROJECT_ID não definida');
}

// 2. Crie a configuração usando a função correta do RainbowKit
// A função `getDefaultConfig` já faz tudo que você precisa!
const config = getDefaultConfig({
  appName: 'Blockchain Bet Brasil',
  projectId: projectId,
  chains: [sepolia],
  // Opcional: Adicione mais configurações de transporte se necessário
  // ssr: true, // Adicione se estiver usando Server-Side Rendering
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