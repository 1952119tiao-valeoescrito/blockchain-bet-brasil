// Caminho: /src/hooks/useLotteryAdmin.ts
'use client';

import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { Address, parseUnits } from 'viem';
import toast from 'react-hot-toast';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

// Assumindo que a ABI está em um hook centralizado ou importada
import { contractABI, contractAddress } from '@/constants'; 

export function useLotteryAdmin() {
  const t = useTranslations('Notifications');
  const tAdmin = useTranslations('AdminPanel');
  const { address: userAddress } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const [isBusy, setIsBusy] = useState(false);

  // --- LEITURA DE DADOS ---
  const { data: ownerAddress, isLoading: isOwnerLoading } = useReadContract({ /* ... */ });
  const { data: rodadaAtualId, isLoading: isIdLoading } = useReadContract({ /* ... */ });
  const { data: taxaAtual, isLoading: isTaxaLoading } = useReadContract({ /* ... */ });
  const { data: roundInfo, isLoading: isRoundInfoLoading, refetch: refetchRoundInfo } = useReadContract({ /* ... */ });
  const isOwner = userAddress && ownerAddress && userAddress.toLowerCase() === ownerAddress.toLowerCase();

  // --- FUNÇÃO DE ESCRITA GENÉRICA ---
  const genericWrite = async (functionName: string, args: any[], messages: { loading: string, success: string }) => {
    if (!isOwner) return toast.error(tAdmin('error_not_admin'));
    setIsBusy(true);
    await toast.promise(
      writeContractAsync({ address: contractAddress, abi: contractABI, functionName, args }),
      { loading: messages.loading, success: messages.success, error: (err: any) => { /* ... */ } }
    );
    refetchRoundInfo(); // Recarrega informações da rodada após qualquer ação
    setIsBusy(false);
  };

  // --- FUNÇÕES ESPECÍFICAS ---
  const iniciarNovaRodada = (ticketPrice: string) => { /* ... */ };
  
  const fecharApostas = (roundId: bigint) => {
    genericWrite('fecharApostas', [roundId], {
      loading: tAdmin('toast_close_loading'),
      success: tAdmin('toast_close_success')
    });
  };

  const registrarResultados = (roundId: bigint, milhares: string[]) => {
    genericWrite('registrarResultadosDaFederalEProcessar', [roundId, milhares], {
      loading: tAdmin('toast_results_loading'),
      success: tAdmin('toast_results_success')
    });
  };

  const setTaxaPlataforma = (novaTaxa: number) => { /* ... */ };

  const transferOwnership = (newOwner: Address) => {
    genericWrite('transferOwnership', [newOwner], {
      loading: tAdmin('toast_owner_loading'),
      success: tAdmin('toast_owner_success')
    });
  };

  return {
    isOwner, rodadaAtualId, taxaAtual, roundInfo, isBusy,
    isLoading: isOwnerLoading || isIdLoading || isTaxaLoading || isRoundInfoLoading,
    iniciarNovaRodada, fecharApostas, registrarResultados, setTaxaPlataforma, transferOwnership
  };
}