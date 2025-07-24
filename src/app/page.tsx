// src/app/page.tsx - VERSÃO CORRIGIDA E COM MORAL

"use client"; 

import Link from 'next/link';
import BettingForm from '@/components/BettingForm';

export default function HomePage() {
  return (
    <div className="w-full max-w-4xl text-center flex flex-col items-center gap-8">
      
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-4xl md:text-5xl font-bold text-white">
          Blockchain Bet Brasil
        </h1>
        <p className="text-lg text-gray-300">
          O BBB da Web3 - Esse Jogo é Animal.
        </p>

        <p className="text-md text-gray-400">
          Ganha com 5, 4, 3, 2 e até com 1 ponto apenas. {' '}
          {/* <<< A CORREÇÃO! Apontando para a PÁGINA que a gente acabou de criar >>> */}
          <Link href="/tabela-apostas" className="font-semibold text-cyan-400 hover:text-cyan-300 hover:underline transition">
            Confira os prognósticos válidos.
          </Link>
        </p>
        {/* Melhoria: Coloquei essa frase junto com as outras para ficar mais organizado */}
        <p className="text-sm text-gray-400 italic">Você sonha, nós entregamos.</p>
      </div>

      <BettingForm />

    </div>
  );
}