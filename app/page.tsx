// app/page.tsx (VERSÃO ATUALIZADA COM ContractDetails)

'use client';

import { useAccount, useReadContract } from 'wagmi';
import BettingForm from '@/components/BettingForm';
import { WelcomeScreen } from '@/components/WelcomeScreen';
import { ContractDetails } from '@/components/ContractDetails'; // Importar o novo componente
import { contractAddress, contractABI } from '@/constants';
import { RodadaInfo } from '@/types'; // Importar o tipo RodadaInfo

export default function HomePage() {
  const { isConnected } = useAccount();

  // --- Hooks para ler dados do contrato para o ContractDetails ---
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

  const { data: ticketPriceBase, isLoading: isLoadingTicketPriceBase } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'ticketPrice', // Nome da função no contrato
  });

  const { data: currentFeeBps, isLoading: isLoadingFeeBps } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'taxaAdministracaoBPS', // Nome da função no contrato
  });

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
      enabled: !!rodadaAtualId && rodadaAtualId > 0n,
    },
  }) as { data: RodadaInfo | null; isLoading: boolean };

  // Mapear o status numérico para uma string legível
  const getRoundStatusString = (status?: number): string | undefined => {
    switch (status) {
      case 0: return 'Inexistente';
      case 1: return 'Aberta';
      case 2: return 'Fechada';
      case 3: return 'Resultados Disponíveis';
      case 4: return 'Prêmios Pagos';
      default: return undefined;
    }
  };

  const rodadaStatusString = getRoundStatusString(rawRoundInfo?.status);

  // Consideramos "carregando" se qualquer uma das leituras estiver carregando
  const isLoadingDetails = isLoadingOwner || isLoadingPaused || isLoadingTicketPriceBase || 
                           isLoadingFeeBps || isLoadingRodadaAtualId || isLoadingRoundInfo;

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
              owner={ownerAddress}
              isPaused={isPaused}
              ticketBase={ticketPriceBase}
              taxaPlataforma={currentFeeBps ? Number(currentFeeBps) / 100 : undefined}
              rodadaId={rodadaAtualId}
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