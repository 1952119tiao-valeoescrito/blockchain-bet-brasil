// fix-content.ps1

# Criar o arquivo fix-content.ps1
@'
# Script para corrigir o conteúdo dos arquivos
Write-Host "🔧 Corrigindo conteúdo dos arquivos..." -ForegroundColor Yellow

# 1. Corrigir BettingForm.tsx
$bettingFormContent = @'
'use client'

import React, { useState, useEffect } from 'react'
import { useAccount, useContractWrite, useContractRead } from 'wagmi'
import { BlockchainBetBrasilV2ABI } from '@/contracts/abis/BlockchainBetBrasilV2'
import { CONTRACT_ADDRESSES } from '@/contracts/addresses'
import { ZeroPointsNotification } from './ZeroPointsNotification'

interface BettingFormProps {
  currentRound: number
}

export function BettingForm({ currentRound }: BettingFormProps) {
  const { address, isConnected } = useAccount()
  const [predictions, setPredictions] = useState<number[]>([0, 0, 0, 0, 0])
  const [isFreeBet, setIsFreeBet] = useState(false)
  const [freeBetsAvailable, setFreeBetsAvailable] = useState(0)

  // Ler free bets disponíveis
  const { data: freeBets } = useContractRead({
    address: CONTRACT_ADDRESSES.BlockchainBetBrasilV2,
    abi: BlockchainBetBrasilV2ABI,
    functionName: 'getFreeBetsConcedidas',
    args: [address],
    enabled: !!address,
  })

  // Ler ticket price
  const { data: ticketPrice } = useContractRead({
    address: CONTRACT_ADDRESSES.BlockchainBetBrasilV2,
    abi: BlockchainBetBrasilV2ABI,
    functionName: 'ticketPriceBase',
  })

  // Contrato para fazer aposta
  const { write: placeBet, isLoading: isPlacingBet } = useContractWrite({
    address: CONTRACT_ADDRESSES.BlockchainBetBrasilV2,
    abi: BlockchainBetBrasilV2ABI,
    functionName: 'apostar',
  })

  useEffect(() => {
    if (freeBets) {
      setFreeBetsAvailable(Number(freeBets))
    }
  }, [freeBets])

  const handlePredictionChange = (index: number, value: string) => {
    const numValue = parseInt(value) || 0
    if (numValue >= 1 && numValue <= 25) {
      const newPredictions = [...predictions]
      newPredictions[index] = numValue
      setPredictions(newPredictions)
    }
  }

  const handleFreeBetToggle = () => {
    if (freeBetsAvailable > 0) {
      setIsFreeBet(!isFreeBet)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isConnected || !address) {
      alert('Conecte sua carteira primeiro!')
      return
    }

    if (predictions.some(p => p < 1 || p > 25)) {
      alert('Todos os prognósticos devem ser entre 1 e 25')
      return
    }

    try {
      // Converter para o formato esperado pelo contrato
      const predictionsArray = predictions as [number, number, number, number, number]
      
      placeBet({
        args: [predictionsArray],
      })
    } catch (error) {
      console.error('Erro ao fazer aposta:', error)
      alert('Erro ao processar aposta. Tente novamente.')
    }
  }

  const formatPrice = (price: bigint) => {
    return `R$ ${(Number(price) / 10**6).toFixed(2)}`
  }

  if (!isConnected) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6 bg-slate-800 rounded-lg text-center">
        <p className="text-lg text-slate-300">Conecte sua carteira para fazer apostas</p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-slate-800 rounded-lg shadow-xl border border-emerald-500/30">
      <ZeroPointsNotification walletAddress={address} />
      
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">
          Aposta na Rodada #{currentRound}
        </h2>
        <p className="text-slate-300">
          Escolha 5 números entre 1 e 25
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
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
                value={predictions[index] || ''}
                onChange={(e) => handlePredictionChange(index, e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg py-3 px-4 text-white text-center text-lg font-bold focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-colors"
                required
              />
            </div>
          ))}
        </div>

        {freeBetsAvailable > 0 && (
          <div className="bg-slate-700/50 p-4 rounded-lg border border-amber-500/30">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isFreeBet}
                onChange={handleFreeBetToggle}
                className="w-5 h-5 text-amber-500 bg-slate-600 border-slate-500 rounded focus:ring-amber-500"
              />
              <span className="text-amber-300 font-semibold">
                Usar Aposta Grátis ({freeBetsAvailable} disponíveis)
              </span>
            </label>
            <p className="text-slate-400 text-sm mt-2">
              Você ganhou apostas grátis por acumular 8 apostas com zero pontos!
            </p>
          </div>
        )}

        <div className="bg-slate-700/30 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-slate-300">Valor da Aposta:</span>
            <span className={`text-xl font-bold ${isFreeBet ? 'text-amber-400' : 'text-emerald-400'}`}>
              {isFreeBet ? 'GRÁTIS' : ticketPrice ? formatPrice(ticketPrice as bigint) : 'Carregando...'}
            </span>
          </div>
          {!isFreeBet && (
            <p className="text-slate-400 text-sm">
              Bônus de R$0,625 para apostas com zero pontos
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isPlacingBet || predictions.some(p => p < 1 || p > 25)}
          className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-600 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed"
        >
          {isPlacingBet ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
              Processando...
            </div>
          ) : (
            `Confirmar Aposta ${isFreeBet ? 'Grátis' : ''}`
          )}
        </button>
      </form>

      <div className="mt-6 text-center text-slate-400 text-sm">
        <p>
          Sistema "Todo Mundo Ganha": Bônus de R$0,625 por aposta com zero pontos.
          A cada 8 apostas com zero pontos, ganhe uma aposta grátis!
        </p>
      </div>
    </div>
  )
}
'@
Set-Content -Path "src/components/BettingForm.tsx" -Value $bettingFormContent
Write-Host "✅ BettingForm.tsx corrigido" -ForegroundColor Green

# 2. Corrigir ZeroPointsNotification.tsx
$zeroPointsContent = @'
'use client'

import React, { useState, useEffect } from 'react'
import { useAccount, useContractRead } from 'wagmi'
import { BlockchainBetBrasilV2ABI } from '@/contracts/abis/BlockchainBetBrasilV2'
import { CONTRACT_ADDRESSES } from '@/contracts/addresses'

interface ZeroPointsNotificationProps {
  walletAddress: string
}

export function ZeroPointsNotification({ walletAddress }: ZeroPointsNotificationProps) {
  const [showNotification, setShowNotification] = useState(false)
  const [zeroPointsCount, setZeroPointsCount] = useState(0)
  const [bonusAmount, setBonusAmount] = useState(0)

  // Monitorar apostas com zero pontos
  const { data: zeroPointsData } = useContractRead({
    address: CONTRACT_ADDRESSES.BlockchainBetBrasilV2,
    abi: BlockchainBetBrasilV2ABI,
    functionName: 'zeroPointsBetsCount',
    args: [walletAddress],
    enabled: !!walletAddress,
    watch: true,
  })

  // Monitorar bônus acumulados
  const { data: bonusData } = useContractRead({
    address: CONTRACT_ADDRESSES.BlockchainBetBrasilV2,
    abi: BlockchainBetBrasilV2ABI,
    functionName: 'getBonusAcumulados',
    args: [walletAddress],
    enabled: !!walletAddress,
    watch: true,
  })

  useEffect(() => {
    if (zeroPointsData) {
      const newCount = Number(zeroPointsData)
      if (newCount > zeroPointsCount) {
        setShowNotification(true)
        setTimeout(() => setShowNotification(false), 5000)
      }
      setZeroPointsCount(newCount)
    }
  }, [zeroPointsData, zeroPointsCount])

  useEffect(() => {
    if (bonusData) {
      setBonusAmount(Number(bonusData) / 10**6) // Converter para reais
    }
  }, [bonusData])

  if (!showNotification || zeroPointsCount === 0) return null

  return (
    <div className="fixed top-20 right-4 z-50 bg-amber-500 border-l-4 border-amber-600 text-amber-900 p-4 rounded-lg shadow-lg max-w-sm animate-fade-in-down">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-lg font-bold">Parabéns! 🎉</h3>
          <p className="mt-1 text-sm">
            Você acumulou <strong>{zeroPointsCount} apostas</strong> com zero pontos!
          </p>
          <p className="mt-1 text-sm">
            Bônus acumulado: <strong>R$ {bonusAmount.toFixed(3)}</strong>
          </p>
          <p className="mt-2 text-xs">
            A cada 8 apostas com zero pontos, você ganha uma aposta grátis!
          </p>
        </div>
        <button
          onClick={() => setShowNotification(false)}
          className="ml-auto text-amber-800 hover:text-amber-900"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  )
}
'@
Set-Content -Path "src/components/ZeroPointsNotification.tsx" -Value $zeroPointsContent
Write-Host "✅ ZeroPointsNotification.tsx corrigido" -ForegroundColor Green

# 3. Corrigir Web3Provider.tsx
$web3ProviderContent = @'
'use client'

import React from 'react'
import { createConfig, WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { http } from 'viem'
import { sepolia } from 'viem/chains'

const config = createConfig({
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(),
  },
})

const queryClient = new QueryClient()

export function Web3Provider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}
'@
Set-Content -Path "src/components/Web3Provider.tsx" -Value $web3ProviderContent
Write-Host "✅ Web3Provider.tsx corrigido" -ForegroundColor Green

# 4. Corrigir SecurityAudit.tsx
$securityAuditContent = @'
'use client'

import React, { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'

export function SecurityAudit() {
  const { address } = useAccount()
  const [securityScore, setSecurityScore] = useState(100)
  const [threatsDetected, setThreatsDetected] = useState<string[]>([])

  useEffect(() => {
    // Simulação de auditoria de segurança
    const detectThreats = () => {
      const detectedThreats: string[] = []

      // Verificar se está em ambiente de teste
      if (window.location.hostname !== 'localhost' && !window.location.hostname.includes('vercel.app')) {
        detectedThreats.push('Ambiente de produção - verificar certificado SSL')
      }

      // Verificar Web3 provider
      if (typeof window.ethereum === 'undefined') {
        detectedThreats.push('Provider Web3 não detectado')
      }

      // Verificar conexão de rede
      if (window.ethereum?.chainId !== '0xaa36a7') { // Sepolia
        detectedThreats.push('Rede não autorizada detectada')
      }

      setThreatsDetected(detectedThreats)
      setSecurityScore(100 - (detectedThreats.length * 20))
    }

    detectThreats()
    const interval = setInterval(detectThreats, 30000) // Verificar a cada 30 segundos

    return () => clearInterval(interval)
  }, [address])

  if (threatsDetected.length === 0) return null

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-slate-800 border border-red-500/30 rounded-lg p-4 max-w-sm shadow-lg">
      <div className="flex items-center mb-2">
        <div className={`w-3 h-3 rounded-full mr-2 ${securityScore > 80 ? 'bg-green-500' : securityScore > 60 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
        <h4 className="text-white font-semibold">Auditoria de Segurança</h4>
      </div>
      <div className="text-sm text-slate-300">
        <p>Score: {securityScore}/100</p>
        <ul className="mt-2 space-y-1">
          {threatsDetected.map((threat, index) => (
            <li key={index} className="flex items-center">
              <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
              {threat}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
'@
Set-Content -Path "src/components/SecurityAudit.tsx" -Value $securityAuditContent
Write-Host "✅ SecurityAudit.tsx corrigido" -ForegroundColor Green

# 5. Corrigir contracts/addresses.ts
$addressesContent = @'
export const CONTRACT_ADDRESSES = {
  BlockchainBetBrasilV2: '0x...', // Endereço do contrato deployado
  InvestBetV2: '0x...', // Endereço do contrato deployado
} as const

export const SUPPORTED_CHAINS = {
  sepolia: {
    id: 11155111,
    name: 'Sepolia',
    rpcUrl: 'https://sepolia.infura.io/v3/your-project-id',
    explorer: 'https://sepolia.etherscan.io'
  }
} as const
'@
Set-Content -Path "src/contracts/addresses.ts" -Value $addressesContent
Write-Host "✅ addresses.ts corrigido" -ForegroundColor Green

# 6. Corrigir utils/security.ts
$securityUtilsContent = @'
export class SecurityManager {
  private static instance: SecurityManager
  private threats: string[] = []

  private constructor() {}

  static getInstance(): SecurityManager {
    if (!SecurityManager.instance) {
      SecurityManager.instance = new SecurityManager()
    }
    return SecurityManager.instance
  }

  validateInput(input: string, type: 'number' | 'address' | 'general'): boolean {
    // Prevenção contra XSS e injeção
    const xssPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi
    ]

    for (const pattern of xssPatterns) {
      if (pattern.test(input)) {
        this.threats.push('Tentativa de XSS detectada')
        return false
      }
    }

    // Validações específicas por tipo
    switch (type) {
      case 'number':
        return /^\d+$/.test(input) && parseInt(input) >= 1 && parseInt(input) <= 25
      case 'address':
        return /^0x[a-fA-F0-9]{40}$/.test(input)
      default:
        return input.length <= 1000 // Limite de caracteres
    }
  }

  sanitizeInput(input: string): string {
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;')
  }

  getSecurityReport() {
    return {
      score: Math.max(0, 100 - (this.threats.length * 10)),
      threats: [...this.threats],
      timestamp: Date.now()
    }
  }

  clearThreats() {
    this.threats = []
  }
}
'@
Set-Content -Path "src/utils/security.ts" -Value $securityUtilsContent
Write-Host "✅ security.ts corrigido" -ForegroundColor Green

Write-Host "`n🎉 Correção concluída com sucesso!" -ForegroundColor Green
Write-Host "📁 Arquivos principais corrigidos:" -ForegroundColor Cyan
Write-Host "   • BettingForm.tsx" -ForegroundColor White
Write-Host "   • ZeroPointsNotification.tsx" -ForegroundColor White
Write-Host "   • Web3Provider.tsx" -ForegroundColor White
Write-Host "   • SecurityAudit.tsx" -ForegroundColor White
Write-Host "   • addresses.ts" -ForegroundColor White
Write-Host "   • security.ts" -ForegroundColor White

Write-Host "`n🚀 Agora execute: npm run dev" -ForegroundColor Yellow
'@ | Out-File -FilePath "fix-content.ps1" -Encoding UTF8

Write-Host "✅ Arquivo fix-content.ps1 criado!" -ForegroundColor Green