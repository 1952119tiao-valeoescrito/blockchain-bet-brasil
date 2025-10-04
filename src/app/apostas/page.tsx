'use client'

import { useState } from 'react'
import BettingForm from './components/BettingForm'

export default function ApostasPage() {
  const [selectedBet, setSelectedBet] = useState<'regular' | 'invest'>('regular')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* Cabeçalho */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">🎯 Faça sua Aposta</h1>
          <p className="text-slate-300 text-lg">
            Escolha entre nossa aposta regular de R$5,00 ou a premium Invest-Bet de R$1.000,00
          </p>
        </div>

        {/* Seletor de Tipo de Aposta */}
        <div className="flex gap-4 mb-8 justify-center">
          <button
            onClick={() => setSelectedBet('regular')}
            className={`px-6 py-3 rounded-lg font-bold transition-all ${
              selectedBet === 'regular'
                ? 'bg-emerald-600 text-white shadow-lg'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            🎯 Aposta Regular
          </button>
          <button
            onClick={() => setSelectedBet('invest')}
            className={`px-6 py-3 rounded-lg font-bold transition-all ${
              selectedBet === 'invest'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            💎 Invest-Bet Premium
          </button>
        </div>

        {/* Componente de Aposta */}
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 shadow-2xl">
          <BettingForm betType={selectedBet} />
        </div>

        {/* Rodapé */}
        <div className="text-center mt-8 text-slate-500 text-sm">
          <p>© 2024 Sistema de Apostas - Todos os direitos reservados</p>
          <p className="mt-2">Source: 601700 | Auditoria de Segurança Ativa</p>
        </div>
      </div>
    </div>
  )
}