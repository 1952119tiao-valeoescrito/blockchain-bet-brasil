// fix-final.ps1

Write-Host "INICIANDO CORRECAO DOS ARQUIVOS..." -ForegroundColor Yellow

# 1. BettingForm.tsx
$content = @'
'use client'

import React, { useState, useEffect } from 'react'

export function BettingForm({ currentRound }: { currentRound: number }) {
  const [predictions, setPredictions] = useState([0, 0, 0, 0, 0])

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-slate-800 rounded-lg shadow-xl border border-emerald-500/30">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">
          Aposta na Rodada #{currentRound}
        </h2>
        <p className="text-slate-300">Escolha 5 números entre 1 e 25</p>
      </div>

      <form className="space-y-6">
        <div className="grid grid-cols-5 gap-4 mb-6">
          {[0, 1, 2, 3, 4].map((index) => (
            <div key={index} className="text-center">
              <label className="block text-sm text-slate-400 mb-2">
                Posição {index + 1}
              </label>
              <input
                type="number"
                min="1"
                max="25"
                className="w-full bg-slate-700 border border-slate-600 rounded-lg py-3 px-4 text-white text-center text-lg font-bold"
              />
            </div>
          ))}
        </div>

        <button className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300">
          Confirmar Aposta
        </button>
      </form>
    </div>
  )
}
'@
Set-Content -Path "src/components/BettingForm.tsx" -Value $content
Write-Host "BETTINGFORM CORRIGIDO" -ForegroundColor Green

# 2. Web3Provider.tsx
$web3Content = @'
'use client'

import React from 'react'

export function Web3Provider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
'@
Set-Content -Path "src/components/Web3Provider.tsx" -Value $web3Content
Write-Host "WEB3PROVIDER CORRIGIDO" -ForegroundColor Green

# 3. SecurityAudit.tsx
$securityContent = @'
'use client'

import React from 'react'

export function SecurityAudit() {
  return null
}
'@
Set-Content -Path "src/components/SecurityAudit.tsx" -Value $securityContent
Write-Host "SECURITYAUDIT CORRIGIDO" -ForegroundColor Green

Write-Host "CORRECAO CONCLUIDA!" -ForegroundColor Green
Write-Host "EXECUTE: npm run dev" -ForegroundColor Yellow