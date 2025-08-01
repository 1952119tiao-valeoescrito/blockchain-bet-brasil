// src/components/PrizeClaim.tsx - VERSÃO FINAL CORRIGIDA

'use client';

import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { BaseError } from 'viem';
// ✅ CORREÇÃO 1: Usando os nomes certos da nossa fonte da verdade.
import { bettingContractAddress, bettingContractABI } from '@/contracts';

type RodadaInfoBasicaType = readonly [bigint, number, bigint, bigint, bigint, bigint, bigint];

export default function PrizeClaim({ rodadaId }: { rodadaId: bigint | undefined }) {
  const { address, isConnected } = useAccount();
  const [uiMessage, setUiMessage] = useState<{ text: string, type: 'success' | 'error' | 'info' } | null>(null);

  // ✅ CORREÇÃO 2: Chamadas explícitas para cada hook, sem atalhos.
  const { data: infoBasica, isLoading: isLoadingInfo } = useReadContract({
    address: bettingContractAddress,
    abi: bettingContractABI,
    functionName: 'getRodadaInfoBasica',
    args: [rodadaId!],
    query: { enabled: !!rodadaId }
  });

  const typedInfoBasica = infoBasica as RodadaInfoBasicaType | undefined;
  const statusRodada = typedInfoBasica ? Number(typedInfoBasica[1]) : 0;
  const podeReivindicar = statusRodada === 3 || statusRodada === 4;

  const { data: premio, refetch: refetchPremio } = useReadContract({
    address: bettingContractAddress,
    abi: bettingContractABI,
    functionName: 'getPremioParaReivindicar',
    args: [rodadaId!, address!],
    query: { enabled: !!rodadaId && !!address && podeReivindicar }
  });

  const { data: foiReivindicado, refetch: refetchReivindicado } = useReadContract({
    address: bettingContractAddress,
    abi: bettingContractABI,
    functionName: 'checarSePremioFoiReivindicado',
    args: [rodadaId!, address!],
    query: { enabled: !!rodadaId && !!address && podeReivindicar }
  });
  
  const { data: hash, writeContract, isPending, error: writeError } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    if (isSuccess) {
      setUiMessage({ text: 'Prêmio recebido com sucesso!', type: 'success' });
      refetchPremio();
      refetchReivindicado();
    }
  }, [isSuccess, refetchPremio, refetchReivindicado]);

  useEffect(() => {
    if (writeError) {
        const msg = writeError.cause instanceof BaseError ? writeError.cause.shortMessage : (writeError.message || 'Ocorreu um erro.');
        setUiMessage({ text: msg, type: 'error' });
    }
  }, [writeError]);

  const handleReivindicar = () => {
    if (!rodadaId) return;
    setUiMessage({ text: 'Confirmando na carteira...', type: 'info' });
    // ✅ CORREÇÃO 3: Chamada explícita também para o writeContract.
    writeContract({
        address: bettingContractAddress,
        abi: bettingContractABI,
        functionName: 'reivindicarPremio',
        args: [rodadaId]
    });
  };

  const temPremio = premio && BigInt(premio.toString()) > 0;

  if (!isConnected || !podeReivindicar || !temPremio || isLoadingInfo || !address) {
    return null; 
  }

  if (foiReivindicado) {
    return <p className="text-center text-green-400 mt-4">Você já sacou seu prêmio para esta rodada!</p>;
  }

  return (
    <div className="mt-6 p-4 border border-cyan-500 rounded-lg text-center">
      <h3 className="text-xl font-bold text-cyan-300">🎉 Parabéns! Você tem um prêmio a receber!</h3>
      <button 
        onClick={handleReivindicar} 
        disabled={isPending || isConfirming}
        className="mt-4 py-2 px-6 rounded-lg font-bold text-slate-900 transition-all duration-200 bg-cyan-400 hover:bg-cyan-300 disabled:bg-slate-600"
      >
        {isPending || isConfirming ? 'Processando...' : 'Reivindicar Prêmio'}
      </button>
      {uiMessage && <p className={`mt-2 font-semibold ${uiMessage.type === 'error' ? 'text-red-400' : 'text-slate-300'}`}>{uiMessage.text}</p>}
    </div>
  );
}