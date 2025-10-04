// hardhat.config.js

require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  networks: {
    sepolia: {
      url: "https://sepolia.infura.io/v3/SEU_PROJECT_ID",
      accounts: ["SUA_PRIVATE_KEY"]
    }
  }
};