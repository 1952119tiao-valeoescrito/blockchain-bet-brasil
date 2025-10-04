import { useState } from 'react'

export function useSimpleBet(betType: 'regular' | 'invest') {
  const [isPlacingBet, setIsPlacingBet] = useState(false)
  
  const placeBet = async (prognosticos: number[]) => {
    setIsPlacingBet(true)
    try {
      // Simulação de uma transação na blockchain
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      console.log('🎯 Aposta simulada realizada:', {
        betType,
        prognosticos,
        value: betType === 'regular' ? 'R$ 5,00' : 'R$ 1.000,00'
      })
      
      // Simular sucesso na aposta
      alert(`✅ Aposta ${betType === 'regular' ? 'Regular' : 'Invest-Bet'} realizada com sucesso!\n\nPrognósticos: ${prognosticos.join(', ')}\nValor: ${betType === 'regular' ? 'R$ 5,00' : 'R$ 1.000,00'}\n\n💰 Bônus de R$ ${betType === 'regular' ? '0,625' : '125,00'} se fizer zero pontos!`)
      
      return { success: true, hash: '0x' + Math.random().toString(16).substr(2, 64) }
    } catch (error) {
      console.error('❌ Erro simulado:', error)
      alert('❌ Erro ao realizar aposta. Tente novamente.')
      throw error
    } finally {
      setIsPlacingBet(false)
    }
  }

  // Dados simulados para desenvolvimento
  return {
    placeBet,
    isPlacingBet,
    accumulatedBonus: betType === 'regular' ? 2.5 : 500, // R$2,50 ou R$500,00 acumulados
    freeBets: betType === 'regular' ? 1 : 2, // 1 ou 2 apostas grátis disponíveis
    isConnected: true, // Simulando carteira conectada
    address: '0x742d35Cc6634C0532925a3b8Dc2388b6c8dC3d6a' // Endereço simulado
  }
}