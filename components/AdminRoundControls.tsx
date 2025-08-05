// components/AdminRoundControls.tsx

'use client';

import { formatEther } from 'viem';

// Definindo as props que este componente receberá
type AdminRoundControlsProps = {
  isSubmitting: boolean;
  handleWrite: (functionName: string, message: string, args?: any[]) => Promise<void>;
  availableFees: bigint | undefined; // Taxas disponíveis para saque
};

export default function AdminRoundControls({
  isSubmitting,
  handleWrite,
  availableFees,
}: AdminRoundControlsProps) {

  const handleWithdrawFees = () => {
    handleWrite('retirarTaxas', 'Iniciando o saque das taxas... Verifique a carteira.');
  };

  // Lógica para desabilitar o botão
  const canWithdraw = availableFees !== undefined && availableFees > 0n;
  const feesInEth = availableFees ? formatEther(availableFees) : '0.00';

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-slate-800/50 rounded-lg border border-slate-700">
      <h3 className="text-xl font-bold text-center text-slate-100 mb-6">Controles Financeiros</h3>

      <div className="flex flex-col md:flex-row items-center justify-center text-center p-4 bg-slate-900/50 rounded-md">
        <div className="flex-1 mb-4 md:mb-0">
          <p className="text-slate-400">Taxas acumuladas para saque:</p>
          <p className="text-2xl font-bold text-cyan-400">{feesInEth} ETH</p>
        </div>
        <button
          onClick={handleWithdrawFees}
          disabled={isSubmitting || !canWithdraw}
          className="btn-admin bg-cyan-600 hover:bg-cyan-700"
        >
          Retirar Taxas
        </button>
      </div>
    </div>
  );
}