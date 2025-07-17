// src/app/page.tsx - NENHUMA CORREÇÃO NECESSÁRIA. CÓDIGO EXEMPLAR.

'use client';

import { useAccount } from 'wagmi';
// 1. COMPONENTIZAÇÃO PERFEITA: A lógica complexa do formulário está em seu próprio arquivo.
import BettingForm from '@/components/BettingForm';

// 2. COMPONENTE INTERNO: Criar um sub-componente para a tela de boas-vindas
//    mantém o código principal ainda mais limpo e organizado.
const WelcomeScreen = () => (
  <div className="text-center text-white">
    <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">
      Bem-vindo <br /> BlockchainBet Brasil!
    </h1>
    <div className="mt-4 text-lg text-slate-300 space-y-1">
      <p>O BBB da Web3 - Esse Jogo É Animal.</p>
      <p>Você sonha, nós entregamos.</p>
      <p>Ganha com 5, 4, 3, 2 e até com 1 ponto apenas.</p>
    </div>
  </div>
);

export default function HomePage() {
  const { isConnected } = useAccount();

  return (
    // 3. RENDERIZAÇÃO CONDICIONAL ELEGANTE: O uso do operador ternário aqui é a forma
    //    mais limpa e legível de alternar entre os dois estados da página.
    <div className="py-10 flex items-center justify-center">
      { isConnected ? <BettingForm /> : <WelcomeScreen /> }
    </div>
  );
}