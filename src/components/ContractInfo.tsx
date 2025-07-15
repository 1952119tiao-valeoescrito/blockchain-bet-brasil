// src/components/ContractInfo.tsx
'use client';

import { useAccount, useContractRead } from 'wagmi';
import { contractAbi } from '@/contracts/abi';
import { contractAddress } from '@/contracts/address';

// Helper para formatar o endereço
const formatAddress = (addr?: string) => {
  if (!addr) return null; // Retorna nulo se não houver endereço
  return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
};

export function ContractInfo() {
  const { data: owner } = useContractRead({ address: contractAddress, abi: contractAbi, functionName: 'owner' });
  const { isConnected } = useAccount();

  // O componente só renderiza se o endereço do dono for carregado
  if (!owner) {
    return (
        <div className="text-center text-xs text-slate-500 animate-pulse mb-4">
            Carregando informações do contrato...
        </div>
    );
  }

  return (
    <div className="flex items-center justify-center space-x-4 text-xs text-slate-500 border border-slate-800 bg-slate-900/50 rounded-full px-4 py-2">
      <span>Contrato</span>
      <span className="text-slate-400 font-mono">{formatAddress(contractAddress)}</span>
      <span className="text-slate-700">|</span>
      <span>Dono</span>
      <span className="text-slate-400 font-mono">{formatAddress(owner as string)}</span>
    </div>
  );
}