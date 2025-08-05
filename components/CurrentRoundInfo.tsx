// components/CurrentRoundInfo.tsx (VERSÃO MELHORADA COM O NOVO VISUAL)

'use client';

import { formatEther } from 'viem';
import { RodadaInfo } from '@/types';

// Definindo as props que o componente continuará recebendo
type CurrentRoundInfoProps = {
  isLoading: boolean;
  roundInfo: RodadaInfo | null;
  currentRoundId: bigint | undefined;
};

// O sub-componente InfoRow do seu novo arquivo - excelente!
const InfoRow = ({ label, value, isLoading }: { label: string, value: string | number, isLoading: boolean }) => (
  <div className="flex justify-between items-center text-lg py-1">
    <span className="font-semibold text-gray-300">{label}:</span>
    {isLoading ? (
      <span className="h-6 w-24 bg-slate-700 rounded-md animate-pulse"></span>
    ) : (
      <span className="font-bold text-cyan-400 text-xl">{value}</span>
    )}
  </div>
);


export function CurrentRoundInfo({ isLoading, roundInfo, currentRoundId }: CurrentRoundInfoProps) {
  
  // Se ainda não temos informação nenhuma, mostramos o estado de carregamento
  if (isLoading && !roundInfo) {
    return (
      <div className="w-full max-w-md mx-auto p-4 bg-slate-800/50 rounded-md border border-slate-700 space-y-2">
        <InfoRow label="Rodada Atual" value="" isLoading={true} />
        <InfoRow label="Status" value="" isLoading={true} />
        <InfoRow label="Total Arrecadado" value="" isLoading={true} />
      </div>
    );
  }

  // Se já sabemos que não há rodada ativa
  if (!isLoading && (!currentRoundId || currentRoundId === 0n)) {
    return (
      <div className="w-full max-w-md mx-auto p-4 bg-yellow-900/50 rounded-md border border-yellow-700 text-center">
        <h3 className="font-bold text-yellow-400">Nenhuma rodada aberta no momento.</h3>
        <p className="text-sm text-yellow-500 mt-1">Aguarde o administrador iniciar uma nova rodada.</p>
      </div>
    );
  }
  
  // Se temos os dados da rodada, formatamos e exibimos
  const id = currentRoundId?.toString() ?? '#';
  const totalArrecadado = roundInfo ? formatEther(roundInfo.totalArrecadado) : '0';
  const rodadaStatusMap = ['Inexistente', 'Aberta', 'Fechada', 'Processando', 'Paga'];
  const statusTexto = roundInfo ? rodadaStatusMap[roundInfo.status] : 'Carregando...';

  return (
    <div className="w-full max-w-md mx-auto p-4 bg-slate-800/50 rounded-md border border-slate-700 space-y-2">
      <InfoRow label="Rodada Atual" value={`#${id}`} isLoading={isLoading} />
      <InfoRow label="Status" value={statusTexto} isLoading={isLoading} />
      <InfoRow label="Total na Rodada" value={`${totalArrecadado} ETH`} isLoading={isLoading} />
    </div>
  );
}