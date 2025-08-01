// ARQUIVO: /src/components/TestnetBanner.tsx - VERSÃO FINAL (DE VERDADE AGORA)

import { AlertTriangle } from 'lucide-react';

export default function TestnetBanner() {
  return (
    // AQUI ESTÁ A MÁGICA: Adicionamos `max-w-4xl mx-auto` para controlar a largura
    <div className="w-full max-w-4xl mx-auto bg-amber-400 border-b-4 border-amber-500 p-4 rounded-lg shadow-lg">
      <div className="flex items-center">
        <div className="pr-4">
          <AlertTriangle className="h-8 w-8 text-amber-900" />
        </div>
        <div className="text-amber-900">
          <p className="font-bold text-lg">
            ATENÇÃO: ESTE SITE ESTÁ EM FASE DE TESTES
          </p>
          <p className="font-semibold">
            Utilizando a rede de teste Sepolia. NÃO UTILIZE FUNDOS REAIS.
          </p>
        </div>
      </div>
    </div>
  );
}