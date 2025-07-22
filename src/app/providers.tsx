// src/app/providers.tsx

"use client";

import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { sepolia } from "wagmi/chains"; // <-- CORRIGIDO: Agora estamos na rede certa!
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

// ATENÇÃO: Cole aqui o seu ID de projeto gerado no site do WalletConnect Cloud.
const projectId = "0xD7ACd2a9FD159E69Bb102A1ca21C9a3e3A5F771B"; // <-- SUBSTITUA AQUI

const config = getDefaultConfig({
  appName: "Blockchain BetBrasil",
  projectId: projectId,
  chains: [sepolia], // <-- CORRIGIDO: Apontando para a Sepolia Testnet!
  ssr: true,
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}