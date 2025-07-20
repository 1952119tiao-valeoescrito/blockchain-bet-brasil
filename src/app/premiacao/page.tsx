// src/app/premiacao/page.tsx - VERSÃO CORRIGIDA E LIMPA

'use client';

import { useState } from 'react';
// Importamos o componente que faz o trabalho pesado.
import PrizeClaim from '@/components/PrizeClaim';

// 1. LIMPEZA: A importação de Address e Abi foi removida.
// Ela não era usada aqui e estava apontando para o lugar errado ('@/constants').
// O componente 'PrizeClaim' já cuida de suas próprias importações.

export default function PremiacaoPage() {
  // Estado para guardar o que o usuário digita no input
  const [numeroRodada, setNumeroRodada] = useState('');
  
  // Estado para guardar a rodada que realmente vamos checar, após o clique no botão
  const [rodadaParaChecar, setRodadaParaChecar] = useState(0);

  const handleCheckRound = () => {
    // Validação robusta para garantir que é um número positivo
    const id = parseInt(numeroRodada, 10);
    if (!isNaN(id) && id > 0) {
      setRodadaParaChecar(id);
    } else {
      // Opcional: Limpa a checagem se o input for inválido
      setRodadaParaChecar(0);
    }
  };

  return (
    // Container principal que centraliza tudo
    <div className="w-full max-w-2xl mx-auto py-10 space-y-8">
      
      {/* O Painel de Controle para o usuário */}
      <div className="bg-slate-800/50 p-6 rounded-lg text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Consultar Premiação</h2>
        <p className="text-slate-300 mb-4">
          Digite o número da rodada que você participou para verificar se há prêmios a serem resgatados.
        </p>
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <input
            type="number"
            value={numeroRodada}
            onChange={(e) => setNumeroRodada(e.target.value)}
            placeholder="Nº da Rodada"
            // 2. MELHORIA SEMÂNTICA: Adicionado 'min' para guiar o navegador
            min="1"
            className="bg-slate-900 border border-slate-600 rounded-md py-2 px-3 text-white text-center focus:ring-2 focus:ring-cyan-500"
          />
          <button
            onClick={handleCheckRound}
            className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-6 rounded-md transition-colors"
          >
            Verificar Rodada
          </button>
        </div>
      </div>

      {/* 
        A MÁGICA ACONTECE AQUI!
        O componente 'PrizeClaim' só é renderizado (e só faz chamadas na blockchain)
        quando temos um número de rodada válido para verificar. Isso é muito eficiente.
      */}
      {rodadaParaChecar > 0 && (
        <PrizeClaim />
      )}

    </div>
  );
}