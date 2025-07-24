// src/components/ConnectionStatus.tsx
'use client';

import { useAccount, useBalance } from 'wagmi';
import { ConnectKitButton } from 'connectkit';

export function ConnectionStatus() {
  const { address, isConnecting, isConnected } = useAccount();
  const { data: balance, isLoading: isLoadingBalance } = useBalance({ address });

  // Se não estiver conectado nem tentando conectar, mostra o botão principal
  if (!isConnected && !isConnecting) {
    return (
      <div className="w-full p-4 text-center bg-slate-800 rounded-md border border-slate-700">
        <p className="mb-4 text-slate-300">Conecte sua carteira para começar.</p>
        <ConnectKitButton />
      </div>
    );
  }

  // Se estiver no processo de conexão, mostra uma mensagem de status
  if (isConnecting) {
    return (
      <div className="w-full p-3 bg-blue-500/10 text-blue-300 rounded-md border border-blue-500/30 text-center animate-pulse">
        Conectando carteira...
      </div>
    );
  }

  // Se já estiver conectado, mostra o endereço e o saldo
  return (
    <div className="w-full p-3 bg-green-500/10 text-green-300 rounded-md border border-green-500/30">
      <p className="text-sm">
        <strong>Carteira:</strong> {address}
        <span className="ml-2 text-xs text-green-400/70">
          (
          {isLoadingBalance
            ? 'Carregando saldo...'
            : `${parseFloat(balance?.formatted || '0').toFixed(4)} ${balance?.symbol}`}
          )
        </span>
      </p>
    </div>
  );
}