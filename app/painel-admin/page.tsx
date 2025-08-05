// app/painel-admin/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { contractAddress, contractABI } from '@/constants';

// ======================================================================
// CORREÇÃO FINAL: Usando chaves {} para importações nomeadas
import { AdminRoundControls } from '@/components/AdminRoundControls';
import { AdminRegisterResults } from '@/components/AdminRegisterResults';
import { AdminSettings } from '@/components/AdminSettings';
// ======================================================================

const AdminDashboardPage = () => {
  const { address: connectedAddress, isConnected } = useAccount();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const { data: owner } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'owner',
  });

  const { data: currentFeeBps } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'taxaPlataformaPercentual',
  });

  const isOwner = connectedAddress === owner;

  if (!isClient) {
    return <div className="text-center p-10">Carregando...</div>;
  }

  if (!isConnected) {
    return (
      <div className="text-center p-10">
        <h2 className="text-2xl font-bold text-white">Acesso Restrito</h2>
        <p className="text-gray-400">Por favor, conecte sua carteira para acessar o painel de administração.</p>
      </div>
    );
  }

  if (!isOwner) {
    return (
      <div className="text-center p-10">
        <h2 className="text-2xl font-bold text-red-500">Acesso Negado</h2>
        <p className="text-gray-400">Você não tem permissão para visualizar esta página.</p>
      </div>
    );
  }

  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold mb-8 text-white text-center">Painel de Administração</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        <div className="space-y-8">
          <AdminRoundControls />
          <AdminRegisterResults />
        </div>

        <div className="space-y-8">
          <AdminSettings currentFeeBps={currentFeeBps as bigint | undefined} />
        </div>
        
      </div>
    </main>
  );
};

export default AdminDashboardPage;