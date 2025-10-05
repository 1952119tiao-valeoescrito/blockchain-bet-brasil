'use client'

import React, { useState } from 'react'
import { useAccount, useWriteContract } from 'wagmi'
import { parseEther } from 'viem'
import Link from 'next/link'

// ABIs simplificados dos contratos
const BBB_ABI = [
  {
    "inputs": [
      {
        "internalType": "uint256[5]",
        "name": "_prognosticosX",
        "type": "uint256[5]"
      },
      {
        "internalType": "uint256[5]", 
        "name": "_prognosticosY",
        "type": "uint256[5]"
      }
    ],
    "name": "apostar",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  }
] as const

interface BettingFormProps {
  betType: 'regular' | 'invest'
}

export default function BettingForm({ betType }: BettingFormProps) {
  const { address, isConnected } = useAccount()
  const { writeContract, isPending: isPlacingBet } = useWriteContract()
  
  const [prognosticos, setPrognosticos] = useState<{x: number, y: number}[]>([
    {x: 0, y: 0}, {x: 0, y: 0}, {x: 0, y: 0}, {x: 0, y: 0}, {x: 0, y: 0}
  ])

  // Endereços dos contratos (substitua pelos reais)
  const CONTRACT_ADDRESSES = {
    regular: '0x...' as `0x${string}`,
    invest: '0x...' as `0x${string}`
  }

  const handleXChange = (index: number, value: string) => {
    const numValue = value === '' ? 0 : Math.max(1, Math.min(25, parseInt(value.replace(/[^0-9]/g, '') || '0')))
    
    const newPrognosticos = [...prognosticos]
    newPrognosticos[index] = { ...newPrognosticos[index], x: numValue }
    setPrognosticos(newPrognosticos)
  }

  const handleYChange = (index: number, value: string) => {
    const numValue = value === '' ? 0 : Math.max(1, Math.min(25, parseInt(value.replace(/[^0-9]/g, '') || '0')))
    
    const newPrognosticos = [...prognosticos]
    newPrognosticos[index] = { ...newPrognosticos[index], y: numValue }
    setPrognosticos(newPrognosticos)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isConnected) {
      alert('❌ Conecte sua carteira primeiro!')
      return
    }

    if (!prognosticos.every(p => p.x >= 1 && p.x <= 25 && p.y >= 1 && p.y <= 25)) {
      alert('❌ Todos os prognósticos devem ter X e Y entre 1 e 25')
      return
    }

    try {
      const prognosticosX = prognosticos.map(p => BigInt(p.x)) as [bigint, bigint, bigint, bigint, bigint]
      const prognosticosY = prognosticos.map(p => BigInt(p.y)) as [bigint, bigint, bigint, bigint, bigint]
      const value = betType === 'regular' ? parseEther('0.005') : parseEther('1.0')

      writeContract({
        address: CONTRACT_ADDRESSES[betType],
        abi: BBB_ABI,
        functionName: 'apostar',
        args: [prognosticosX, prognosticosY],
        value: value,
      })

      setPrognosticos([{x: 0, y: 0}, {x: 0, y: 0}, {x: 0, y: 0}, {x: 0, y: 0}, {x: 0, y: 0}])
      
    } catch (error) {
      console.error('Erro ao fazer aposta:', error)
      alert('❌ Erro ao realizar aposta na blockchain')
    }
  }

  const allNumbersValid = prognosticos.every(p => p.x >= 1 && p.x <= 25 && p.y >= 1 && p.y <= 25)
  const betPrice = betType === 'regular' ? 'R$ 5,00' : 'R$ 1.000,00'
  const bonusAmount = betType === 'regular' ? 'R$ 0,625' : 'R$ 125,00'

  return (
    <div className="w-full p-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">
          {betType === 'regular' ? '🎯 Aposta Regular' : '💎 Invest-Bet Premium'}
        </h2>
        <div className="bg-amber-500 text-black p-2 rounded-lg text-sm">
          <p className="font-bold">Bônus Zero Pontos: {bonusAmount}</p>
          <p>8 bônus = 1 aposta grátis</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-slate-700/30 p-4 rounded-lg">
          <label className="block text-lg font-bold text-white mb-4 text-center">
            Seus 5 Prognósticos
          </label>
          <div className="grid grid-cols-5 gap-2">
            {prognosticos.map((prognostico, index) => (
              <div key={index} className="text-center">
                <div className="text-sm text-slate-300 mb-1">#{index + 1}</div>
                <div className="flex items-center justify-center bg-slate-600 border border-slate-500 rounded-lg p-1">
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={prognostico.x || ''}
                    onChange={(e) => handleXChange(index, e.target.value)}
                    className="w-8 bg-transparent text-white text-center text-sm font-bold focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    placeholder="X"
                    maxLength={2}
                  />
                  <span className="text-white text-sm font-bold mx-1">/</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={prognostico.y || ''}
                    onChange={(e) => handleYChange(index, e.target.value)}
                    className="w-8 bg-transparent text-white text-center text-sm font-bold focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    placeholder="Y"
                    maxLength={2}
                  />
                </div>
                <div className="text-slate-400 text-xs mt-1 h-4">
                  {prognostico.x && prognostico.y ? `${prognostico.x}/${prognostico.y}` : ''}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-700/50 p-3 rounded-lg">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="text-center">
              <div className="text-slate-400 text-xs">Valor</div>
              <div className="text-emerald-400 font-bold">{betPrice}</div>
            </div>
            <div className="text-center">
              <div className="text-slate-400 text-xs">Bônus Zero</div>
              <div className="text-amber-400 font-bold">{bonusAmount}</div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 text-xs mt-2 pt-2 border-t border-slate-600">
            <div className="text-center">
              <div className="text-slate-400">Bônus Acum.</div>
              <div className="text-amber-400 font-bold">
                {betType === 'regular' ? 'R$ 2,50' : 'R$ 500,00'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-slate-400">Grátis</div>
              <div className="text-emerald-400 font-bold">
                {betType === 'regular' ? '1' : '2'}
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={!isConnected || !allNumbersValid || isPlacingBet}
          className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 disabled:from-slate-600 disabled:to-slate-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 disabled:cursor-not-allowed shadow-lg"
        >
          {!isConnected ? 'Conecte Carteira' :
           isPlacingBet ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Processando...
            </div>
          ) : (
            `🎯 Apostar ${betPrice}`
          )}
        </button>
      </form>

      <div className="mt-3 text-center">
        {isConnected ? (
          <div className="text-emerald-400 text-xs bg-emerald-500/10 p-1 rounded">
            ✅ Carteira Conectada
          </div>
        ) : (
          <div className="text-amber-400 text-xs bg-amber-500/10 p-1 rounded">
            🔗 Conecte sua carteira
          </div>
        )}
      </div>

      <div className="mt-8 pt-4 border-t border-slate-600 text-center">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors duration-200 text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          ← Voltar para Página Inicial
        </Link>
      </div>
    </div>
  )
}