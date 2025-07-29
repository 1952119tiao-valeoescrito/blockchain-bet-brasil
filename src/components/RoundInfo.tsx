// src/components/RoundInfo.tsx - A APOSENTADORIA DO PEREBA

"use client";

import { useReadContract } from 'wagmi';
import { formatEther } from 'viem';
// ✅ CORREÇÃO 1: Usando a nossa fonte única da verdade.
import { bettingContractAddress, bettingContractABI } from '@/contracts';
import { Skeleton } from "@/components/ui/skeleton";

// Boa prática: Definir o tipo para o retorno do hook
type RodadaInfo = readonly [bigint, number, bigint, bigint, bigint, bigint, bigint];

export function RoundInfo() {
  // 1. Buscamos o ID da rodada atual
  const { data: rodadaAtualId, isLoading: isLoadingId } = useReadContract({
    address: bettingContractAddress,
    abi: bettingContractABI,
    functionName: 'rodadaAtualId',
  });

  // 2. Usamos o ID para buscar as informações da rodada
  const { data: rodadaInfo, isLoading: isLoadingInfo } = useReadContract({
    address: bettingContractAddress,
    abi: bettingContractABI,
    functionName: 'getRodadaInfoBasica',
    args: [rodadaAtualId!],
    query: { enabled: typeof rodadaAtualId === 'bigint' },
  });

  const isLoading = isLoadingId || isLoadingInfo;

  if (isLoading) {
    return (
        <div className="w-full max-w-md bg-slate-800/50 p-6 rounded-2xl border border-slate-700 text-sm">
            <h3 className="text-lg font-bold text-center mb-4 text-white">Informações da Rodada</h3>
            <div className="space-y-2">
                <Skeleton className="h-5 w-full bg-slate-700" />
                <Skeleton className="h-5 w-full bg-slate-700" />
                <Skeleton className="h-5 w-full bg-slate-700" />
            </div>
        </div>
    );
  }

  if (!rodadaInfo) {
    return <p className="text-center text-slate-500 mt-8">Nenhuma rodada ativa no momento.</p>;
  }

  const typedInfo = rodadaInfo as RodadaInfo;
  const statusMap = ["Inativa", "Aberta", "Fechada", "Paga", "Finalizada"];
  const statusText = statusMap[Number(typedInfo[1])] ?? "Desconhecido";

  return (
    <div className="w-full max-w-md bg-slate-800/50 p-6 rounded-2xl border border-slate-700 text-sm">
      <h3 className="text-lg font-bold text-center mb-4 text-white">Rodada #{typedInfo[0].toString()}</h3>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="font-semibold text-slate-300">Status:</span>
          <span className="font-mono text-white">{statusText}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold text-slate-300">Valor do Ticket:</span>
          <span className="font-mono text-green-400">{formatEther(typedInfo[2])} ETH</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold text-slate-300">Total Arrecadado:</span>
          <span className="font-mono text-white">{formatEther(typedInfo[3])} ETH</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold text-slate-300">Prêmio Total:</span>
          <span className="font-mono text-white">{formatEther(typedInfo[4])} ETH</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold text-slate-300">Nº de Apostas:</span>
          <span className="font-mono text-white">{typedInfo[5].toString()}</span>
        </div>
      </div>
    </div>
  );
}