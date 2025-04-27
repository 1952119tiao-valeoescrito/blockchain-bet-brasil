require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {  // <-- A chave 'networks' deve estar DENTRO do module.exports!
    mumbai: {
      url: "https://rpc-mumbai.maticvigil.com",
      accounts: ["SUA_PRIVATE_KEY"] // 👈 Substitua pela sua chave privada
    }
  }
};