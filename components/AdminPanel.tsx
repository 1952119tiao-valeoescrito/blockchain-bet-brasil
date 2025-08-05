// components/AdminPanel.tsx
'use client';

import { useState } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { contractABI, contractAddress } from '@/constants';
import { parseEther } from 'viem';
import { RodadaInfo } from '@/types';

type AdminPanelProps = {
  isSubmitting: boolean;
  setIsSubmitting: (isSubmitting: boolean) => void;
  setUiMessage: (message: string | null) => void;
  setUiMessageType: (type: 'success' | 'error' | 'info' | null) => void;
  refreshContractData: () => Promise<void>;
  isPaused: boolean | undefined;
  currentRoundId: bigint | undefined;
  roundInfo: RodadaInfo | null;
};

export const AdminPanel = ({
  isSubmitting,
  setIsSubmitting,
  setUiMessage,
  setUiMessageType,
  refreshContractData,
  isPaused,
  currentRoundId,
  roundInfo,
}: AdminPanelProps) => {
  const [newTicketPrice, setNewTicketPrice] = useState('0.01');
  const { data: hash, writeContract, isPending } = useWriteContract();

  const handleWrite = async (functionName: string, message: string, args?: any[]) => {
    setIsSubmitting(true);
    setUiMessage(message);
    setUiMessageType('info');

    writeContract({
      address: contractAddress,
      abi: contractABI,
      functionName: functionName,
      args: args || [],
    });
  };

  useWaitForTransactionReceipt({
    hash,
    onSuccess: async () => {
      setUiMessage('Transação confirmada! Atualizando dados...');
      setUiMessageType('success');
      await refreshContractData();
      setIsSubmitting(false);
    },
    onError: (err) => {
      setUiMessage(`Erro na confirmação: ${err.message}`);
      setUiMessageType('error');
      setIsSubmitting(false);
    },
  });

  const handleStartRound = () => {
    const priceInWei = parseEther(newTicketPrice);
    handleWrite('iniciarNovaRodada', 'Iniciando nova rodada... Verifique sua carteira.', [priceInWei]);
  };

  const handlePauseContract = () => {
    handleWrite('pausar', 'Pausando o contrato... Verifique sua carteira.');
  };

  const handleUnpauseContract = () => {
    handleWrite('despausar', 'Reativando o contrato... Verifique sua carteira.');
  };

  // --- LÓGICA DE DESABILITAÇÃO REFINADA ---
  const isPauseButtonDisabled = isSubmitting || isPaused === undefined;
  const canStartNewRound = isPaused === false && ((roundInfo && roundInfo.status === 2) || currentRoundId === 0n);
  const isStartButtonDisabled = isSubmitting || !canStartNewRound;
  
  const getHelpText = () => {
    if (isSubmitting) return "Aguardando confirmação da transação...";
    if (isPaused) return "O contrato está pausado. Reative para continuar.";
    if (!canStartNewRound && roundInfo?.status === 1) return "A rodada atual precisa ser fechada antes de iniciar uma nova.";
    if (!canStartNewRound) return "Não é possível iniciar uma nova rodada no momento.";
    return "Pronto para iniciar uma nova rodada.";
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-slate-800/50 rounded-lg border border-slate-700">
      <h3 className="text-xl font-bold text-center text-slate-100 mb-6">Painel do Administrador</h3>
      
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-4">
        {isPaused ? (
          <button onClick={handleUnpauseContract} disabled={isPauseButtonDisabled} className="btn-admin bg-emerald-600 hover:bg-emerald-700">
            Reativar Contrato
          </button>
        ) : (
          <button onClick={handlePauseContract} disabled={isPauseButtonDisabled} className="btn-admin bg-amber-600 hover:bg-amber-700">
            Pausar Contrato
          </button>
        )}
      </div>
      
      <div className="border-t border-slate-700 pt-4 mt-4">
        <div className='flex flex-col sm:flex-row items-center justify-center gap-4'>
            <input
              type="text"
              value={newTicketPrice}
              onChange={(e) => setNewTicketPrice(e.target.value)}
              placeholder="Preço em ETH (ex: 0.01)"
              className="input-admin"
              disabled={isStartButtonDisabled}
            />
            <button onClick={handleStartRound} disabled={isStartButtonDisabled} className="btn-admin bg-blue-600 hover:bg-blue-700">
              Iniciar Nova Rodada
            </button>
        </div>
      </div>
      
      <p className="text-center text-sm text-slate-400 mt-6 min-h-[20px]">
        {getHelpText()}
      </p>
    </div>
  );
};