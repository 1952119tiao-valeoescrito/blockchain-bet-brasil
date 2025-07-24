// src/contracts/index.ts

// A gente importa o ABI do arquivo JSON. 
// Garanta que você tem o arquivo BlockChainBet.json na pasta /src/abi
import BlockchainBetBrasilABI from '@/abi/BlockChainBet.json';

// A gente exporta o endereço e o ABI com os nomes que você quer usar
const BlockchainBetBrasilAddress = '0x00376502EA15B19E5aD363B47126cBF4903cCbD0';

export { BlockchainBetBrasilAddress, BlockchainBetBrasilABI };