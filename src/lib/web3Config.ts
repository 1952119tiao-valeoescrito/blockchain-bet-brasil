// src/lib/web3Config.ts

import { createWeb3Modal } from '@web3modal/wagmi/react'
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'
import { WagmiProvider } from 'wagmi'
import { sepolia } from 'wagmi/chains' // Use a rede de teste que você estiver usando

// 1. Obtenha o projectId no https://cloud.walletconnect.com
const projectId = process.env.NEXT_PUBLIC_PROJECT_ID

if (!projectId) {
  throw new Error('NEXT_PUBLIC_PROJECT_ID is not set')
}

// 2. Crie os metadados do seu dApp
const metadata = {
  name: 'Blockchain Bet Brasil',
  description: 'Apostas descentralizadas na blockchain.',
  url: 'http://localhost:3000', // Substitua pelo seu domínio em produção
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

// 3. Configure as chains e crie a config do wagmi
const chains = [sepolia] as const // Adicione outras redes se precisar (ex: [mainnet, sepolia])
export const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  ssr: true, // Habilitar SSR, mas nosso provider vai controlar quando roda
})

// 4. Crie o Web3Modal
createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableAnalytics: true, // Opcional
  enableOnramp: true // Opcional
})