// src/components/PrizeClaim.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { BlockchainBetBrasilABI, BlockchainBetBrasilAddress } from '@/constants'; // Ajuste o caminho se necessário

// Hook customizado para evitar chamadas excessivas à blockchain enquanto o usuário digita
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

const PrizeClaim = () => {
  const { address, isConnected } = useAccount();

  // 1. Estado para controlar o que o usuário digita no input
  const [inputRoundId, setInputRoundId] = useState('');
  const debouncedRoundId = useDebounce(inputRoundId, 500); // Aguarda 500ms após o usuário parar de digitar

  const rodadaId = debouncedRoundId ? BigInt(debouncedRoundId) : 0n;
  const isQueryEnabled = isConnected && rodadaId > 0n;

  // 2. Hooks de leitura adaptados para usar o ID "debounced"
  const { data: infoBasica } = useReadContract({
    address: BlockchainBetBrasilAddress,
    abi: BlockchainBetBrasilABI,
    functionName: 'rodadas', // Usando a leitura direta da struct
    args: [rodadaId],
    query: { enabled: isQueryEnabled }
  });

  const statusRodada = infoBasica ? Number(infoBasica[1]) : 0; // infoBasica[1] é o status
  const podeReivindicar = statusRodada >= 3; // 3: RESULTADO_DISPONIVEL, 4: PAGA

  const { data: premio, isLoading: loadingPremio } = useReadContract({
    // Adapte o nome da função se necessário. Estou assumindo que existe uma.
    address: BlockchainBetBrasilAddress,
    abi: BlockchainBetBrasilABI,
    functionName: 'getPremioParaReivindicar', 
    args: [rodadaId, address],
    query: { enabled: isQueryEnabled && podeReivindicar }
  });

  const { data: foiReivindicado, isLoading: loadingReivindicado } = useReadContract({
    // Adapte o nome da função se necessário.
    address: BlockchainBetBrasilAddress,
    abi: BlockchainBetBrasilABI,
    functionName: 'checarSePremioFoiReivindicado', 
    args: [rodadaId, address],
    query: { enabled: isQueryEnabled && podeReivindicar }
  });

  // 3. Hooks de escrita para a transação de saque (sem alterações)
  const { data: hash, writeContract, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = 
    useWaitForTransactionReceipt({ hash });

  const handleClaim = () => {
    writeContract({
      address: BlockchainBetBrasilAddress,
      abi: BlockchainBetBrasilABI,
      functionName: 'reivindicarPremio',
      args: [rodadaId],
    });
  };

  const renderContent = () => {
    if (!isQueryEnabled) return null;
    if (loadingPremio || loadingReivindicado) return <p className="text-center text-slate-400">Verificando prêmio...</p>;
    
    // Se tem prêmio e ainda não foi sacado
    if (premio && Number(premio) > 0 && !foiReivindicado) {
      const valorPremioEmMatic = Number(premio) / 1e18;
      return (
        <div className="w-full bg-green-900/50 border-2 border-green-500 rounded-lg p-6 text-center shadow-lg mt-4">
          <h3 className="text-2xl font-bold text-white">🎉 Parabéns, você ganhou! 🎉</h3>
          <p className="text-gray-200 mt-2">Você tem um prêmio para resgatar na rodada #{inputRoundId}:</p>
          <p className="text-4xl font-bold text-yellow-400 my-4">{valorPremioEmMatic.toFixed(4)} MATIC</p>
          <button
            onClick={handleClaim}
            disabled={isPending || isConfirming || isConfirmed}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-4 rounded-md transition-all disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            {isPending ? 'Aguardando na carteira...' : isConfirming ? 'Confirmando o resgate...' : isConfirmed ? 'Prêmio Resgatado!' : 'RESGATAR MEU PRÊMIO'}
          </button>
        </div>
      );
    }
    
    // Se já sacou
    if (premio && Number(premio) > 0 && foiReivindicado) {
      return (
        <div className="w-full bg-gray-800/50 border border-gray-700 rounded-lg p-6 text-center mt-4">
          <h3 className="text-xl font-bold text-green-400">Prêmio da Rodada #{inputRoundId} já foi resgatado.</h3>
        </div>
      );
    }

    // Se a rodada já pode pagar mas não há prêmio para o usuário
    if (podeReivindicar) {
      return (
         <div className="w-full bg-gray-800/50 border border-gray-700 rounded-lg p-6 text-center mt-4">
          <h3 className="text-xl font-bold text-slate-300">Nenhum prêmio encontrado para você na rodada #{inputRoundId}.</h3>
        </div>
      )
    }

    return null;
  }

  return (
    <div className="w-full p-4 bg-slate-800 rounded-md border border-slate-700">
      <h3 className="font-semibold mb-3 text-center text-slate-100">Verificar e Reivindicar Prêmio</h3>
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="flex items-center gap-2">
            <label htmlFor="roundId" className="text-sm text-slate-400">Digite o ID da Rodada:</label>
            <input
              id="roundId"
              type="number"
              value={inputRoundId}
              onChange={(e) => setInputRoundId(e.target.value)}
              placeholder="Ex: 1"
              className="w-28 bg-slate-900 border border-slate-600 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>
        {renderContent()}
      </div>
    </div>
  );
};

export default PrizeClaim;