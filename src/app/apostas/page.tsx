// ARQUIVO: /src/app/apostas/page.tsx

'use client'; // ESSENCIAL! Esta página agora é interativa.

import React from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { bettingContractAddress, bettingContractABI } from '@/contracts';
import { ConnectButton } from '@rainbow-me/rainbowkit';

// Vamos criar este componente de tabela logo abaixo
import ApostasTable from '@/components/ApostasTable'; 

export default function PaginaApostas() {
  const { address: userAddress, isConnected } = useAccount();

  // A MÁGICA ACONTECE AQUI:
  // "Lendo" a função 'getApostasPorJogador' do seu contrato, passando o endereço do usuário.
  const { data: apostas, isLoading, isError } = useReadContract({
    address: bettingContractAddress,
    abi: bettingContractABI,
    functionName: 'getApostasPorJogador',
    args: [userAddress],
    // Otimização: Só executa a busca se o usuário estiver conectado
    enabled: isConnected && !!userAddress, 
  });

  // ---- RENDERIZAÇÃO CONDICIONAL BASEADA NO ESTADO ----

  // 1. Se não estiver conectado
  if (!isConnected) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Conecte sua Carteira</h2>
        <p className="text-slate-400 mb-6">Para ver seu histórico de apostas, por favor, conecte sua carteira.</p>
        <div className="flex justify-center">
          <ConnectButton />
        </div>
      </div>
    );
  }

  // 2. Se estiver carregando os dados
  if (isLoading) {
    return <div className="text-center text-slate-300">Carregando seu histórico de apostas...</div>;
  }

  // 3. Se ocorrer um erro na busca
  if (isError) {
    return <div className="text-center text-red-400">Ocorreu um erro ao buscar suas apostas. Tente recarregar a página.</div>;
  }

  // 4. Se não tiver apostas
  if (!apostas || apostas.length === 0) {
    return (
        <div className="w-full text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Minhas Apostas</h1>
            <div className="mt-8 p-8 bg-slate-800/50 border border-slate-700 rounded-lg">
                <p className="text-slate-400">Você ainda não fez nenhuma aposta. Que tal tentar a sorte na página inicial?</p>
            </div>
        </div>
    );
  }

  // 5. SUCESSO! Mostra a tabela com as apostas
  return (
    <div className="w-full text-center">
      <h1 className="text-4xl font-bold text-white mb-8">Minhas Apostas</h1>
      {/* Passamos os dados das apostas para o componente da tabela */}
      <ApostasTable apostas={apostas} />
    </div>
  );
}