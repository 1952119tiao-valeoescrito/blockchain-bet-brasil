// src/components/layout/TestnetBanner.tsx
'use client';

import { AlertTriangle } from 'lucide-react'; // Importa o ícone que acabamos de instalar

export function TestnetBanner() {
  return (
    <div className="w-full bg-yellow-400/20 border border-yellow-500/30 text-yellow-200 p-3 text-center text-sm rounded-lg mb-6">
      <div className="flex items-center justify-center gap-3">
        <AlertTriangle className="h-5 w-5" />
        <p>
          <span className="font-semibold">ATENÇÃO:</span> Este site está em{' '}
          <span className="font-bold">FASE DE TESTES</span> utilizando a rede de teste{' '}
          <span className="font-semibold underline">Sepolia</span>.{' '}
          <strong className="uppercase">Não utilize fundos reais.</strong>
        </p>
      </div>
    </div>
  );
}