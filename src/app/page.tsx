// ARQUIVO: /src/app/page.tsx - VERSÃO CORRIGIDA COM BANNER

'use client';

import React from 'react';
import { useAccount } from 'wagmi';
import BettingForm from '@/components/BettingForm'; // Nosso formulário
import TestnetBanner from '@/components/TestnetBanner'; // Nosso banner!

// Componente para a mensagem de boas-vindas
const WelcomeMessage = () => (
    <div className="w-full max-w-4xl flex flex-col items-center justify-center text-center gap-4">
        <h1 className="text-6xl md:text-7xl font-light text-slate-200">
            Bem-vindo
        </h1>
        <div className="my-4">
            <h2 className="text-3xl md:text-4xl font-bold">
                Blockchain Bet Brasil - <span className="text-emerald-400">O BBB da Web3.</span>
            </h2>
            <p className="mt-2 text-2xl font-bold text-amber-400">
                Esse Jogo é Animal
            </p>
        </div>
        <p className="text-xl text-slate-100">
            Ganha com 5, 4, 3, 2 e até com 1 ponto apenas!
        </p>
        <p className="mt-4 text-md text-slate-400">
            Plataforma de apostas descentralizada.
        </p>
    </div>
);


export default function HomePage() {
  const { isConnected } = useAccount();

  return (
    // Um container que centraliza tudo
    <div className="w-full flex flex-col items-center justify-center gap-8">
      <TestnetBanner /> {/* O BANNER AGORA MORA AQUI! */}
      
      {/* Mostra o conteúdo correto baseado na conexão */}
      {isConnected ? <BettingForm /> : <WelcomeMessage />}
    </div>
  );
}