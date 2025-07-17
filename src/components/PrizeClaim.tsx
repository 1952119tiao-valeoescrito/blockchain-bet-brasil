// src/components/PrizeClaim.tsx

"use client";

import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { BlockchainBetBrasilAddress, BlockchainBetBrasilABI } from '@/contracts'; 

interface PrizeClaimProps {
  rodadaId: number;
}

const PrizeClaim = ({ rodadaId }: PrizeClaimProps) => {
  const { address, isConnected } = useAccount();

  // 1. Verifica se a rodada atual já está em fase de pagamento
  const { data: infoBasica } = useReadContract({
    address: BlockchainBetBrasilAddress,
    abi: BlockchainBetBrasilABI,
    functionName: 'getRodadaInfoBasica',
    args: [BigInt(rodadaId)],
    query: { enabled: rodadaId > 0 }
  });

  const statusRodada = infoBasica ? Number(infoBasica[1]) : 0;
  const podeReivindicar = statusRodada >= 3; // 3: RESULTADO_DISPONIVEL, 4: PAGA

  // 2. Busca o prêmio do usuário conectado
  const { data: premio, isLoading: loadingPremio } = useReadContract({
    address: BlockchainBetBrasilAddress,
    abi: BlockchainBetBrasilABI,
    functionName: 'getPremioParaReivindicar',
    args: [BigInt(rodadaId), address],
    query: { enabled: isConnected && rodadaId > 0 && podeReivindicar } // Só busca se for relevante
  });

  // 3. Verifica se o prêmio já foi sacado
  const { data: foiReivindicado, isLoading: loadingReivindicado } = useReadContract({
    address: BlockchainBetBrasilAddress,
    abi: BlockchainBetBrasilABI,
    functionName: 'checarSePremioFoiReivindicado',
    args: [BigInt(rodadaId), address],
    query: { enabled: isConnected && rodadaId > 0 && podeReivindicar }
  });

  // Hooks para a transação de saque
  const { data: hash, writeContract, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = 
    useWaitForTransactionReceipt({ hash });

  const handleClaim = () => {
    writeContract({
      address: BlockchainBetBrasilAddress,
      abi: BlockchainBetBrasilABI,
      functionName: 'reivindicarPremio',
      args: [BigInt(rodadaId)],
    });
  };

  // Não mostra nada se não estiver conectado ou a rodada não estiver na fase certa
  if (!isConnected || !podeReivindicar || loadingPremio || loadingReivindicado) {
    return null;
  }

  // Se tem prêmio e ainda não foi sacado, mostra o botão
  if (premio && Number(premio) > 0 && !foiReivindicado) {
    const valorPremioEmMatic = Number(premio) / 1e18;

    return (
      <div className="w-full max-w-md mx-auto bg-green-900/50 border-2 border-green-500 rounded-lg p-6 text-center shadow-lg">
        <h3 className="text-2xl font-bold text-white">🎉 Parabéns, você ganhou! 🎉</h3>
        <p className="text-gray-200 mt-2">Você tem um prêmio para resgatar na rodada #{rodadaId}:</p>
        <p className="text-4xl font-bold text-yellow-400 my-4">{valorPremioEmMatic.toFixed(4)} MATIC</p>
        <button
          onClick={handleClaim}
          disabled={isPending || isConfirming || isConfirmed}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-4 rounded-md transition-all disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
          {isPending && 'Aguardando na carteira...'}
          {isConfirming && 'Confirmando o resgate...'}
          {isConfirmed && 'Prêmio Resgatado com Sucesso!'}
          {!isPending && !isConfirming && !isConfirmed && 'RESGATAR MEU PRÊMIO'}
        </button>
      </div>
    );
  }

  // Se já sacou, mostra uma mensagem de confirmação
  if (premio && Number(premio) > 0 && foiReivindicado) {
    return (
      <div className="w-full max-w-md mx-auto bg-gray-800/50 border border-gray-700 rounded-lg p-6 text-center">
          <h3 className="text-xl font-bold text-green-400">Prêmio da Rodada #{rodadaId} já foi resgatado.</h3>
          <p className="text-gray-300 mt-2">O valor já está na sua carteira. Bom proveito!</p>
      </div>
    );
  }

  // Se não ganhou nada na rodada, não mostra nada para não poluir a tela.
  return null;
};

export default PrizeClaim;