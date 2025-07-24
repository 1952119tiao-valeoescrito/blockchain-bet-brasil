'use client';

// ... (seus imports continuam os mesmos)
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { contractAbi } from '@/contracts/abi';
import { contractAddress } from '@/contracts/address';
import { sepolia } from 'wagmi/chains';
import { parseEther } from 'viem';
import { RodadaInfo } from '@/types';

type AdminPanelProps = {
  isSubmitting: boolean;
  setIsSubmitting: (isSubmitting: boolean) => void;
  setUiMessage: (message: string | null) => void;
  setUiMessageType: (type: 'success' | 'error' | 'info' | null) => void;
  refreshContractData: () => Promise<void>;
  isPaused: boolean | undefined; // <-- Permitir undefined
  currentRoundId: bigint | undefined; // <-- Permitir undefined
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
  const { data: hash, writeContract, isPending, error } = useWriteContract();

  // ... (o hook useWaitForTransactionReceipt continua o mesmo)
  const { isLoading: isConfirming } = 
    useWaitForTransactionReceipt({ 
      hash,
      onSuccess: async () => { /* ... */ },
      onError: (err) => { /* ... */ }
    });
  
  // ... (a função handleWrite continua a mesma)
  const handleWrite = async (functionName: string, message: string, args?: any[]) => { /* ... */ };
  const handleStartRound = () => { /* ... */ };
  const handlePauseContract = () => { /* ... */ };
  const handleUnpauseContract = () => { /* ... */ };

  // --- LÓGICA DE DESABILITAÇÃO REFINADA ---

  // O botão de Pausa/Retomada deve estar desabilitado se a gente ainda não sabe o estado (isPaused === undefined)
  const isPauseButtonDisabled = isSubmitting || isPaused === undefined;
  
  // A condição para iniciar uma nova rodada agora é mais rigorosa.
  // A gente só pode iniciar se:
  // 1. O contrato NÃO está pausado (isPaused === false)
  // 2. A rodada atual JÁ foi carregada e está Fechada (roundInfo.status === 2)
  //    OU se ainda não existe rodada (currentRoundId === 0n).
  const canStartNewRound = 
    isPaused === false && 
    (
      (roundInfo && roundInfo.status === 2) || 
      currentRoundId === 0n
    );
  
  const isStartButtonDisabled = isSubmitting || !canStartNewRound;
  
  return (
    <div className="w-full p-6 bg-slate-800/50 rounded-lg border border-slate-700">
      <h3 className="text-xl font-bold text-center text-slate-100 mb-4">Painel do Administrador</h3>
      
      {/* ... (a parte de mensagens de status continua a mesma) */}
      
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
        {/* Botão para Pausar/Retomar o Contrato */}
        {isPaused ? (
          <button
            onClick={handleUnpauseContract}
            disabled={isPauseButtonDisabled} // <-- Usando a nova lógica
            className="w-full sm:w-auto px-6 py-2 font-semibold text-white bg-emerald-600 rounded-md hover:bg-emerald-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
          >
            Reativar Contrato
          </button>
        ) : (
          <button
            onClick={handlePauseContract}
            disabled={isPauseButtonDisabled} // <-- Usando a nova lógica
            className="w-full sm:w-auto px-6 py-2 font-semibold text-white bg-amber-600 rounded-md hover:bg-amber-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
          >
            Pausar Contrato
          </button>
        )}

        {/* Botão para Iniciar Nova Rodada */}
        <button
          onClick={handleStartRound}
          disabled={isStartButtonDisabled} // <-- Usando a nova lógica
          className="w-full sm:w-auto px-6 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
        >
          Iniciar Nova Rodada
        </button>
      </div>

      {/* ... (a ajuda contextual continua a mesma) */}
    </div>
  );
};