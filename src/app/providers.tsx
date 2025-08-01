// Localização: src/app/providers.tsx

"use client";

import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { sepolia } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

// ATENÇÃO: Cole aqui o seu ID de projeto gerado no site do WalletConnect Cloud.
const projectId = '0xC4bbDAF808A0586534Ce108894745718Ff27cC14'; // <-- SUBSTITUA AQUI

const config = getDefaultConfig({
  appName: "Blockchain BetBrasil",
  projectId: projectId,
  chains: [sepolia],
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