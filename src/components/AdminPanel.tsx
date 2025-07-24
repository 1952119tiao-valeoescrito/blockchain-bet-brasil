// src/components/AdminPanel.tsx - VERSÃO FINAL CONSTRUÍDA

'use client';

// 1. FAXINA NOS IMPORTS: Mantemos só o que é usado de verdade.
import { useEffect } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { BlockchainBetBrasilAddress, BlockchainBetBrasilABI } from '@/contracts'; // Usando nossa fonte única
import { RodadaInfo } from '@/types';

// 2. PROPS: Exatamente como você definiu. Perfeito.
type AdminPanelProps = {
  isSubmitting: boolean;
  setIsSubmitting: (isSubmitting: boolean) => void;
  setUiMessage: (message: { text: string; type: 'success' | 'error' | 'info' }) => void;
  isPaused: boolean | undefined;
  currentRoundId: bigint | undefined;
  roundInfo: RodadaInfo | null;
};

// O nome do componente agora bate com o export.
export default function AdminPanel({
  isSubmitting,
  setIsSubmitting,
  setUiMessage,
  isPaused,
  currentRoundId,
  roundInfo,
}: AdminPanelProps) {
  
  // 3. HOOKS: Usamos as variáveis que o inspetor reclamou.
  const { data: hash, writeContractAsync, isPending, error: writeError } = useWriteContract();

  const { isLoading: isConfirming, isSuccess, error: receiptError } = 
    useWaitForTransactionReceipt({ hash });
  
  // 4. LÓGICA DE FEEDBACK REATIVA (O JEITO CERTO)
  useEffect(() => {
    if (isSuccess) {
      setUiMessage({ text: 'Ação executada com sucesso na blockchain!', type: 'success' });
      setIsSubmitting(false);
    }
    if (isError || writeError) {
        const error = receiptError || writeError;
        setUiMessage({ text: error.message || 'Ocorreu um erro.', type: 'error' });
        setIsSubmitting(false);
    }
  }, [isSuccess, isError, receiptError, writeError, setUiMessage, setIsSubmitting]);

  // 5. FUNÇÃO CENTRALIZADA: Agora a gente usa essa função.
  const handleWrite = async (functionName: string, message: string, args: unknown[] = []) => {
    setUiMessage({ text: message, type: 'info' });
    setIsSubmitting(true);
    try {
      await writeContractAsync({
        address: BlockchainBetBrasilAddress,
        abi: BlockchainBetBrasilABI,
        functionName,
        args,
      });
    } catch (err: any) {
        // O erro já é pego pelo 'writeError' do hook, mas temos um fallback.
        setUiMessage({ text: err.message || 'Erro ao enviar transação.', type: 'error' });
        setIsSubmitting(false);
    }
  };

  // Funções específicas que chamam a função central.
  const handleStartRound = () => handleWrite('startNewRound', 'Iniciando nova rodada...');
  const handlePauseContract = () => handleWrite('pause', 'Pausando o contrato...');
  const handleUnpauseContract = () => handleWrite('unpause', 'Reativando o contrato...');

  // --- SUA LÓGICA DE DESABILITAÇÃO (PERFEITA) ---
  const isProcessing = isPending || isConfirming || isSubmitting;
  const isPauseButtonDisabled = isProcessing || isPaused === undefined;
  
  const canStartNewRound = 
    isPaused === false && 
    ((roundInfo && roundInfo.status === 2) || currentRoundId === 0n);
  
  const isStartButtonDisabled = isProcessing || !canStartNewRound;
  
  return (
    <div className="w-full p-6 bg-slate-800/50 rounded-lg border border-slate-700">
      <h3 className="text-xl font-bold text-center text-slate-100 mb-4">Painel do Administrador</h3>
      
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
        {isPaused ? (
          <button
            onClick={handleUnpauseContract}
            disabled={isPauseButtonDisabled}
            className="w-full sm:w-auto px-6 py-2 font-semibold text-white bg-emerald-600 rounded-md hover:bg-emerald-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
          >
            {isProcessing ? 'Processando...' : 'Reativar Contrato'}
          </button>
        ) : (
          <button
            onClick={handlePauseContract}
            disabled={isPauseButtonDisabled}
            className="w-full sm:w-auto px-6 py-2 font-semibold text-white bg-amber-600 rounded-md hover:bg-amber-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
          >
            {isProcessing ? 'Processando...' : 'Pausar Contrato'}
          </button>
        )}

        <button
          onClick={handleStartRound}
          disabled={isStartButtonDisabled}
          className="w-full sm:w-auto px-6 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
        >
          {isProcessing ? 'Processando...' : 'Iniciar Nova Rodada'}
        </button>
      </div>
    </div>
  );
};