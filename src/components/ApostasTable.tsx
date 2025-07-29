// ARQUIVO: /src/components/ApostasTable.tsx

import React from 'react';

// Isso define o "formato" de cada aposta que vem do contrato
type Aposta = {
  id: bigint;
  rodadaId: bigint;
  prognosticosX: readonly bigint[];
  prognosticosY: readonly bigint[];
  status: number; // 0: Aguardando, 1: Premiada, 2: NaoPremiada
};

// Mapeamento de status para texto e cor
const statusMap: { [key: number]: { text: string; className: string } } = {
  0: { text: 'Aguardando', className: 'text-yellow-400' },
  1: { text: 'Premiada', className: 'text-green-400 font-bold' },
  2: { text: 'Não Premiada', className: 'text-red-400' },
};

export default function ApostasTable({ apostas }: { apostas: readonly Aposta[] }) {
  return (
    <div className="overflow-x-auto bg-slate-800/50 border border-slate-700 rounded-lg">
      <table className="min-w-full text-sm text-left text-slate-300">
        <thead className="bg-slate-800 text-xs text-slate-400 uppercase">
          <tr>
            <th scope="col" className="px-6 py-3">Rodada</th>
            <th scope="col" className="px-6 py-3">Prognósticos X</th>
            <th scope="col" className="px-6 py-3">Prognósticos Y</th>
            <th scope="col" className="px-6 py-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {apostas.map((aposta) => (
            <tr key={aposta.id.toString()} className="border-b border-slate-700 hover:bg-slate-700/50">
              <td className="px-6 py-4 font-medium">#{aposta.rodadaId.toString()}</td>
              <td className="px-6 py-4">{aposta.prognosticosX.map(n => n.toString()).join(', ')}</td>
              <td className="px-6 py-4">{aposta.prognosticosY.map(n => n.toString()).join(', ')}</td>
              <td className={`px-6 py-4 ${statusMap[aposta.status]?.className || ''}`}>
                {statusMap[aposta.status]?.text || 'Desconhecido'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}