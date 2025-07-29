// src/components/views/HomePageClient.tsx - A VERSÃO FINAL E CORRIGIDA

'use client';

import { useAccount } from 'wagmi';
// ✅ EXORCISMO COMPLETO: Importando o nosso botão titular do RainbowKit.
import { ConnectButton } from '@rainbow-me/rainbowkit';

// Este componente é o "porteiro" da sua página principal.
export function HomePageClient({ children }: { children: React.ReactNode }) {
  const { isConnected } = useAccount();

  // 1. Se o usuário NÃO ESTIVER conectado:
  // Mostra uma tela de boas-vindas e o botão de conexão.
  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center text-center mt-20">
        <h2 className="text-3xl font-bold mb-4 text-white">Bem-vindo ao Blockchain Bet Brasil!</h2>
        <p className="text-gray-300 mb-8">A sua plataforma de apostas descentralizada na Web3.</p>
        
        {/* ✅ O CRAQUE EM CAMPO: Usando o ConnectButton, que já faz tudo. */}
        <ConnectButton />
      </div>
    );
  }

  // 2. Se o usuário ESTIVER conectado:
  // Ele simplesmente renderiza o conteúdo principal da página que vem como "children".
  return <>{children}</>;
}