// src/components/WarningBanner.tsx

import { AlertTriangle } from 'lucide-react'; // Ícone legal. Instale com: npm install lucide-react

export function WarningBanner() {
  return (
    <div className="bg-yellow-500 border-l-4 border-yellow-700 text-yellow-900 p-4 rounded-md my-4 flex items-center gap-3">
      <AlertTriangle className="h-6 w-6" />
      <p className="font-bold">
        ATENÇÃO: Este site está em FASE DE TESTES utilizando a rede de teste Sepolia. NÃO UTILIZE FUNDOS REAIS.
      </p>
    </div>
  );
}