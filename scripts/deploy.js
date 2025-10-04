import { ethers } from "hardhat";
import { writeFileSync } from "fs";

async function main() {
  console.log('🚀 Iniciando deploy...');
  
  const [deployer] = await ethers.getSigners();
  console.log('📦 Deploying com a conta:', deployer.address);

  // Deploy do BBB Regular
  const BBBRegular = await ethers.getContractFactory("BBBRegular");
  const bbbRegular = await BBBRegular.deploy();
  await bbbRegular.deployed();
  console.log('✅ BBB Regular:', bbbRegular.address);

  // Deploy do InvestBet
  const InvestBet = await ethers.getContractFactory("InvestBet");
  const investBet = await InvestBet.deploy();
  await investBet.deployed();
  console.log('✅ InvestBet:', investBet.address);

  // Salvar endereços
  const addresses = {
    BBBRegular: bbbRegular.address,
    InvestBet: investBet.address,
    network: 'sepolia'
  };
  
  writeFileSync('deployed-addresses.json', JSON.stringify(addresses, null, 2));
  console.log('📝 Endereços salvos!');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });