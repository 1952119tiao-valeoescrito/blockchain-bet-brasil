// src/components/AdminRoundResults.tsx

"use client";

import { useReadContract } from 'wagmi';
import { BlockchainBetBrasilAddress, BlockchainBetBrasilABI } from '../constants/constants';

interface AdminRoundResultsProps {
  rodadaId: number;
}

const AdminRoundResults = ({ rodadaId }: AdminRoundResultsProps) => {
  // Busca as informações básicas da rodada
  const { data: infoBasica, isLoading: loadingInfo } = useReadContract({
    address: BlockchainBetBrasilAddress,
    abi: BlockchainBetBrasilABI,
    functionName: 'getRodadaInfoBasica',
    args: [BigInt(rodadaId)],
    query: { enabled: rodadaId > 0 } // Só busca se a rodadaId for válida
  });

  // Busca os resultados (prognósticos vencedores)
  const { data: resultados, isLoading: loadingResultados } = useReadContract({
    address: BlockchainBetBrasilAddress,
    abi: BlockchainBetBrasilABI,
    functionName: 'getRodadaResultados',
    args: [BigInt(rodadaId)],
    query: { enabled: rodadaId > 0 && infoBasica && Number(infoBasica[1]) >= 3 } // Status >= 3 (RESULTADO_DISPONIVEL)
  });

  if (rodadaId === 0) return null;
  if (loadingInfo || loadingResultados) return <p className="text-gray-300">Carregando dados da apuração...</p>;

  // Se a rodada não tiver resultados processados ainda
  if (!resultados || !resultados[1]) { // resultados[1] é 'milharesForamInseridos'
    return <p className="text-yellow-400">Aguardando registro dos resultados para a rodada #{rodadaId}.</p>;
  }

  const [id, status, ticketPrice, totalArrecadado, premioTotal, numApostas, numVencedores] = infoBasica;
  const [milhares, inseridos, resultadosX, resultadosY] = resultados;

  const premioIndividual = numVencedores > 0 ? Number(premioTotal) / Number(numVencedores) : 0;
  
  return (
    <div className="w-full max-w-lg bg-slate-800/50 border border-slate-700 rounded-lg p-6 mt-8">
      <h3 className="text-xl font-bold text-white mb-4">Apuração da Rodada #{rodadaId}</h3>
      <div className="space-y-4">
        <div>
          <h4 className="font-semibold text-cyan-400">Prognósticos Vencedores (X/Y)</h4>
          <div className="flex flex-wrap gap-4 mt-2">
            {resultadosX.map((x, i) => (
              <span key={i} className="font-mono text-lg bg-slate-700 px-3 py-1 rounded-md">
                {Number(x)}/{Number(resultadosY[i])}
              </span>
            ))}
          </div>
        </div>
        <hr className="border-slate-600"/>
        <div>
            <h4 className="font-semibold text-cyan-400">Resumo do Prêmio</h4>
            <p>Total Arrecadado: {Number(totalArrecadado) / 1e18} MATIC</p>
            <p>Prêmio Total (após taxa): {Number(premioTotal) / 1e18} MATIC</p>
            <p>Número de Ganhadores: <strong>{Number(numVencedores)}</strong></p>
            {Number(numVencedores) > 0 && (
                <p>Prêmio por Ganhador: <strong>{premioIndividual / 1e18} MATIC</strong></p>
            )}
            {Number(numVencedores) === 0 && (
                <p className="text-yellow-400">Não houve vencedores nesta rodada. O prêmio acumulou para a plataforma.</p>
            )}
        </div>
      </div>
    </div>
  );
};

export default AdminRoundResults;