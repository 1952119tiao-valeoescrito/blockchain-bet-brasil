// components/WelcomeScreen.tsx
'use client';

import { ConnectButton } from "@rainbow-me/rainbowkit";

export const WelcomeScreen = () => (
  <div className="text-center text-white flex flex-col items-center gap-8 max-w-xl mx-auto px-4">
    <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
      Bem-vindo à Blockchain BetBrasil!
    </h1>
    <div className="mt-4 text-lg text-slate-300 space-y-1">
      <p>O BBB da Web3 - Esse Jogo É Animal.</p>
      <p>Você sonha, nós entregamos os resultados.</p>
      <p>Ganha com 5, 4, 3, 2 e até com 1 ponto!</p>
    </div>
    <div className="mt-6">
       <p className="mb-4 font-semibold">Conecte sua carteira para começar a apostar:</p>
       <ConnectButton />
    </div>
  </div>
);