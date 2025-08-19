// Este é o conteúdo CORRETO para o arquivo hardhat.config.cjs

require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config(); // Importa e configura o dotenv
require("@nomicfoundation/hardhat-verify");

// Pega as variáveis do arquivo .env
const { SEPOLIA_RPC_URL, PRIVATE_KEY, ETHERSCAN_API_KEY } = process.env;
console.log(">>>> DEBUG: Valor lido para SEPOLIA_RPC_URL:", SEPOLIA_RPC_URL);
// Exporta a configuração para o Hardhat
module.exports = {
  solidity: "0.8.24",
  networks: {
    sepolia: {
      url: SEPOLIA_RPC_URL || "", // Se a URL não for encontrada no .env, usa uma string vazia
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [], // Só adiciona a conta se a chave privada existir
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY || "",
  },
};