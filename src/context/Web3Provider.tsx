// src/context/Web3Provider.tsx

'use client' // ESSA LINHA É A MAIS IMPORTANTE!

import React, { ReactNode } from 'react'
import { config } from '@/lib/web3Config' // Importa a config que criamos
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// O Wagmi depende do React Query, então precisamos do provider dele também
const queryClient = new QueryClient()

export function Web3Provider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}