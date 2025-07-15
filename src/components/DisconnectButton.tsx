// src/components/DisconnectButton.tsx
'use client';

import { useDisconnect, useAccount } from 'wagmi';

export function DisconnectButton() {
  const { disconnect } = useDisconnect();
  const { isConnected } = useAccount();

  // Só mostra o botão se o usuário estiver conectado
  if (!isConnected) {
    return null;
  }

  return (
    <button
      onClick={() => disconnect()}
      className="bg-green-600 hover:bg-green-700 text-white rounded-md px-6 py-2 text-sm font-bold transition-colors"
    >
      Desconectar
    </button>
  );
}