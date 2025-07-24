// src/components/ConnectWalletPrompt.tsx

'use client';

export function ConnectWalletPrompt() {
  return (
    <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-lg mx-auto text-center">
      <h2 className="text-2xl font-bold mb-4 text-blue-400">Bem-vindo ao Blockchain Bet Brasil!</h2>
      <p className="text-gray-300 mb-6">
        Para ver as informações da rodada e fazer sua aposta, por favor, conecte sua carteira.
      </p>
      {/* O botão do Web3Modal/Wagmi vai aqui e já faz todo o trabalho pesado */}
      <w3m-button />
    </div>
  );
}