'use client';

// Imports do seu projeto
import { useState, useEffect } from 'react'; // Adicionado useEffect
// import { useWriteContract, useWaitForTransactionReceipt, useAccount, useReadContract } from 'wagmi'; // Adicionado useAccount e useReadContract
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
  const { data: hash, writeContract, isPending, error } = useWriteContract();

  // ==================================================================
  // =========== INÍCIO DO NOSSO DIAGNÓSTICO DE ACESSO ================
  // ==================================================================

  // 1. Pegando a carteira que está conectada no site
  const { address: connectedAddress } = useAccount();

  // 2. Lendo o endereço do "dono" que está registrado no Smart Contract
  const { data: ownerAddress } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: 'owner',
    chainId: sepolia.id,
  });

  // 3. useEffect para comparar os endereços assim que eles forem carregados
  useEffect(() => {
    // Só executa o diagnóstico se os dois endereços já foram recebidos
    if (ownerAddress && connectedAddress) {
      console.log("-------------------------------------------");
      console.log("DIAGNÓSTICO DE ACESSO - BlockchainBetBrasil");
      console.log("-------------------------------------------");
      console.log("DONO DO CONTRATO (registrado no deploy):", ownerAddress);
      console.log("CARTEIRA CONECTADA (usuário atual):", connectedAddress);
      console.log("-------------------------------------------");

      if (ownerAddress.toLowerCase() === connectedAddress.toLowerCase()) {
        console.log("%cVEREDITO: ACESSO PERMITIDO! ✅ As carteiras são as mesmas. Se ainda vê 'Acesso Negado', o problema está na lógica de exibição do componente e não na permissão.", "color: green; font-weight: bold; font-size: 14px;");
      } else {
        console.log("%cVeredito: ACESSO NEGADO! ❌ As carteiras são diferentes. Essa é a causa do problema.", "color: red; font-weight: bold; font-size: 14px;");
      }
    }
  }, [ownerAddress, connectedAddress]); // Roda essa lógica sempre que um dos endereços mudar

  // ==================================================================
  // ============ FIM DO NOSSO DIAGNÓSTICO DE ACESSO ==================
  // ==================================================================

  const { isLoading: isConfirming } =
    useWaitForTransactionReceipt({
      hash,
      onSuccess: async () => { /* ... */ },
      onError: (err) => { /* ... */ }
    });

  const handleWrite = async (functionName: string, message: string, args?: any[]) => { /* ... */ };
  const handleStartRound = () => { /* ... */ };
  const handlePauseContract = () => { /* ... */ };
  const handleUnpauseContract = () => { /* ... */ };

  const isPauseButtonDisabled = isSubmitting || isPaused === undefined;
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
      
      {/* O resto do seu componente continua exatamente o mesmo... */}
      
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
        {isPaused ? (
          <button
            onClick={handleUnpauseContract}
            disabled={isPauseButtonDisabled}
            className="w-full sm:w-auto px-6 py-2 font-semibold text-white bg-emerald-600 rounded-md hover:bg-emerald-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
          >
            Reativar Contrato
          </button>
        ) : (
          <button
            onClick={handlePauseContract}
            disabled={isPauseButtonDisabled}
            className="w-full sm:w-auto px-6 py-2 font-semibold text-white bg-amber-600 rounded-md hover:bg-amber-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
          >
            Pausar Contrato
          </button>
        )}

        <button
          onClick={handleStartRound}
          disabled={isStartButtonDisabled}
          className="w-full sm:w-auto px-6 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
        >
          Iniciar Nova Rodada
        </button>
      </div>
    </div>
  );
};