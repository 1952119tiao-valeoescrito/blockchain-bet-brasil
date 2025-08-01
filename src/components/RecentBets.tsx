// src/components/RecentBets.tsx - A JOGADA DE MESTRE

"use client";

import { useReadContract } from 'wagmi';
import { BaseError, formatEther } from 'viem';
import { bettingContractAddress, bettingContractABI } from '@/contracts';

// ✅ CORREÇÃO 1: Deixando nosso tipo igual ao que o wagmi espera.
type Aposta = {
  readonly jogador: `0x${string}`;
  // Agora ele espera exatamente um array de 5, como no contrato.
  readonly prognosticosX: readonly [bigint, bigint, bigint, bigint, bigint];
  readonly prognosticosY: readonly [bigint, bigint, bigint, bigint, bigint];
  readonly valorPago: bigint;
};

export function RecentBets() {
  const { data: rodadaAtualId } = useReadContract({
    address: bettingContractAddress,
    abi: bettingContractABI,
    functionName: 'rodadaAtualId',
  });

  const { data: apostas, isLoading, error } = useReadContract({
    address: bettingContractAddress,
    abi: bettingContractABI,
    functionName: 'getApostasDaRodada',
    args: [rodadaAtualId!, BigInt(0), BigInt(100)], 
    query: { 
      enabled: typeof rodadaAtualId === 'bigint',
      refetchInterval: 5000, 
    },
  });

  if (isLoading) {
    return <div className="text-center text-gray-400 mt-8">Carregando apostas recentes...</div>;
  }

  if (error) {
    const errorMsg = error instanceof BaseError ? error.shortMessage : "Falha ao carregar apostas.";
    return <div className="text-center text-red-400 mt-8">{errorMsg}</div>;
  }

  // A gente nem precisa mais forçar o tipo aqui.
  if (!apostas || apostas.length === 0) {
    return <div className="text-center text-gray-500 mt-8">Nenhuma aposta feita nesta rodada ainda. Seja o primeiro!</div>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto mt-12">
      <h3 className="text-2xl font-bold text-center mb-4 text-white">Apostas Recentes (Rodada #{rodadaAtualId?.toString()})</h3>
      <div className="bg-slate-800/50 p-4 rounded-lg flex flex-col gap-3 max-h-96 overflow-y-auto">
        {/* ✅ CORREÇÃO 2: Criamos uma cópia com [...apostas] antes de inverter! */}
        {[...(apostas as Aposta[])].reverse().map((aposta, index) => (
          <div key={index} className="bg-slate-700/80 p-3 rounded-md text-sm flex justify-between items-center animate-fade-in">
            <div>
              <p className="font-mono text-gray-300">
                <span className="font-bold text-white">Jogador:</span> {aposta.jogador.slice(0, 6)}...{aposta.jogador.slice(-4)}
              </p>
            </div>
            <div className="text-right">
                <span className="font-bold text-lg text-green-400">{formatEther(aposta.valorPago)}</span>
                <span className="text-xs text-gray-400 ml-1">ETH</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}