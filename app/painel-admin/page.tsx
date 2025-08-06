// app/painel-admin/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { contractAddress, contractABI } from '@/constants';

import AdminRoundControls from '@/components/AdminRoundControls';
import AdminRegisterResults from '@/components/AdminRegisterResults';
import AdminSettings from '@/components/AdminSettings';

const AdminDashboardPage = () => {
  const { address: connectedAddress, isConnected } = useAccount();
  const [isClient, setIsClient] = useState(false);
  
  // O hook 'useWriteContract' já nos dá o estado 'isPending'
  const { data: hash, error, isPending, writeContract } = useWriteContract();
  
  // Não precisamos mais de um useState manual para 'isSubmitting'
  // const [isSubmitting, setIsSubmitting] = useState(false);

  const handleWrite = async (
    functionName: any,
    message: string,
    args: any[] = []
  ) => {
    // setIsSubmitting(true); // Removido, pois 'isPending' já faz isso
    console.log(message); // Para debug
    writeContract({
      address: contractAddress,
      abi: contractABI,
      functionName: functionName,
      args: args as any,
    });
  };
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } = 
    useWaitForTransactionReceipt({ hash });

  // O useEffect pode ser simplificado ou usado para notificações (toasts)
  useEffect(() => {
    if (isConfirmed) {
      // Idealmente, mostrar uma notificação de sucesso aqui
      console.log("Transação confirmada!");
    }
    if (error) {
      // Idealmente, mostrar uma notificação de erro aqui
      console.error("Erro na transação:", error);
    }
  }, [isConfirmed, error]);


  const availableFees = [100, 200, 500];
  useEffect(() => { setIsClient(true); }, []);

  const { data: owner } = useReadContract({ address: contractAddress, abi: contractABI, functionName: 'owner' });
  const { data: currentFeeBps } = useReadContract({ address: contractAddress, abi: contractABI, functionName: 'taxaPlataformaPercentual' });
  
  const { data: rodadaAtualId } = useReadContract({ address: contractAddress, abi: contractABI, functionName: 'rodadaAtualId' });
  const { data: roundInfo } = useReadContract({ 
    address: contractAddress, 
    abi: contractABI, 
    functionName: 'rodadas', 
    args: [rodadaAtualId as bigint],
    query: { enabled: !!rodadaAtualId }
  });
  
  // Derivando um estado único de "ocupado" a partir dos hooks da wagmi
  // Isso cobre desde o clique no botão até a confirmação na blockchain
  const isBusy = isPending || isConfirming;
  const isOwner = connectedAddress === owner;

  if (!isClient || !isConnected) {
    return <div className="text-center py-10">Conectando carteira...</div>;
  }
  
  if (!isOwner) {
    return <div className="text-center py-10 text-red-500">Acesso negado. Esta área é restrita ao dono do contrato.</div>;
  }

  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold mb-8 text-white text-center">Painel de Administração</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-8">
          <AdminRoundControls 
            isSubmitting={isBusy} // Usando o estado derivado
            handleWrite={handleWrite}
            availableFees={availableFees}
          />
          <AdminRegisterResults 
            isSubmitting={isBusy} // Usando o estado derivado
            roundInfo={roundInfo as any}
            handleWrite={handleWrite}
          />
        </div>
        <div className="space-y-8">
          {/* ====================================================================== */}
          {/* AQUI ESTÁ A CORREÇÃO */}
          {/* ====================================================================== */}
          <AdminSettings 
            currentFeeBps={currentFeeBps as bigint | undefined}
            isSubmitting={isBusy} // Passando o estado de submissão
            handleWrite={handleWrite} // Passando a função de escrita
          />
        </div>
      </div>
    </main>
  );
};

export default AdminDashboardPage;