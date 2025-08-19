// Caminho: /src/constants/index.ts

/**
 * ARQUIVO CENTRAL DE CONSTANTES DA BLOCKCHAIN
 * 
 * Este arquivo é a "fonte da verdade" para a comunicação do front-end
 * com o smart contract.
 */

// 1. ENDEREÇO DO CONTRATO
// Após fazer o deploy do seu smart contract na rede (ex: Sepolia, Polygon),
// cole o endereço gerado aqui.
export const contractAddress = '0x...COLE_SEU_ENDEREÇO_AQUI' as const;


// 2. ABI (Application Binary Interface) DO CONTRATO
// Esta é a representação JSON de todas as funções, eventos e variáveis
// do seu contrato. Após compilar o contrato com Hardhat, copie o array "abi"
// completo do arquivo de artefato e cole aqui.
export const contractABI = [
  //
  // COLE SUA ABI FINAL E COMPLETA AQUI
  //
  // Exemplo de como a função 'apostar' deve se parecer na versão final (com USDC):
  // {
  //   "type": "function", "name": "apostar",
  //   "inputs": [
  //     { "name": "_prognosticosX", "type": "uint256[5]" },
  //     { "name": "_prognosticosY", "type": "uint256[5]" }
  //   ],
  //   "outputs": [],
  //   "stateMutability": "nonpayable" // Não é mais 'payable'
  // },
  // ... resto da sua ABI
] as const;