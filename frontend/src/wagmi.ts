'use client';

import { createWeb3Modal } from '@web3modal/wagmi/react';
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';
import { WagmiProvider } from 'wagmi';
import { sepolia, mainnet } from 'wagmi/chains';

// 1. Obtenha o projectId do WalletConnect Cloud
// ⚠️ SUBSTITUA PELO SEU PROJECT ID REAL OBTIDO EM https://cloud.walletconnect.com/
const projectId = 'edee62a1f005a9d0ba32911ada1ef2c9';

// 2. Crie os metadados do seu dApp
const metadata = {
  name: 'Blockchain Bet Brasil',
  description: 'Sua plataforma de apostas descentralizada',
  url: 'https://blockchain-betbrasil.io', // Mude para o seu domínio final
  icons: ['https://blockchain-betbrasil.io/images/logo.png'] // Mude para o URL do seu logo
};

// 3. Defina as chains e crie a config do wagmi
const chains = [sepolia, mainnet] as const;
export const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  ssr: true, // Essencial para Next.js
});

// 4. Crie o modal (Esta função registra o componente <w3m-button />)
createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableAnalytics: true, // Opcional
  themeMode: 'dark'
});