// src/app/providers.tsx

"use client";

import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { sepolia } from "wagmi/chains"; // <-- CORRIGIDO: Agora estamos na rede certa!
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

// ATENÇÃO: Cole aqui o seu ID de projeto gerado no site do WalletConnect Cloud.
const projectId = "// Localização: src/app/admin/page.tsx
"use client";

import { useAccount, useReadContract } from 'wagmi';

// <<< CAMINHO CORRIGIDO PARA A ESTRUTURA ORGANIZADA
import AdminRegisterResults from '@/components/AdminRegisterResults';
import AdminRoundControls from '@/components/AdminRoundControls';
import AdminSettings from '@/components/AdminSettings';

import contractAbi from '@/abi/BlockChainBet.json';

const contractAddress = '0x00376502EA15B19E5aD363B47126cBF4903cCbD0';

export default function AdminPage() {
  const { address: userAddress, isConnected } = useAccount();

  const { data: ownerAddress, isLoading: isLoadingOwner, error: ownerError } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: 'owner',
  });

  const isAdmin = isConnected && !isLoadingOwner && userAddress === ownerAddress;

  if (isLoadingOwner) {
    return (
      <div className="text-center p-8">
        <h1 className="text-2xl font-bold">Verificando Credenciais...</h1>
        <p className="mt-2 text-gray-400">Aguarde, estamos consultando a blockchain.</p>
      </div>
    );
  }

  if (ownerError) {
      return (
          <div className="text-center bg-yellow-900/50 p-8 rounded-lg">
              <h1 className="text-2xl font-bold text-yellow-300">Erro ao Consultar Contrato</h1>
              <p className="mt-4 text-yellow-200">
                  Não foi possível ler o dono do contrato. Verifique se o endereço do contrato em 
                  <code className="bg-gray-700 p-1 rounded mx-1">{`'${contractAddress}'`}</code> 
                  está correto e se você está na rede certa.
              </p>
              <pre className="mt-2 text-xs text-left text-red-300 bg-black/30 p-2 rounded whitespace-pre-wrap">
                  {ownerError.shortMessage || ownerError.message}
              </pre>
          </div>
      )
  }
  
  if (!isAdmin) {
    return (
      <div className="text-center bg-red-900/50 p-8 rounded-lg">
        <h1 className="text-4xl font-bold text-red-400">ACESSO NEGADO</h1>
        <p className="mt-4 text-lg text-red-300">
          Esta área é restrita ao administrador do contrato. Conecte-se com a carteira correta.
        </p>
      </div>
    );
  }

  // Se chegou até aqui, é o Admin!
  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-8 p-4">
      <div className="text-center border-b border-slate-700 pb-4">
        <h1 className="text-4xl font-bold">Painel do Administrador</h1>
        <p className="mt-2 text-gray-400">Gestão completa do Blockchain Bet Brasil.</p>
      </div>

      <AdminRoundControls />
      <AdminRegisterResults />
      <AdminSettings />
    </div>
  );
}"; // <-- SUBSTITUA AQUI

const config = getDefaultConfig({
  appName: "Blockchain BetBrasil",
  projectId: projectId,
  chains: [sepolia], // <-- CORRIGIDO: Apontando para a Sepolia Testnet!
  ssr: true,
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}