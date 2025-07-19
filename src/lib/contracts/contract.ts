import { abi as gameManagerAbi } from './abi/GameManagerABI';

// AGORA APONTA PARA O ENDEREÇO DO SEU GameManager
export const BlockchainBetBrasilAddress = 'MANAGER_ADDRESS'; // Cole o endereço do GameManager aqui

export const contractConfig = {
  address: BlockchainBetBrasilAddress as `0x${string}`,
  abi: gameManagerAbi,
} as const;