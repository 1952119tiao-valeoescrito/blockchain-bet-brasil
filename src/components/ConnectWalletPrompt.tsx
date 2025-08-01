// src/components/ConnectWalletPrompt.tsx - VERSÃO FINAL CORRIGIDA

import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function ConnectWalletPrompt() {
  return (
    <div className="flex flex-col items-center justify-center bg-slate-800 p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-white mb-4">Acesso Restrito</h2>
      <p className="text-slate-300 mb-6 text-center">
        Por favor, conecte sua carteira para continuar.
      </p>
      
      {/* ✅ A PEÇA CORRETA! Este é o botão do RainbowKit. */}
      <ConnectButton />

    </div>
  );
}