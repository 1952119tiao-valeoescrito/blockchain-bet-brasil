// app/premiacao/page.tsx

'use client';

import { useState } from 'react';
import PrizeClaim from '@/components/PrizeClaim';
import PrizeDistribution from '@/components/PrizeDistribution'; // <-- 1. IMPORTAR

export default function PremiacaoPage() {
  const [rodadaIdInput, setRodadaIdInput] = useState('');
  const [rodadaIdParaChecar, setRodadaIdParaChecar] = useState(0);

  const handleVerificar = () => {
    const id = parseInt(rodadaIdInput, 10);
    if (!isNaN(id) && id > 0) {
      setRodadaIdParaChecar(id);
    } else {
      alert("Por favor, insira um número de rodada válido.");
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-12">
      
      {/* Seção de Input para Verificar Prêmio */}
      <div className="w-full max-w-md mx-auto bg-slate-800/50 border border-slate-700 rounded-lg p-6 text-center">
        <h1 className="text-3xl font-bold text-cyan-400">Verificar Meus Prêmios</h1>
        <p className="mt-2 text-gray-300">
          Insira o número de uma rodada finalizada para checar se você tem prêmios para reivindicar.
        </p>
        <div className="flex items-center justify-center gap-2 mt-6">
          <input
            type="text"
            value={rodadaIdInput}
            onChange={(e) => setRodadaIdInput(e.target.value)}
            placeholder="ID da Rodada"
            className="input-admin w-48"
          />
          <button
            onClick={handleVerificar}
            className="btn-admin bg-cyan-600 hover:bg-cyan-700"
          >
            Verificar
          </button>
        </div>
      </div>

      {/* Seção onde o prêmio aparecerá magicamente */}
      {rodadaIdParaChecar > 0 && (
        <PrizeClaim rodadaId={rodadaIdParaChecar} />
      )}

      {/* Seção de Distribuição de Prêmios */}
      <div className="w-full max-w-4xl mx-auto">
        <PrizeDistribution /> {/* <-- 2. ADICIONAR O COMPONENTE AQUI */}
      </div>

    </div>
  );
}