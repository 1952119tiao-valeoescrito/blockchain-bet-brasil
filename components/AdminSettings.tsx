// components/AdminSettings.tsx

'use client';

import { useState } from 'react';

// Definindo as props que o componente receberá
type AdminSettingsProps = {
  isSubmitting: boolean;
  handleWrite: (functionName: string, message: string, args?: any[]) => Promise<void>;
  currentFeeBps: bigint | undefined; // Taxa atual em Basis Points (ex: 500 para 5%)
};

export default function AdminSettings({
  isSubmitting,
  handleWrite,
  currentFeeBps,
}: AdminSettingsProps) {

  const [newFee, setNewFee] = useState('');
  const [newOwnerAddress, setNewOwnerAddress] = useState('');

  const handleSetFee = () => {
    // A função no contrato provavelmente espera um uint, ex: 500 para 5%
    const feeBps = parseInt(newFee, 10);
    if (isNaN(feeBps)) {
        alert("Valor da taxa inválido.");
        return;
    }
    handleWrite('setTaxaPlataforma', `Alterando taxa para ${newFee} BPS...`, [feeBps]);
  };

  const handleTransferOwnership = () => {
    if (!newOwnerAddress.startsWith('0x') || newOwnerAddress.length !== 42) {
      alert("Endereço de carteira inválido.");
      return;
    }
    handleWrite('transferOwnership', 'Transferindo propriedade do contrato...', [newOwnerAddress]);
  };

  const currentFeePercent = currentFeeBps ? (Number(currentFeeBps) / 100).toFixed(2) : 'N/A';

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-slate-800/50 rounded-lg border border-slate-700">
      <h3 className="text-xl font-bold text-center text-slate-100 mb-6">Configurações Avançadas</h3>

      {/* Painel para Alterar Taxa */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-slate-900/50 rounded-md mb-6">
        <div>
          <h4 className="font-semibold">Taxa de Administração</h4>
          <p className="text-sm text-slate-400">Taxa atual: {currentFeePercent}%</p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newFee}
            onChange={(e) => setNewFee(e.target.value)}
            placeholder="Nova taxa (BPS)"
            className="input-admin w-36"
            disabled={isSubmitting}
          />
          <button
            onClick={handleSetFee}
            disabled={isSubmitting || !newFee}
            className="btn-admin bg-indigo-600 hover:bg-indigo-700"
          >
            Alterar
          </button>
        </div>
      </div>

      {/* Painel para Transferir Propriedade (Danger Zone) */}
      <div className="p-4 rounded-md border border-red-500/50 bg-red-900/20">
        <h4 className="font-semibold text-red-400">Transferir Propriedade</h4>
        <p className="text-xs text-amber-400 mb-2">ATENÇÃO: Esta ação é irreversível. Você perderá o acesso a todas as funções de administrador.</p>
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <input
            type="text"
            value={newOwnerAddress}
            onChange={(e) => setNewOwnerAddress(e.target.value)}
            placeholder="Endereço do novo dono"
            className="input-admin flex-grow"
            disabled={isSubmitting}
          />
          <button
            onClick={handleTransferOwnership}
            disabled={isSubmitting || !newOwnerAddress}
            className="btn-admin bg-red-600 hover:bg-red-700"
          >
            Transferir
          </button>
        </div>
      </div>
    </div>
  );
}