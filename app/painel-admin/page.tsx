// app/painel-admin/page.tsx (VERSÃO FINAL E COMPLETA)

"use client";

import { useEffect, useState, useCallback } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';

// Importando todos os nossos painéis de admin
import { AdminPanel } from '@/components/AdminPanel';
import AdminRegisterResults from '@/components/AdminRegisterResults';
import AdminRoundControls from '@/components/AdminRoundControls';
import AdminSettings from '@/components/AdminSettings';

// Importando nossos componentes e tipos de utilidade
import { UiMessageCard } from '@/components/UiMessageCard';
import { contractAddress, contractABI } from '@/constants';
import { RodadaInfo } from '@/types';

export default function PainelAdminPage() {
  // --- Estados da UI ---
  const { address: connectedAddress } = useAccount();
  const [isClient, setIsClient] = useState(false);
  const [uiMessage, setUiMessage] = useState<string | null>(null);
  const [uiMessageType, setUiMessageType] = useState<'success' | 'error' | 'info' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Hooks de Leitura de Dados do Contrato ---
  // (Lendo todas as informações necessárias para os painéis filhos)
  const { data: owner } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'owner',
  });

  const { data: isPaused, refetch: refetchIsPaused } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'paused',
  });

  const { data: currentRoundId, refetch: refetchCurrentRoundId } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'rodadaAtualId',
  });
  
  const { data: roundInfo, refetch: refetchRoundInfo } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'rodadas',
    args: [currentRoundId as bigint],
    query: { enabled: !!currentRoundId && currentRoundId > 0n },
  }) as { data: RodadaInfo | null; refetch: () => Promise<any> };
  
  const { data: availableFees, refetch: refetchFees } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'taxasAcumuladas',
  });

  const { data: currentFeeBps, refetch: refetchFeeBps } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'taxaAdministracaoBPS',
  });
  
  const isOwner = connectedAddress === owner;

  useEffect(() => { setIsClient(true) }, []);

  // --- Função Central para Rebuscar Todos os Dados do Contrato ---
  const refreshContractData = useCallback(async () => {
    setUiMessage("Atualizando dados...");
    setUiMessageType('info');
    await Promise.all([
      refetchIsPaused(),
      refetchCurrentRoundId(),
      refetchRoundInfo(),
      refetchFees(),
      refetchFeeBps(),
    ]);
    setUiMessage(null);
  }, [refetchIsPaused, refetchCurrentRoundId, refetchRoundInfo, refetchFees, refetchFeeBps]);

  // --- Hooks Centrais de Escrita no Contrato ---
  const { data: hash, writeContract } = useWriteContract();

  const handleWrite = useCallback((functionName: string, message: string, args?: any[]) => {
    setIsSubmitting(true);
    setUiMessage(message);
    setUiMessageType('info');
    writeContract({
      address: contractAddress,
      abi: contractABI,
      functionName,
      args: args || [],
    });
  }, [writeContract]);
  
  useWaitForTransactionReceipt({
    hash,
    onSuccess: async () => {
      setUiMessage('Transação confirmada! Atualizando dados...');
      setUiMessageType('success');
      await refreshContractData();
      setIsSubmitting(false);
      setTimeout(() => setUiMessage(null), 3000);
    },
    onError: (err) => {
      const shortError = err.message.split('Reason:')[1] || err.message;
      setUiMessage(`Erro: ${shortError}`);
      setUiMessageType('error');
      setIsSubmitting(false);
    },
  });

  // --- Renderização da Página ---
  if (!isClient) return <div className="text-center py-10">Carregando Painel...</div>;
  if (!connectedAddress) return <p className="text-center text-yellow-500 py-10">Por favor, conecte sua carteira para acessar esta área.</p>;
  if (!isOwner) return <p className="text-center text-red-500 py-10">Acesso negado. Esta área é restrita ao administrador.</p>;

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8">
      
      <div className="w-full max-w-2xl mx-auto">
        <UiMessageCard message={uiMessage} type={uiMessageType} />
      </div>

      <AdminPanel
        isSubmitting={isSubmitting}
        isPaused={isPaused}
        currentRoundId={currentRoundId as bigint | undefined}
        roundInfo={roundInfo}
        handleWrite={handleWrite}
      />
      
      <AdminRegisterResults
        isSubmitting={isSubmitting}
        roundInfo={roundInfo}
        handleWrite={handleWrite}
      />

      <AdminRoundControls 
        isSubmitting={isSubmitting}
        handleWrite={handleWrite}
        availableFees={availableFees as bigint | undefined}
      />

      <AdminSettings
        isSubmitting={isSubmitting}
        handleWrite={handleWrite}
        currentFeeBps={currentFeeBps as bigint | undefined}
      />
    </div>
  );
}