import { useAccount, useReadContract, useWriteContract } from 'wagmi'
import { parseEther } from 'viem'
import { TEST_ADDRESSES } from '@/contracts/addresses'
import BlockchainBetBrasilV2ABI from '@/contracts/abis/BlockchainBetBrasilV2.json'

export function useBlockchainBet(betType: 'regular' | 'invest') {
  const { address, isConnected } = useAccount()
  const { writeContract, isPending: isPlacingBet } = useWriteContract()
  
  const config = {
    regular: {
      address: TEST_ADDRESSES.BLOCKCHAIN_BET_BRASIL,
      value: parseEther('0.005') // R$5,00
    },
    invest: {
      address: TEST_ADDRESSES.INVEST_BET, 
      value: parseEther('1.0') // R$1.000,00
    }
  }[betType]

  // Hook para ler bônus acumulados
  const { data: accumulatedBonus } = useReadContract({
    address: config.address,
    abi: BlockchainBetBrasilV2ABI,
    functionName: 'getBonusAcumulados',
    args: [address!],
    query: {
      enabled: !!address
    }
  })

  // Hook para ler free bets
  const { data: freeBets } = useReadContract({
    address: config.address,
    abi: BlockchainBetBrasilV2ABI,
    functionName: 'getFreeBetsGranted', 
    args: [address!],
    query: {
      enabled: !!address
    }
  })

  // Função para fazer apostas
  const placeBet = async (prognosticos: number[]) => {
    if (!isConnected || !address) {
      throw new Error('Conecte sua carteira primeiro')
    }

    try {
      const result = await writeContract({
        address: config.address,
        abi: BlockchainBetBrasilV2ABI,
        functionName: 'apostar',
        args: [prognosticos],
        value: config.value
      })
      return result
    } catch (error) {
      console.error('Erro ao fazer aposta:', error)
      throw error
    }
  }

  return {
    placeBet,
    isPlacingBet,
    accumulatedBonus: accumulatedBonus ? Number(accumulatedBonus) / 1e6 : 0, // Convertendo para reais
    freeBets: freeBets ? Number(freeBets) : 0,
    isConnected,
    address
  }
}