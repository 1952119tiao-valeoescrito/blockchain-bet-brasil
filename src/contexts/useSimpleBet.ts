// src/hooks/useSimpleBet.ts 

import { useState } from 'react'

export function useSimpleBet(betType: 'regular' | 'invest') {
  const [isPlacingBet, setIsPlacingBet] = useState(false)
  
  const placeBet = async (prognosticos: number[]) => {
    setIsPlacingBet(true)
    try {
      // Simulação enquanto ajustamos o Wagmi
      await new Promise(resolve => setTimeout(resolve, 2000))
      console.log('Aposta simulada:', { betType, prognosticos })
      alert(`Aposta ${betType === 'regular' ? 'Regular' : 'Invest-Bet'} realizada com sucesso!`)
      return { success: true }
    } catch (error) {
      console.error('Erro simulado:', error)
      throw error
    } finally {
      setIsPlacingBet(false)
    }
  }

  return {
    placeBet,
    isPlacingBet,
    accumulatedBonus: 0, // Valores simulados
    freeBets: 0,
    isConnected: true, // Simulado
    address: '0x742d35Cc6634C0532925a3b8Dc2388b6c8dC3d6a' // Endereço simulado
  }
}