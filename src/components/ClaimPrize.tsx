// src/components/ClaimPrize.tsx
'use client';

import { useState } from 'react';

export function ClaimPrize() {
  const [roundId, setRoundId] = useState('');

  return (
    <div className="w-full p-4 bg-slate-800 rounded-md border border-slate-700">
      <h3 className="font-semibold mb-3 text-center text-slate-100">Reivindicar Prêmio</h3>
      <div className="flex items-center justify-center gap-2">
        <label htmlFor="roundId" className="text-sm text-slate-400">ID da Rodada:</label>
        <input
          id="roundId"
          type="text"
          value={roundId}
          onChange={(e) => setRoundId(e.target.value)}
          placeholder="Ex: 1"
          className="w-24 bg-slate-900 border border-slate-600 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button disabled className="bg-slate-600 text-slate-400 cursor-not-allowed rounded-md px-4 py-1 text-sm font-semibold">
          Reivindicar Prêmio
        </button>
      </div>
    </div>
  );
}