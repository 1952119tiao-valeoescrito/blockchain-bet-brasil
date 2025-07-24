// CÓDIGO CORRIGIDO para: src/lib/web3Config.ts

import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia } from 'wagmi/chains';

// ATENÇÃO: Cole aqui o seu ID de projeto gerado no site do WalletConnect Cloud.
const projectId = 'SEU_WALLETCONNECT_PROJECT_ID_AQUI'; // <-- SUBSTITUA AQUI

if (projectId === '0xD7ACd2a9FD159E69Bb102A1ca21C9a3e3A5F771B') {
    throw new Error("Erro de Configuração: Por favor, insira o seu Project ID do WalletConnect no arquivo src/lib/web3Config.ts");
}

export const config = getDefaultConfig({
    appName: "Blockchain BetBrasil",
    projectId: projectId,
    chains: [sepolia],
    ssr: true,
});