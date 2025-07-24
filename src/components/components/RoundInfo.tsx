// src/components/RoundInfo.tsx

'use client';

import { useReadContract } from 'wagmi';
import { formatEther } from 'viem';
import abi from '@/contracts/BlockChainBet.json';

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!;

// Um componente pequeno para exibir cada linha de informação
function InfoRow({ label, value, isLoading }: { label: string, value: string | number, isLoading: boolean }) {
  return (
    <div className="flex justify-between items-center text-lg py-1">
      <span className="font-semibold text-gray-300">{label}:</span>
      {isLoading ? (
        <span className="h-6 w-20 bg-gray-700 rounded-md animate-pulse"></span>
      ) : (
        <span className="font-bold text-blue-400 text-xl">{value}</span>
      )}
    </div>
  );
}

export function RoundInfo() {
  // 1. Primeira leitura: Pegar o ID da rodada atual.
  const { data: currentRoundId, isLoading: isLoadingId } = useReadContract({
    abi,
    address: contractAddress as `0x${string}`,
    functionName: 'rodadaAtualId',
    watch: true,
  });

  // 2. Segunda leitura: Usar o ID para pegar os detalhes da rodada.
  //    A propriedade `enabled` garante que esta chamada só aconteça se o ID for válido (> 0).
  const { data: roundData, isLoading: isLoadingInfo, error } = useReadContract({
    abi,
    address: contractAddress as `0x${string}`,
    functionName: 'getRodadaInfoBasica',
    args: [currentRoundId as bigint],
    // Só executa a chamada se currentRoundId for um número maior que 0
    enabled: !!currentRoundId && Number(currentRoundId) > 0,
    watch: true,
  });
  
  const isLoading = isLoadingId || (!!currentRoundId && isLoadingInfo);

  // Se a rodada atual for 0 ou não tiver sido iniciada.
  if (!isLoading && (!currentRoundId || Number(currentRoundId) === 0)) {
    return (
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 text-center text-gray-400">
            Nenhuma rodada aberta no momento.
        </div>
    );
  }

  // Se der erro na leitura (ex: rodada não existe)
  if (error) {
    return (
      <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 text-red-500 text-center">
        Não foi possível carregar informações da rodada. Tente atualizar a página ou verifique sua conexão.
      </div>
    );
  }

  // Extrai e formata os dados. O '??' serve como valor padrão enquanto carrega.
  const id = roundData?.[0]?.toString() ?? currentRoundId?.toString() ?? '#';
  const totalArrecadado = typeof roundData?.[3] === 'bigint' ? formatEther(roundData[3]) : '0';
  
  return (
    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 space-y-2">
      <InfoRow label="Rodada Atual" value={id} isLoading={isLoading} />
      <InfoRow label="Valor Total na Rodada" value={`${totalArrecadado} MATIC`} isLoading={isLoading} />
      {/* Você pode adicionar mais dados de 'getRodadaInfoBasica' aqui no futuro */}
    </div>
  );
}