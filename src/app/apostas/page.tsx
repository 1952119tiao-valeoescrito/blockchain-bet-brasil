// src/app/apostas/page.tsx

"use client";

import { useAccount } from "wagmi";

export default function PaginaApostas() {
  const { isConnected, address } = useAccount();

  return (
    <div className="w-full max-w-5xl text-center">
      <h1 className="text-3xl font-bold text-white mb-8">Minhas Apostas</h1>

      {isConnected ? (
        <div className="bg-gray-800 bg-opacity-50 p-6 rounded-lg">
          <p className="text-lg text-gray-300">
            Histórico de apostas da carteira:
          </p>
          <p className="text-md font-mono text-cyan-400 mt-2 break-all">
            {address}
          </p>
          
          <div className="mt-8 text-gray-500">
            (Em breve: Tabela de apostas será carregada aqui)
          </div>
        </div>
      ) : (
        <div className="bg-gray-800 bg-opacity-50 p-6 rounded-lg">
          <p className="text-lg text-white">
            Por favor, conecte sua carteira para ver seu histórico de apostas.
          </p>
        </div>
      )}
    </div>
  );
}