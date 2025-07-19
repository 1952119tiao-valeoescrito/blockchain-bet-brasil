// src/components/RecentBets.tsx
"use client";

import { useReadContract } from 'wagmi';
import { formatEther } from 'viem';
// Importe suas constantes
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/lib/constants'; // Supondo que você tenha um arquivo assim

// Se não tiver o arquivo de constantes, defina aqui mesmo
// import contractAbi from '@/abi/BlockchainBetBrasil.json';
// const BlockchainBetBrasilAddrees = '0x9D586CbA6c856B4979C1D2e5115ecdBAc85184E8';

export function RecentBets() {

  const { data: apostas, isLoading, error } = useReadContract({
    address: CONTRACT_ADDRESS, // ou BlockchainBetBrasilAddrees
    abi: CONTRACT_ABI, // ou contractAbi
    functionName: 'getApostasDaRodada',
    args: [1, 0, 100], // Pega as primeiras 100 apostas da rodada 1
    // A MÁGICA: Isso faz o hook "ouvir" a blockchain e re-validar os dados a cada novo bloco!
    // Sua lista de apostas vai se atualizar em tempo real.
    watch: true, 
  });

  if (isLoading) {
    return <div className="text-center text-gray-400">Carregando apostas recentes...</div>;
  }

  if (error) {
    return <div className="text-center text-red-400">Erro ao carregar apostas: {error.shortMessage}</div>;
  }

  if (!apostas || apostas.length === 0) {
    return <div className="text-center text-gray-500">Nenhuma aposta feita nesta rodada ainda. Seja o primeiro!</div>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto mt-12">
      <h3 className="text-2xl font-bold text-center mb-4">Apostas Recentes (Rodada 1)</h3>
      <div className="bg-slate-800/50 p-4 rounded-lg flex flex-col gap-3">
        {apostas.map((aposta, index) => (
          <div key={index} className="bg-slate-700 p-3 rounded-md text-sm flex justify-between items-center">
            <div>
              <p className="font-mono text-gray-300">
                <span className="font-bold text-white">Jogador:</span> {aposta.jogador.slice(0, 6)}...{aposta.jogador.slice(-4)}
              </p>
              <p className="font-mono text-xs text-blue-300">
                <span className="font-bold text-white">Prognósticos:</span> {aposta.prognosticosX.join(', ')} / {aposta.prognosticosY.join(', ')}
              </p>
            </div>
            <div className="text-right">
                <span className="font-bold text-lg text-green-400">{formatEther(aposta.valorPago)}</span>
                <span className="text-xs text-gray-400 ml-1">ETH</span>
            </div>
          </div>
        )).reverse()} {/* .reverse() para mostrar as mais recentes primeiro */}
      </div>
    </div>
  );
}