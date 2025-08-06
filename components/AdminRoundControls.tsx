// src/components/AdminRoundControls.tsx

'use client';

import React, { useState } from 'react';

// ======================================================================
// CADA COMPONENTE DEFINE E EXPORTA SUAS PRÓPRIAS PROPS.
// Esta é a abordagem correta e anti-paradoxo.

// Primeiro, definimos o tipo para a função de escrita, como antes.
type WriteableFunctionName =
  | 'apostar' | 'despausar' | 'fecharApostas' | 'iniciarNovaRodada' | 'pausar'
  | 'registrarResultadosDaFederalEProcessar' | 'reivindicarPremio' | 'renounceOwnership'
  | 'retirarTaxas' | 'setTaxaPlataforma' | 'setTicketPriceBase' | 'transferOwnership';

// Agora, definimos e EXPORTAMOS o tipo das props do componente.
export type AdminRoundControlsProps = {
  isSubmitting: boolean;
  handleWrite: (functionName: WriteableFunctionName, message: string, args?: any[]) => Promise<void>;
  availableFees: number[];
};
// ======================================================================

const AdminRoundControls = ({ isSubmitting, handleWrite }: AdminRoundControlsProps) => {
  const [ticketPrice, setTicketPrice] = useState('0.01'); 

  const handleIniciarRodada = () => {
    // Usamos o utilitário ethers para converter a string para a unidade correta
    // const parsedPrice = ethers.parseEther(ticketPrice);
    // handleWrite('iniciarNovaRodada', 'Iniciando nova rodada...', [parsedPrice]);
    // Simplificando por agora, vamos passar a string, a conversão deve ser feita antes
    handleWrite('iniciarNovaRodada', 'Iniciando nova rodada...', [ticketPrice]);
  };

  const handlePausarContrato = () => {
    handleWrite('pausar', 'Pausando o contrato...');
  };

  return (
    <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
      <h3 className="text-xl font-semibold text-white mb-4">Controle de Rodadas</h3>
      <div className="space-y-4">
        <div>
          <label htmlFor="ticketPrice" className="block text-sm font-medium text-gray-300 mb-1">
            Preço do Bilhete (em ETH/MATIC)
          </label>
          <input
            type="text"
            id="ticketPrice"
            value={ticketPrice}
            onChange={(e) => setTicketPrice(e.target.value)}
            className="w-full bg-slate-900 border border-slate-600 rounded-md px-3 py-2 text-white"
            placeholder="Ex: 0.01"
          />
        </div>
        <button
          onClick={handleIniciarRodada}
          disabled={isSubmitting}
          className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-500"
        >
          {isSubmitting ? 'Iniciando...' : 'Iniciar Nova Rodada'}
        </button>
        <button
          onClick={handlePausarContrato}
          disabled={isSubmitting}
          className="w-full px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:bg-gray-500"
        >
          {isSubmitting ? 'Pausando...' : 'Pausar Contrato'}
        </button>
      </div>
    </div>
  );
};

export default AdminRoundControls;