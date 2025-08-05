// components/ConnectWallet.tsx

"use client";

import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';

export function ConnectWallet() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected) {
    return (
      <div className="flex items-center gap-4">
        <span className="hidden sm:block px-4 py-2 bg-gray-800 text-gray-300 rounded-lg font-mono">
          {`${address?.slice(0, 6)}...${address?.slice(-4)}`}
        </span>
        <button
          onClick={() => disconnect()}
          className="px-4 py-2 font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
        >
          Desconectar
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => connect({ connector: injected() })}
      className="px-6 py-2 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
    >
      Conectar Carteira
    </button>
  );
}