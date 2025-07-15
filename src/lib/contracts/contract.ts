import { abi as gameManagerAbi } from './abi/GameManagerABI';

// AGORA APONTA PARA O ENDEREÇO DO SEU GameManager
export const CONTRACT_ADDRESS = 'MANAGER_ADDRESS'; // Cole o endereço do GameManager aqui

export const contractConfig = {
  address: CONTRACT_ADDRESS as `0x${string}`,
  abi: gameManagerAbi,
} as const;