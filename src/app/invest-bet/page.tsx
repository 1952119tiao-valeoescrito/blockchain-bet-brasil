'use client'

import React, { useState } from 'react'
import Link from 'next/link'

// Componente do formulário específico para Invest-Bet - VERSÃO CORRIGIDA
function InvestBetForm({ currentRound }: { currentRound: number }) {
  const [predictions, setPredictions] = useState(
    Array(5).fill({ x: 0, y: 0 })
  )

  const handleXChange = (index: number, value: string) => {
    const numValue = parseInt(value) || 0
    if ((numValue >= 1 && numValue <= 25) || value === '') {
      const newPredictions = [...predictions]
      newPredictions[index] = {
        ...newPredictions[index],
        x: value === '' ? 0 : numValue
      }
      setPredictions(newPredictions)
    }
  }

  const handleYChange = (index: number, value: string) => {
    const numValue = parseInt(value) || 0
    if ((numValue >= 1 && numValue <= 25) || value === '') {
      const newPredictions = [...predictions]
      newPredictions[index] = {
        ...newPredictions[index],
        y: value === '' ? 0 : numValue
      }
      setPredictions(newPredictions)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const allValid = predictions.every(p => 
      p.x >= 1 && p.x <= 25 && p.y >= 1 && p.y <= 25
    )
    
    if (!allValid) {
      alert('Por favor, preencha todos os campos com números de 1 a 25')
      return
    }

    console.log('Invest-Bet enviado:', predictions)
    alert('🎉 Invest-Bet de R$ 1.000,00 enviado com sucesso! (Em desenvolvimento)')
  }

  const isPositionValid = (index: number) => {
    const p = predictions[index]
    return p.x >= 1 && p.x <= 25 && p.y >= 1 && p.y <= 25
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-slate-800 rounded-lg shadow-xl border border-purple-500/30">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">
          Invest-Bet - Rodada #{currentRound}
        </h2>
        <p className="text-slate-300">Digite 5 prognósticos no formato X/Y</p>
        <p className="text-slate-400 text-sm mt-2">X e Y devem ser números entre 1 e 25</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-5 gap-4 mb-6">
          {predictions.map((prediction, index) => (
            <div key={index} className="text-center">
              <label className="block text-sm text-slate-400 mb-2">
                Posição {index + 1}
              </label>
              <div className={`flex items-center justify-center gap-1 bg-slate-700 border-2 rounded-lg p-1 transition-colors ${
                isPositionValid(index) ? 'border-purple-500' : 'border-slate-600'
              }`}>
                <input
                  type="number"
                  min="1"
                  max="25"
                  value={prediction.x || ''}
                  onChange={(e) => handleXChange(index, e.target.value)}
                  className="w-12 bg-transparent text-white text-center text-lg font-bold outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder="X"
                />
                <span className="text-white font-bold">/</span>
                <input
                  type="number"
                  min="1"
                  max="25"
                  value={prediction.y || ''}
                  onChange={(e) => handleYChange(index, e.target.value)}
                  className="w-12 bg-transparent text-white text-center text-lg font-bold outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder="Y"
                />
              </div>
              {isPositionValid(index) && (
                <div className="text-xs text-purple-400 mt-1">
                  ✓ Válido
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="bg-purple-700/30 p-4 rounded-lg border border-purple-500/30">
          <div className="flex justify-between items-center mb-2">
            <span className="text-slate-300">Valor do Invest-Bet:</span>
            <span className="text-xl font-bold text-purple-400">
              R$ 1.000,00
            </span>
          </div>
          <p className="text-slate-400 text-sm">
            Bônus de R$125,00 para invest-bets com zero pontos
          </p>
          <p className="text-slate-400 text-sm mt-1">
            A cada 8 invest-bets com zero pontos: 1 invest-bet grátis!
          </p>
        </div>

        <button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:bg-slate-600 disabled:transform-none disabled:cursor-not-allowed"
          disabled={!predictions.every(p => p.x >= 1 && p.x <= 25 && p.y >= 1 && p.y <= 25)}
        >
          Confirmar Invest-Bet de R$ 1.000,00
        </button>
      </form>

      <div className="mt-6 text-center text-slate-400 text-sm">
        <p>
          💼 <strong>Sistema "Invest-Bet Premium":</strong> Bônus de R$125,00 por aposta com zero pontos.
          A cada 8 invest-bets com zero pontos, ganhe um invest-bet grátis!
        </p>
      </div>
    </div>
  )
}

export default function InvestBetPage() {
  const [isConnected, setIsConnected] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-slate-100">
      {/* Cabeçalho */}
      <header className="w-full bg-slate-800 shadow-md border-b border-purple-500/30">
        <div className="container mx-auto flex justify-between items-center p-4">
          <Link href="/" className="flex items-center gap-4 group">
            <img alt="Blockchain Bet Brasil Logo" width="48" height="48" className="rounded-full border-2 border-purple-400 p-0.5" src="https://placehold.co/48x48/0d2c20/ffffff?text=B" />
            <span className="text-2xl font-extrabold text-white uppercase">
              Blockchain Bet Brasil
            </span>
          </Link>
          
          <nav className="hidden lg:flex items-center gap-8 font-semibold text-lg">
            <Link href="/apostas" className="text-slate-300 hover:text-emerald-400 transition-colors duration-200">
              Apostas
            </Link>
            <span className="text-purple-400 border-b-2 border-purple-400 pb-1">
              Invest-Bet
            </span>
            <Link href="/como-jogar" className="text-slate-300 hover:text-emerald-400 transition-colors duration-200">
              Como Jogar
            </Link>
            <Link href="/premiacao" className="text-slate-300 hover:text-emerald-400 transition-colors duration-200">
              Premiação
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <button className="bg-purple-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
              {isConnected ? 'Conectado' : 'Conectar Carteira'}
            </button>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="container mx-auto p-6 mt-8">
        {/* Cabeçalho Invest-Bet */}
        <div className="text-center mb-12">
          <div className="bg-purple-600/20 border border-purple-500/30 rounded-2xl p-8 mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              💼 INVEST-BET PREMIUM
            </h1>
            <p className="text-xl text-slate-300 mb-4">
              Para investidores que buscam retornos extraordinários
            </p>
            <div className="flex justify-center items-center gap-8 text-lg">
              <div className="bg-purple-500/30 px-4 py-2 rounded-lg">
                <span className="text-purple-300">Valor:</span>
                <span className="text-white font-bold ml-2">R$ 1.000,00</span>
              </div>
              <div className="bg-purple-500/30 px-4 py-2 rounded-lg">
                <span className="text-purple-300">Prêmio Máximo:</span>
                <span className="text-white font-bold ml-2">R$ 10.000.000,00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Grid de Comparação */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-slate-800/50 p-6 rounded-2xl border border-emerald-500/30">
            <h3 className="text-2xl font-bold text-emerald-400 mb-4">🎯 Aposta Regular</h3>
            <ul className="text-slate-300 space-y-3">
              <li>• <strong>Valor:</strong> R$ 5,00</li>
              <li>• <strong>Prêmio Máximo:</strong> R$ 50.000,00</li>
              <li>• <strong>Bônus Zero Pontos:</strong> R$ 0,625</li>
              <li>• <strong>Aposta Grátis:</strong> A cada 8 apostas</li>
            </ul>
          </div>

          <div className="bg-slate-800/50 p-6 rounded-2xl border border-purple-500/30">
            <h3 className="text-2xl font-bold text-purple-400 mb-4">💼 Invest-Bet</h3>
            <ul className="text-slate-300 space-y-3">
              <li>• <strong>Valor:</strong> R$ 1.000,00</li>
              <li>• <strong>Prêmio Máximo:</strong> R$ 10.000.000,00</li>
              <li>• <strong>Bônus Zero Pontos:</strong> R$ 125,00</li>
              <li>• <strong>Invest-Bet Grátis:</strong> A cada 8 invest-bets</li>
            </ul>
          </div>
        </div>

        {/* Formulário Invest-Bet */}
        {isConnected ? (
          <InvestBetForm currentRound={1} />
        ) : (
          <div className="w-full max-w-2xl mx-auto p-8 bg-slate-800 rounded-lg shadow-xl border border-purple-500/30 text-center">
            <div className="text-purple-400 text-6xl mb-4">🔒</div>
            <h3 className="text-2xl font-bold text-purple-300 mb-4">
              Carteira Não Conectada
            </h3>
            <p className="text-lg text-slate-300 mb-6">
              Para acessar o Invest-Bet Premium, conecte sua carteira Web3.
            </p>
            <button 
              onClick={() => setIsConnected(true)}
              className="bg-purple-500 hover:bg-purple-400 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              🦊 Conectar MetaMask
            </button>
          </div>
        )}
      </main>

      {/* Rodapé */}
      <footer className="w-full bg-slate-800 mt-16 border-t border-purple-500/30">
        <div className="container mx-auto text-center p-6 text-slate-400 text-sm">
          <p>© 2025 Blockchain Bet Brasil. Invest-Bet Premium.</p>
        </div>
      </footer>
    </div>
  )
}