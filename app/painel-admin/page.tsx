// app/painel-admin/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { contractAddress, contractABI } from '@/constants';

// Importando os sub-painéis (verifique se os caminhos estão corretos)
import { AdminRoundControls } from '@/components/AdminRoundControls';
import { AdminRegisterResults } from '@/components/AdminRegisterResults';
import { AdminSettings } from '@/components/AdminSettings';

const AdminDashboardPage = () => {
  const { address: connectedAddress, isConnected } = useAccount();
  const [isClient, setIsClient] = useState(false);

  // Lógica para evitar erros de hidratação no Next.js
  useEffect(() => {
    setIsClient(true);
  }, []);

  const { data: owner } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'owner',
  });

  // ======================================================================
  // CORREÇÃO FINAL: O nome correto da função é 'taxaPlataformaPercentual'
  const { data: currentFeeBps } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'taxaPlataformaPercentual',
  });
  // ======================================================================

  const isOwner = connectedAddress === owner;

  if (!isClient) {
    // Renderiza um loader ou nada enquanto o componente não está montado no cliente
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

  // Se for o dono, renderiza o painel completo
  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold mb-8 text-white text-center">Painel de Administração</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Coluna da Esquerda: Controle de Rodadas e Resultados */}
        <div className="space-y-8">
          <AdminRoundControls />
          <AdminRegisterResults />
        </div>

        {/* Coluna da Direita: Configurações e Informações */}
        <div className="space-y-8">
          <AdminSettings currentFeeBps={currentFeeBps as bigint | undefined} />
          {/* Adicione outros painéis de informação aqui se necessário */}
        </div>
        
      </div>
    </main>
  );
};

export default AdminDashboardPage;