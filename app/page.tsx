// app/page.tsx

'use client';

import { useAccount, useReadContract } from 'wagmi';
import BettingForm from '@/components/BettingForm';
import { WelcomeScreen } from '@/components/WelcomeScreen';
import { ContractDetails } from '@/components/ContractDetails';
import { contractAddress, contractABI } from '@/constants';
import { RodadaInfo } from '@/types';

// Função auxiliar para mapear o status da rodada para texto
const getRoundStatusString = (status?: number): string => {
  switch (status) {
    case 0: return 'Inexistente';
    case 1: return 'Aberta';
    case 2: return 'Fechada';
    case 3: return 'Resultados Disponíveis';
    case 4: return 'Prêmios Pagos';
    default: return 'Indefinido';
  }
};

export default function HomePage() {
  const { isConnected } = useAccount();

  // --- Hooks para ler dados do contrato ---

  const { data: ownerAddress, isLoading: isLoadingOwner } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'owner',
  });

  const { data: isPaused, isLoading: isLoadingPaused } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'paused',
  });

  // ======================================================================
  // CORREÇÃO #1: O nome correto da função, de acordo com seu ABI, é 'ticketPriceBase'
  const { data: ticketPriceBase, isLoading: isLoadingTicketPriceBase } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'ticketPriceBase',
  });
  // ======================================================================

  // ======================================================================
  // CORREÇÃO #2: O nome correto da função, de acordo com seu ABI, é 'taxaPlataformaPercentual'
  const { data: currentFeeBps, isLoading: isLoadingFeeBps } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'taxaPlataformaPercentual',
  });
  // ======================================================================

  const { data: rodadaAtualId, isLoading: isLoadingRodadaAtualId } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'rodadaAtualId',
  });

  const { data: rawRoundInfo, isLoading: isLoadingRoundInfo } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'rodadas',
    args: [rodadaAtualId as bigint],
    query: {
      enabled: typeof rodadaAtualId === 'bigint' && rodadaAtualId > 0n,
    },
  }) as { data: RodadaInfo | null; isLoading: boolean };

  const isLoadingDetails = 
    isLoadingOwner || 
    isLoadingPaused || 
    isLoadingTicketPriceBase || 
    isLoadingFeeBps || 
    isLoadingRodadaAtualId || 
    isLoadingRoundInfo;

  const rodadaStatusString = getRoundStatusString(rawRoundInfo?.status);

  return (
    <div className="py-12 md:py-20 flex justify-center w-full">
      { isConnected ? (
        <div className="flex flex-col md:flex-row items-start gap-8 w-full max-w-5xl px-4">
          <div className="flex-1 w-full">
            <BettingForm />
          </div>
          <div className="md:w-1/3 w-full">
            <ContractDetails
              isLoading={isLoadingDetails}
              owner={ownerAddress as `0x${string}` | undefined}
              isPaused={isPaused as boolean | undefined}
              ticketBase={ticketPriceBase as bigint | undefined}
              taxaPlataforma={typeof currentFeeBps === 'bigint' ? Number(currentFeeBps) / 100 : undefined}
              rodadaId={rodadaAtualId as bigint | undefined}
              rodadaStatus={rodadaStatusString}
            />
          </div>
        </div>
      ) : (
        <WelcomeScreen /> 
      )}
    </div>
  );
}