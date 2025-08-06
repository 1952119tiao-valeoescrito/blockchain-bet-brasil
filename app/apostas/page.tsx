// app/apostas/page.tsx

'use client';

import { useAccount } from 'wagmi';
import BettingForm from '@/components/BettingForm';
import { ConnectWalletPrompt } from '@/components/ConnectWalletPrompt';

// Agora esta importação vai funcionar, porque o arquivo existe!
import GroupReferenceTable from '@/components/GroupReferenceTable';


const ApostasPage = () => {
  const { isConnected } = useAccount();

  return (
    <main className="container mx-auto py-10 px-4">
      {isConnected ? (
        <div className="flex flex-col items-center gap-12 w-full">
          
          <div className="w-full max-w-3xl">
            <BettingForm />
          </div>
          
          <div className="w-full">
            <GroupReferenceTable />
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