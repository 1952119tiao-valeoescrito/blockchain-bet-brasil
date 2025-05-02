import { createWeb3Modal } from '@web3modal/wagmi/react'
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'
import { WagmiProvider } from 'wagmi'
import { mainnet } from 'wagmi/chains'

const projectId = 'SEU_PROJECT_ID' // Coloque seu ID real aqui

const metadata = {
  name: 'Bet Brasil',
  description: 'Sua plataforma de apostas',
  url: 'https://betbrasil.com',
  icons: ['https://betbrasil.com/logo.png']
}

const wagmiConfig = defaultWagmiConfig({
  projectId,
  chains: [mainnet],
  metadata
})

createWeb3Modal({
  wagmiConfig,
  projectId,
  enableAnalytics: true
})