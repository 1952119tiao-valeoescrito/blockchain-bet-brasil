// src/components/AdminActions.tsx - VERSÃO CORRETA E LIMPA

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';

// Garanta que o caminho para o seu arquivo de constantes está correto
import { BlockchainBetBrasilAddress, BlockchainBetBrasilABI } from '@/constants/constants';

// --- Componente para a tela de Acesso Negado ---
const AcessoNegado = ({ statusMessage }: { statusMessage: string }) => (
  <div className="text-center py-16">
    <h2 className="text-3xl font-bold text-red-500">Acesso Negado</h2>
    <p className="text-gray-400 mt-2">{statusMessage}</p>
  </div>
);

// --- Componente principal do Painel Admin ---
const AdminActions = () => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null); // null = carregando
  const [statusMessage, setStatusMessage] = useState('Verificando permissões...');

  // Funções de ação (mesmo que não usadas ainda, precisam ser definidas)
  const handleIniciarRodada = () => console.log("Clicado em Iniciar Rodada");
  const handleFecharApostas = () => console.log("Clicado em Fechar Apostas");

  const verificarAcesso = useCallback(async () => {
    if (!window.ethereum) {
      console.error("MetaMask não detectada.");
      setStatusMessage("ERRO: MetaMask não instalada.");
      setIsAdmin(false);
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []); // Força a conexão

      const contract = new ethers.Contract(BlockchainBetBrasilAddress, BlockchainBetBrasilABI, provider);
      const signer = await provider.getSigner();
      
      const ownerAddress = await contract.owner();
      const connectedAddress = signer.address;

      // --- O DIAGNÓSTICO ESTÁ AQUI ---
      console.clear();
      console.log("--- DIAGNÓSTICO DE ACESSO ADMIN ---");
      console.log(`[DONO DO CONTRATO]: ${ownerAddress.toLowerCase()}`);
      console.log(`[CARTEIRA CONECTADA]: ${connectedAddress.toLowerCase()}`);
      
      const ehAdmin = ownerAddress.toLowerCase() === connectedAddress.toLowerCase();
      
      console.log(`[RESULTADO]: Acesso de administrador = ${ehAdmin}`);
      console.log("-------------------------------------");
      // --- FIM DO DIAGNÓSTICO ---

      setIsAdmin(ehAdmin);

      if (ehAdmin) {
        setStatusMessage("Acesso Concedido! Carregando dados do painel...");
        // Futuramente, aqui chamaremos a função para buscar dados da rodada
      } else {
        setStatusMessage('A carteira conectada não corresponde à do administrador.');
      }

    } catch (error) {
      console.error("ERRO CRÍTICO NA VERIFICAÇÃO:", error);
      setStatusMessage('Ocorreu um erro ao verificar as permissões. Verifique o console.');
      setIsAdmin(false);
    }
  }, []);

  useEffect(() => {
    verificarAcesso();
    window.ethereum?.on('accountsChanged', verificarAcesso);
    return () => {
      window.ethereum?.removeListener('accountsChanged', verificarAcesso);
    };
  }, [verificarAcesso]);

  // Renderização condicional: Carregando...
  if (isAdmin === null) {
    return <div className="text-center py-16"><p>{statusMessage}</p></div>;
  }

  // Renderização condicional: Acesso Negado
  if (!isAdmin) {
    return <AcessoNegado statusMessage={statusMessage} />;
  }

  // Renderização final: Painel do Administrador
  return (
    <div className="admin-painel text-center py-10">
      <h1 className="text-3xl font-bold mb-6">Painel do Administrador</h1>
      <p className="mb-4">{statusMessage}</p>
      <div className="flex justify-center gap-4">
          <button 
            onClick={handleIniciarRodada}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-500"
          >
            Iniciar Nova Rodada
          </button>
          <button 
            onClick={handleFecharApostas}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-gray-500"
          >
            Fechar Apostas
          </button>
      </div>
    </div>
  );
};

export default AdminActions;