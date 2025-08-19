// lib/wagmi.ts

import { http, createConfig } from 'wagmi';
import { mainnet, polygon, sepolia } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';

export const config = createConfig({
  chains: [mainnet, polygon, sepolia],
  connectors: [injected()],
  ssr: true,
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [sepolia.id]: http(),
  },
});