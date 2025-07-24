// src/components/views/HomePageClient.tsx

'use client';

import { useAccount, useDisconnect, useBalance } from 'wagmi';
import { formatEther } from 'viem';
import { WarningBanner } from '../WarningBanner';
import { ContractInfo } from '../ContractInfo';
import { ClaimPrize } from '../ClaimPrize';
import { RoundInfo } from '../RoundInfo';
// ==========================================================
// 1. A INTERVENÇÃO COMEÇA AQUI: IMPORTANDO O PAINEL DE ADMIN
// ==========================================================
import { AdminPanel } from '../AdminPanel';

// Componente para quando o usuário está DESCONECTADO
function ConnectWalletPrompt() {
  return (
    <div className="text-center mt-20">
      <h2 className="text-3xl font-bold mb-4">Bem-vindo ao BetBrasil!</h2>
      <p className="text-gray-300 mb-8">Conecte sua carteira para começar.</p>
      <w3m-button />
    </div>
  );
}

// Componente para exibir o status da conexão
function ConnectionStatus() {
  const { address } = useAccount();
  const { data: balance, isLoading } = useBalance({ address });
  
  return (
    <div className="bg-green-900/50 border border-green-500 text-green-300 p-4 rounded-lg text-center">
      Carteira: <span className="font-bold">{address?.slice(0, 6)}...{address?.slice(-4)}</span> 
      ({isLoading ? 'Carregando saldo...' : `${parseFloat(formatEther(balance?.value ?? 0n)).toFixed(4)} ${balance?.symbol}`})
    </div>
  );
}

// O componente principal da página logada
export function HomePageClient() {
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  if (!isConnected) {
    return <ConnectWalletPrompt />;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <WarningBanner />
      
      <h1 className="text-2xl font-bold text-center">
        Blockchain Bet Brasil - O BBB da Web3 - Esse Jogo é Animal!!
      </h1>

      <ConnectionStatus />
      <ContractInfo />
      <RoundInfo />
      <ClaimPrize />

      {/* =========================================================================
          2. A INTERVENÇÃO TERMINA AQUI: ADICIONANDO O PAINEL À TELA.
             Ele só vai aparecer para a carteira do dono do contrato.
          ========================================================================= */}
      <AdminPanel />

      <div className="text-center mt-6">
        <button 
          onClick={() => disconnect()}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Desconectar
        </button>
      </div>
    </div>
  );
}