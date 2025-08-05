// app/apostas/page.tsx (VERSÃO FINAL E COMPLETA)

'use client';

import { useReadContract } from 'wagmi';
import BettingForm from '@/components/BettingForm';
import BlockchainBetBrasilTable from '@/components/BlockchainBetBrasilTable';
import { CurrentRoundInfo } from '@/components/CurrentRoundInfo';
import { RecentBets } from '@/components/RecentBets'; // 1. IMPORTAR O NOVO COMPONENTE
import { contractAddress, contractABI } from '@/constants';
import { RodadaInfo } from '@/types';

export default function ApostasPage() {

  // --- BUSCANDO DADOS DA RODADA ---
  const { data: currentRoundId, isLoading: isLoadingId } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'rodadaAtualId',
  });

  const { data: roundInfo, isLoading: isLoadingInfo } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'rodadas',
    args: [currentRoundId as bigint],
    query: {
      enabled: !!currentRoundId && currentRoundId > 0n,
    },
  }) as { data: RodadaInfo | null, isLoading: boolean };

  const isLoading = isLoadingId || isLoadingInfo;

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-16">
      
      {/* Container para a parte superior da página (Informações e Formulário) */}
      <div className="flex flex-col items-center gap-12">
        <CurrentRoundInfo 
          isLoading={isLoading}
          currentRoundId={currentRoundId as bigint | undefined}
          roundInfo={roundInfo}
        />
        <BettingForm />
      </div>

      {/* 2. ADICIONAR O FEED DE APOSTAS AQUI, PASSANDO O ID DA RODADA */}
      <RecentBets currentRoundId={currentRoundId as bigint | undefined} />
      
      {/* Tabela de Referência Completa */}
      <div className="flex justify-center">
        <BlockchainBetBrasilTable />
      </div>
    </div>
  );
}