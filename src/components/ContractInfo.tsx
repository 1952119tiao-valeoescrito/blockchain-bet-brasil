// CÓDIGO CORRIGIDO para: src/components/ContractInfo.tsx

"use client";
import { useAccount } from 'wagmi';

export default function ContractInfo() {
  const { address } = useAccount();

  return (
    <div className="bg-slate-800/50 p-4 rounded-lg shadow-md text-center">
      <h3 className="text-lg font-semibold text-blue-400 mb-2">Informações da Carteira</h3>
      {address ? (
        <div>
          <p className="text-sm text-slate-300">Conectado como:</p>
          <p className="font-mono text-sm text-green-400 break-all" title={address}>{address}</p>
        </div>
      ) : (
        <p className="text-slate-400">Carteira não conectada</p>
      )}
    </div>
  );
}