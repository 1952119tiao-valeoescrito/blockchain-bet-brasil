// Caminho: src/providers.tsx

'use client';

import { ReactNode } from 'react';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains'; // << Ajuste as redes conforme sua necessidade
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConnectKitProvider, getDefaultConfig } from 'connectkit';

const queryClient = new QueryClient();

// Cria a configuração do wagmi, agora com a propriedade 'transports' obrigatória
const config = createConfig(
  getDefaultConfig({
    // Suas informações do WalletConnect
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,

    // Nome da sua aplicação
    appName: 'Blockchain Bet Brasil',

    // Redes suportadas
    chains: [mainnet, sepolia],

    // AQUI ESTÁ A CORREÇÃO MAIS IMPORTANTE
    // O Wagmi v2 exige que você defina como a aplicação se conecta a cada rede.
    transports: {
      [mainnet.id]: http(),
      [sepolia.id]: http(),
    },

    // Informações opcionais
    appDescription: 'Sua plataforma de apostas descentralizada',
    appUrl: 'https://blockchain-betbrasil.io',
    appIcon: 'https://blockchain-betbrasil.io/logo.png',
  }),
);

// Componente que agrupa todos os provedores
export function Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>
          {children}
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}