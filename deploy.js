//  scripts/deploy.js

async function main() {
  const [deployer] = await ethers.getSigners();
  
  console.log('🚀 Implantando contratos com a conta:', deployer.address);
  console.log('💰 Saldo da conta:', (await deployer.getBalance()).toString());

  // Deploy do BBB Regular
  const BBBRegular = await ethers.getContractFactory('BBBRegular');
  const bbbRegular = await BBBRegular.deploy();
  await bbbRegular.deployed();
  console.log('✅ BBB Regular implantado em:', bbbRegular.address);

  // Deploy do InvestBet
  const InvestBet = await ethers.getContractFactory('InvestBet');
  const investBet = await InvestBet.deploy();
  await investBet.deployed();
  console.log('✅ InvestBet implantado em:', investBet.address);

  // Salvar os endereços em um arquivo
  const fs = require('fs');
  const addresses = {
    bbbRegular: bbbRegular.address,
    investBet: investBet.address
  };
  
  fs.writeFileSync('deployed-addresses.json', JSON.stringify(addresses, null, 2));
  console.log('📝 Endereços salvos em deployed-addresses.json');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Erro no deploy:', error);
    process.exit(1);
  });