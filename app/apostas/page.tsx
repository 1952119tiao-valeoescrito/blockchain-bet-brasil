// app/apostas/page.tsx

'use client';

import { useAccount } from 'wagmi';
import BettingForm from '@/components/BettingForm'; // O seu formulário de aposta
import { ReferenceTable } from '@/components/ReferenceTable'; // Sua tabela de referência
import { ConnectWalletPrompt } from '@/components/ConnectWalletPrompt'; // Nosso novo porteiro

// Supondo que você tenha um componente para a mensagem "Nenhuma rodada aberta"
// import { RoundStatusMessage } from '@/components/RoundStatusMessage';

const ApostasPage = () => {
  // A linha mais importante: pegamos o status da conexão.
  const { isConnected } = useAccount();

  return (
    <main className="container mx-auto py-10 px-4">
      {/* 
        A MÁGICA ACONTECE AQUI:
        - Se o usuário ESTIVER conectado, mostramos o conteúdo principal da página.
        - Se NÃO ESTIVER conectado, mostramos o nosso "porteiro".
      */}
      {isConnected ? (
        <div className="flex flex-col items-center gap-12 w-full">
          {/* Você pode adicionar aqui a lógica para mostrar a mensagem da rodada */}
          {/* <RoundStatusMessage /> */}
          
          <div className="w-full max-w-3xl">
            <BettingForm />
          </div>
          
          <div className="w-full">
            {/* Supondo que sua tabela se chame ReferenceTable */}
            {/* <ReferenceTable /> */}
            <h2 className="text-2xl font-bold text-center text-cyan-400 mb-4">Tabela de Referência de Prognósticos</h2>
            <p className="text-center text-gray-400">Esta tabela serve como uma referência completa de todos os 625 prognósticos possíveis em nosso sistema, no formato "x/y". Use-a para consultar e planejar suas apostas.</p>
            {/* O conteúdo da sua tabela iria aqui */}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center pt-20">
          <ConnectWalletPrompt />
        </div>
      )}
    </main>
  );
};

export default ApostasPage;