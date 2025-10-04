// src/components/Web3Provider.tsx
'use client'

import React from 'react'
import { WagmiConfig, createConfig, http } from 'wagmi' // 'http' vem do wagmi v2
import { sepolia } from 'wagmi/chains' // Chains também são importadas diretamente de 'wagmi/chains' na v2
import { QueryClient, QueryClientProvider } from '@tanstack/react-query' // Necessário para Wagmi v2

// 1. Crie uma instância do QueryClient (Wagmi v2 usa @tanstack/react-query internamente)
const queryClient = new QueryClient()

// 2. Configure a carteira (Wagmi v2)
const config = createConfig({
  chains: [sepolia], // Defina as chains que sua aplicação suporta
  transports: {
    // Para cada chain, defina como se conectar a ela.
    // O 'http()' é o provedor mais básico, ideal para desenvolvimento.
    [sepolia.id]: http(), 
    // Você pode adicionar outros provedores aqui, por exemplo, para mainnet:
    // [mainnet.id]: http(),
  },
  // Opcional: Adicione conectores aqui se você for usar carteiras como MetaMask, WalletConnect etc.
  // Por exemplo, para MetaMask:
  // connectors: [
  //   injected(), // Conector para carteiras injetadas (ex: MetaMask)
  //   walletConnect({ projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!, showQrModal: false }),
  // ]
  // Certifique-se de ter 'injected' e 'walletConnect' importados de 'wagmi/connectors'
  // e de ter a variável de ambiente NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID configurada.
})

export function Web3Provider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiConfig config={config}>
      {/* O QueryClientProvider é mandatório com Wagmi v2 */}
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiConfig>
  )
}