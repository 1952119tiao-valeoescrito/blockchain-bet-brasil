// src/components/ContractInfo.tsx - VERSÃO COM A TÁTICA CORRETA

'use client';

import { useReadContract } from 'wagmi';
import { bettingContractAddress, bettingContractABI } from '@/contracts';

const formatAddress = (addr?: `0x${string}`) => {
  if (!addr) return '...';
  return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
};

export function ContractInfo() {
  // 1. Buscamos o ID da rodada atual primeiro
  const { data: rodadaAtualId } = useReadContract({
    address: bettingContractAddress,
    abi: bettingContractABI,
    functionName: 'rodadaAtualId',
  });

  // 2. Buscamos as informações da rodada, mas SÓ QUANDO o rodadaAtualId estiver disponível
  const { data: rodadaInfo } = useReadContract({
    address: bettingContractAddress,
    abi: bettingContractABI,
    functionName: 'getRodadaInfoBasica',
    args: [rodadaAtualId!], // O '!' diz ao TS: confia, não será nulo aqui
    // A mágica acontece aqui: o hook só será executado quando rodadaAtualId for um bigint
    query: { enabled: typeof rodadaAtualId === 'bigint' }
  });

  // 3. Buscamos as taxas acumuladas (essa chamada é independente e estava certa)
  const { data: taxasAcumuladas } = useReadContract({
    address: bettingContractAddress,
    abi: bettingContractABI,
    functionName: 'taxasAcumuladas',
  });

  // Extraímos o total arrecadado do resultado de getRodadaInfoBasica
  // A ordem do retorno é: [id, status, ticketPrice, totalArrecadado, ...] -> índice 3
  const totalArrecadadoDaRodada = rodadaInfo ? rodadaInfo[3] : undefined;

  const formatValue = (value?: bigint) => {
    if (typeof value !== 'bigint') return '...';
    return `${Number(value) / 1e18} ETH`;
  };

  return (
    <div className="w-full max-w-md bg-slate-800/50 p-6 rounded-2xl border border-slate-700 text-sm">
      <h3 className="text-lg font-bold text-center mb-4 text-white">Informações do Contrato</h3>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="font-semibold text-slate-300">Endereço:</span>
          <span className="font-mono text-cyan-400">{formatAddress(bettingContractAddress)}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold text-slate-300">Rodada Atual ID:</span>
          <span className="font-mono text-white">{rodadaAtualId?.toString() ?? '...'}</span>
        </div>
        <div className="flex justify-between">
          {/* ✅ CORREÇÃO: Mostrando o valor da rodada atual */}
          <span className="font-semibold text-slate-300">Arrecadado (Rodada Atual):</span>
          <span className="font-mono text-white">{formatValue(totalArrecadadoDaRodada)}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold text-slate-300">Taxas Acumuladas:</span>
          <span className="font-mono text-white">{formatValue(taxasAcumuladas)}</span>
        </div>
      </div>
    </div>
  );
}