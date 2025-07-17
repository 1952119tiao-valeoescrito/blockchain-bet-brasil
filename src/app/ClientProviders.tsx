// src/app/ClientProviders.tsx - VERSÃO CORRIGIDA E FUNCIONAL

'use client'; // Mantido, pois provedores de contexto são do lado do cliente.

// --- IMPORTS CORRIGIDOS ---
// 1. LIMPEZA: Removido 'defaultWagmiConfig' do Web3Modal, que era a fonte do conflito.
import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider, createConfig, http } from 'wagmi'; // 2. IMPORTAÇÃO CORRETA: Adicionado 'createConfig' e 'http' do wagmi.
import { sepolia } from 'wagmi/chains';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

// --- CONFIGURAÇÃO ---

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;
if (!projectId) {
  // Mantido o erro, é uma ótima prática de segurança.
  throw new Error('Variável de ambiente NEXT_PUBLIC_PROJECT_ID não definida');
}

// 3. CONFIGURAÇÃO PADRÃO RAINBOWKIT: Esta é a maneira correta de configurar o wagmi para funcionar com o RainbowKit.
// Agora sim estamos usando 'getDefaultWallets', que havia sido importado mas estava esquecido.
const { connectors } = getDefaultWallets({
  appName: 'Blockchain Bet Brasil', // O nome do seu app
  projectId,
});

const config = createConfig({
  connectors,
  chains: [sepolia],
  transports: {
    // Para cada chain, definimos um 'transport'. 'http' é o padrão.
    [sepolia.id]: http(),
  },
  // A propriedade 'metadata' não é usada aqui, o 'appName' em getDefaultWallets já ajuda.
});

// --- CLIENT ---
const queryClient = new QueryClient();


// --- PROVEDOR ---
export function ClientProviders({ children }: { children: React.ReactNode }) {
  // 4. ESTRUTURA MANTIDA: A ordem dos provedores estava correta. O problema era o 'config' injetado.
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