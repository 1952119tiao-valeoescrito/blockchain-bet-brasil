'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';

export const CustomConnectWalletPrompt = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center bg-gray-800/50 p-10 rounded-lg shadow-xl border border-gray-700">
      <h2 className="text-3xl font-bold text-white mb-4">
        Conecte sua Carteira
      </h2>
      <p className="text-gray-400 max-w-md mb-6">
        Para fazer suas apostas, ver o status das rodadas e interagir com o nosso sistema, por favor, conecte sua carteira primeiro.
      </p>
      <div>
        <ConnectButton />
      </div>
    </div>
  );
};