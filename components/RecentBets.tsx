// components/RecentBets.tsx

"use client";

import { useReadContract } from 'wagmi';
import { formatEther } from 'viem';
import { contractAddress, contractABI } from '@/constants'; // Usando nossa fonte da verdade

// Definindo as props que o componente receberá
type RecentBetsProps = {
  currentRoundId: bigint | undefined;
};

export function RecentBets({ currentRoundId }: RecentBetsProps) {

  const { data: apostas, isLoading, error } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'getApostasDaRodada',
    // Usando o ID da rodada atual que recebemos como prop
    args: [currentRoundId, 0, 100], 
    // Só executa a query se o ID da rodada for válido
    query: {
      enabled: !!currentRoundId && currentRoundId > 0n,
    },
    watch: true, // A mágica do tempo real!
  });

  // Se ainda não sabemos qual é a rodada atual, não mostramos nada.
  if (!currentRoundId || currentRoundId === 0n) {
    return null;
  }
  
  if (isLoading) {
    return <div className="text-center text-gray-400 animate-pulse">Carregando apostas recentes...</div>;
  }

  if (error) {
    return <div className="text-center text-red-400">Erro ao carregar apostas: {error.shortMessage}</div>;
  }
  
  return (
    <div className="w-full max-w-4xl mx-auto mt-12">
      <h3 className="text-2xl font-bold text-center mb-4">
        Apostas Recentes (Rodada #{currentRoundId.toString()})
      </h3>
      <div className="bg-slate-800/50 p-4 rounded-lg flex flex-col gap-3 max-h-96 overflow-y-auto">
        {(!apostas || apostas.length === 0) ? (
            <div className="text-center text-gray-500 py-8">Nenhuma aposta feita nesta rodada ainda. Seja o primeiro!</div>
        ) : (
          [...apostas].reverse().map((aposta, index) => ( // Usando spread para não mutar o array original
            <div key={index} className="bg-slate-700/50 p-3 rounded-md text-sm flex justify-between items-center gap-4">
              <div>
                <p className="font-mono text-gray-300">
                  <span className="font-bold text-white">Jogador:</span> {aposta.jogador.slice(0, 6)}...{aposta.jogador.slice(-4)}
                </p>
                <p className="font-mono text-xs text-cyan-300">
                  <span className="font-bold text-white">Prognósticos:</span> {aposta.prognosticosX.join(', ')} / {aposta.prognosticosY.join(', ')}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                  <span className="font-bold text-lg text-green-400">{formatEther(aposta.valorPago)}</span>
                  <span className="text-xs text-gray-400 ml-1">ETH</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}