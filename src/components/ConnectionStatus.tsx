// src/components/ConnectionStatus.tsx - VERSÃO CORRIGIDA

'use client';

import { useAccount, useBalance } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit'; // Importação correta!

export function ConnectionStatus() {
  const { address, isConnecting, isConnected } = useAccount();
  const { data: balance } = useBalance({
    address: address,
  });

  if (isConnecting) return <div>Conectando...</div>;

  // A maneira mais simples e elegante de mostrar o botão
  // O ConnectButton do RainbowKit já lida com todos os estados (conectado, desconectado, rede errada, etc.)
  return (
    <div className="flex items-center space-x-4">
        <ConnectButton 
            showBalance={true} // Opcional: mostra o saldo
            chainStatus="icon" // Opcional: mostra o ícone da rede
            accountStatus="address" // Opcional: mostra o endereço completo ou avatar
        />
    </div>
  );
}