// CÓDIGO CORRIGIDO para: src/components/BlockchainBetBrasilTable.tsx

"use client";
import React, { useState } from 'react';

// ... (outros imports se houver)

// Mock de dados para demonstração
const mockBets = [
  { id: 1, user: '0x123...abc', bet: '10/5', amount: '0.01 ETH', status: 'Aberta' },
  { id: 2, user: '0x456...def', bet: '22/1', amount: '0.05 ETH', status: 'Aberta' },
  { id: 3, user: '0x789...ghi', bet: '7/19', amount: '0.02 ETH', status: 'Fechada' },
];

export default function BlockchainBetBrasilTable() {
  const [bets] = useState(mockBets);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-slate-800/50 rounded-lg shadow-lg">
        <thead className="bg-slate-900">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Apostador</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Aposta (X/Y)</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Valor</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700">
          {bets.map((bet) => (
            <tr key={bet.id} className="hover:bg-slate-700/50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{bet.id}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300 font-mono" title={`Endereço completo: ${bet.user}`}>{bet.user}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{bet.bet}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{bet.amount}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  bet.status === 'Aberta' ? 'bg-green-800 text-green-100' : 'bg-red-800 text-red-100'
                }`}>
                  {bet.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}