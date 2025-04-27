import { createConfig, configureChains } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { hardhat } from 'wagmi/chains'

const { chains, publicClient } = configureChains(
  [hardhat], // Adicione outras redes (Sepolia, etc.)
  [publicProvider()]
)

export const config = createConfig({
  autoConnect: true,
  publicClient,
})