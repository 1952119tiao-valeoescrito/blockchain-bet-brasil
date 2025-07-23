// src/app/page.tsx

"use client"; 

// Importe o componente Link do Next.js
import Link from 'next/link';

// Importe o seu componente de formulário
import BettingForm from '@/components/BettingForm';

export default function HomePage() {
  return (
    <div className="w-full max-w-4xl text-center flex flex-col items-center gap-8">
      
      {/* Container com o texto de chamada */}
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-4xl md:text-5xl font-bold text-white">
          Blockchain Bet Brasil
        </h1>
        <p className="text-lg text-gray-300">
          O BBB da Web3 - Esse Jogo é Animal.
        </p>

        {/* 
          <<<<< AQUI A MORALZINHA ESTRATÉGICA >>>>>
          Adicionamos o link para a página de premiação.
        */}
        <p className="text-md text-gray-400">
          Ganha com 5, 4, 3, 2 e até com 1 ponto apenas. {' '}
          <Link href="/BlockchainBetBrasilTable" className="font-semibold text-cyan-400 hover:text-cyan-300 hover:underline transition">
            Os prognósticos válidos.
          </Link>
        </p>
<p>Você sonha, nós entregamos.</p>
      </div>

      {/* Nosso formulário, que vai aparecer quando a carteira conectar */}
      <BettingForm />

    </div>
  );
}