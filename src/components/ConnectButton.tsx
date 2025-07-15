// src/components/ConnectButton.tsx

'use client';

import { useAccount, useConnect, useDisconnect } from 'wagmi';

export default function ConnectButton() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  // O conector do wagmi (MetaMask, etc.)
  const injectedConnector = connectors.find(c => c.id === 'injected');

  if (isConnected) {
    return (
      <div className="flex items-center gap-4">
        {/* Mostra o endereço da carteira de forma abreviada */}
        <span className="text-gray-300 font-mono text-sm">
          {`${address?.slice(0, 6)}...${address?.slice(-4)}`}
        </span>
        <button
          onClick={() => disconnect()}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition"
        >
          Desconectar
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => injectedConnector && connect({ connector: injectedConnector })}
      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition"
    >
      Conectar Carteira
    </button>
  );
}