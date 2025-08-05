// components/AdminRegisterResults.tsx

'use client';

import { useState } from 'react';
import { RodadaInfo } from '@/types'; // Usaremos o mesmo tipo

// Definindo as props que este componente receberá da página
type AdminRegisterResultsProps = {
  isSubmitting: boolean;
  roundInfo: RodadaInfo | null;
  handleWrite: (functionName: string, message: string, args?: any[]) => Promise<void>;
};

export default function AdminRegisterResults({
  isSubmitting,
  roundInfo,
  handleWrite,
}: AdminRegisterResultsProps) {
  const [numerosSorteados, setNumerosSorteados] = useState('');

  const handleCloseBets = () => {
    if (roundInfo) {
      handleWrite('fecharApostas', 'Fechando apostas... Verifique a carteira.', [roundInfo.id]);
    }
  };

  const handleRegisterResults = () => {
    if (roundInfo && numerosSorteados.length > 0) {
      // O contrato espera os 5 milhares como um array de strings ou números
      const milhares = numerosSorteados.split(',').map(n => n.trim());
      
      if (milhares.length !== 5) {
        alert("Erro: Você precisa inserir exatamente 5 números (milhares), separados por vírgula.");
        return;
      }
      
      handleWrite(
        'registrarResultadosDaFederalEProcessar', 
        'Registrando resultados... Verifique a carteira.', 
        [roundInfo.id, milhares]
      );
    }
  };

  // Lógica de desabilitação dos botões
  const canCloseBets = roundInfo?.status === 1; // Só pode fechar se a rodada está 'Aberta'
  const canRegisterResults = roundInfo?.status === 2; // Só pode registrar se a rodada está 'Fechada'

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-slate-800/50 rounded-lg border border-slate-700">
      <h3 className="text-xl font-bold text-center text-slate-100 mb-6">Controle da Rodada Atual (ID: {roundInfo ? roundInfo.id.toString() : 'N/A'})</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Painel para Fechar Apostas */}
        <div className="flex flex-col items-center gap-2 p-4 bg-slate-900/50 rounded-md">
          <h4 className='font-semibold'>Passo 1: Fechar Apostas</h4>
          <p className='text-xs text-slate-400 mb-2'>Encerra a possibilidade de novas apostas na rodada atual.</p>
          <button
            onClick={handleCloseBets}
            disabled={isSubmitting || !canCloseBets}
            className="btn-admin bg-orange-600 hover:bg-orange-700"
          >
            Fechar Apostas
          </button>
        </div>

        {/* Painel para Registrar Resultados */}
        <div className="flex flex-col items-center gap-2 p-4 bg-slate-900/50 rounded-md">
          <h4 className='font-semibold'>Passo 2: Registrar Resultados</h4>
          <p className='text-xs text-slate-400 mb-2'>Insira os 5 milhares da Loteria Federal, separados por vírgula.</p>
          <input
            type="text"
            value={numerosSorteados}
            onChange={(e) => setNumerosSorteados(e.target.value)}
            placeholder="ex: 12345,67890,..."
            className="input-admin"
            disabled={isSubmitting || !canRegisterResults}
          />
          <button
            onClick={handleRegisterResults}
            disabled={isSubmitting || !canRegisterResults}
            className="btn-admin bg-teal-600 hover:bg-teal-700 mt-2"
          >
            Registrar Resultados
          </button>
        </div>
      </div>
    </div>
  );
}