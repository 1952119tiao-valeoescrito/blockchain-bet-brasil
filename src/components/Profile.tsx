// src/components/Profile.tsx - VERSÃO CORRIGIDA E ALINHADA COM O TIME

'use client';

import { useAccount, useBalance } from 'wagmi';
// ✅ CORREÇÃO: Importando do lugar certo. Não precisamos mais do ABI nem do endereço aqui.
// O componente de perfil só precisa saber do usuário, não do contrato.

// Helper para formatar o endereço
const formatAddress = (addr?: `0x${string}`) => {
  if (!addr) return '...';
  return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
};

// Helper para formatar o saldo
const formatBalance = (balance?: { formatted: string; symbol: string }) => {
    if (!balance) return '...';
    // Pega os primeiros 6 dígitos significativos do saldo
    const value = parseFloat(balance.formatted).toPrecision(6);
    return `${value} ${balance.symbol}`;
}

export function Profile() {
  const { address, isConnected } = useAccount();
  
  // Hook do wagmi para buscar o saldo do endereço conectado
  const { data: balance, isLoading } = useBalance({
    address,
    // O query.enabled garante que a busca só aconteça se o usuário estiver conectado
    query: {
        enabled: isConnected,
    }
  });

  if (!isConnected) {
    return (
        <div className="w-full max-w-md bg-slate-800/50 p-6 rounded-2xl border border-slate-700 text-sm">
            <p className="text-center text-yellow-400">Conecte sua carteira para ver seu perfil.</p>
        </div>
    );
  }

  return (
    <div className="w-full max-w-md bg-slate-800/50 p-6 rounded-2xl border border-slate-700 text-sm">
      <h3 className="text-lg font-bold text-center mb-4 text-white">Meu Perfil</h3>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="font-semibold text-slate-300">Endereço:</span>
          <span className="font-mono text-cyan-400">{formatAddress(address)}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold text-slate-300">Saldo:</span>
          {isLoading ? 
            <span className="font-mono text-white">Carregando...</span> :
            <span className="font-mono text-white">{formatBalance(balance)}</span>
          }
        </div>
      </div>
    </div>
  );
}