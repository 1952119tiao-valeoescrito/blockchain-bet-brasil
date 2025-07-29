// src/lib/web3Config.ts - VERSÃO FINAL E CORRETA

import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia } from 'wagmi/chains';

// ==================================================================
//    ✅ COLE AQUI O SEU ID DE PROJETO DO WALLETCONNECT CLOUD ✅
// ==================================================================
const projectId = 'edee62a1f005a9d0ba32911ada1ef2c9'; 

// Este é um mecanismo de segurança para garantir que você trocou a chave
if (projectId === 'edee62a1f005a9d0ba32911ada1ef2c9') {
    throw new Error("Erro de Configuração: Por favor, vá até o site do WalletConnect Cloud, gere um Project ID e cole ele no arquivo src/lib/web3Config.ts");
}

export const config = getDefaultConfig({
    appName: "Blockchain BetBrasil",
    projectId: projectId,
    chains: [sepolia],
    // Habilitar SSR (Server-Side Rendering) é importante para Next.js
    ssr: true, 
});