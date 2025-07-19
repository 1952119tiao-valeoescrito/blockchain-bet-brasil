// src/components/ContractInfo.tsx - VERSÃO CORRIGIDA (SE FOSSE MANTIDO)

'use client';

// 1. Hook 'useReadContract' (o correto) em vez de 'useContractRead'.
import { useReadContract } from 'wagmi'; 
// 2. Importação da nossa fonte única da verdade.
import { BlockchainBetBrasilAddress, BlockchainBetBrasilAbi } from '@/contracts'; 

// Helper para formatar o endereço (continua útil)
const formatAddress = (addr?: string) => {
  if (!addr) return null;
  return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
};

export function ContractInfo() {
  // 3. Usando a sintaxe correta do hook e as variáveis importadas corretamente.
  const { data: owner, isLoading } = useReadContract({ 
    address: BlockchainBetBrasilAddress, 
    abi: BlockchainBetBrasilAbi, 
    functionName: 'owner' 
  });
 
  if (isLoading) {
    return (
        <div className="text-center text-xs text-slate-500 animate-pulse mb-4">
            Carregando informações do contrato...
        </div>
    );
  }

  return (
    <div className="flex items-center justify-center space-x-4 text-xs text-slate-500 border border-slate-800 bg-slate-900/50 rounded-full px-4 py-2">
      <span>Contrato</span>
      {/* 4. Usando a variável importada diretamente. */}
      <span className="text-slate-400 font-mono">{formatAddress(BlockchainBetBrasilAddress)}</span>
      <span className="text-slate-700">|</span>
      <span>Dono</span>
      <span className="text-slate-400 font-mono">{formatAddress(owner as string)}</span>
    </div>
  );
}