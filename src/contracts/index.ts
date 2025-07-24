// src/contracts/index.ts - VERSÃO À PROVA DE BALAS

// A CURA: Trocamos o atalho do GPS ('@/') pelo caminho na trilha ('../').
// Isso não depende de nenhuma configuração e é à prova de erro.
// O caminho significa: "a partir daqui, volte uma pasta (para 'src'), depois entre na pasta 'abi'".
import BlockchainBetBrasilABI from '../abi/BlockChainBet.json';

const BlockchainBetBrasilAddress = '0x00376502EA15B19E5aD363B47126cBF4903cCbD0';

// Agora o export vai funcionar, pois a importação acima não tem como falhar.
export { BlockchainBetBrasilAddress, BlockchainBetBrasilABI };