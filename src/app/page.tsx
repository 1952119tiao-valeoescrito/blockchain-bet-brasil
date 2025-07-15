'use client';

import { useAccount } from 'wagmi';
import BettingForm from '@/components/BettingForm';

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
    // ===============================================
    //      A MÁGICA DA CENTRALIZAÇÃO ESTÁ AQUI!
    // ===============================================
    <div className="py-10 flex items-center justify-center">
      { isConnected ? <BettingForm /> : <WelcomeScreen /> }
    </div>
  );
}