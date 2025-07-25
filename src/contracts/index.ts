// src/contracts/index.ts - A CURA DEFINITIVA

import BlockchainBetBrasilABI from '../abi/BlockChainBet.json';

// A CURA ESTÁ AQUI: A gente usa 'as const' para transformar a string em um tipo super específico.
const BlockchainBetBrasilAddress = '0x00376502EA15B19E5aD363B47126cBF4903cCbD0' as const;

export { BlockchainBetBrasilAddress, BlockchainBetBrasilABI };