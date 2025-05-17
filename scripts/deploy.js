// scripts/deploy.js

async function main() {
  // ethers é injetado pelo Hardhat Runtime Environment (HRE)
  const [deployer] = await ethers.getSigners();

  console.log("Deploying BlockChainBetBrasil contract with the account:", deployer.address);
  
  const initialBalance = await ethers.provider.getBalance(deployer.address);
  // Em ethers v6, getBalance retorna bigint. formatEther (da lib ethers v6) aceita bigint.
  console.log("Account balance (before deployment):", ethers.formatEther(initialBalance), "ETH");

  const BetBrasilFactory = await ethers.getContractFactory("BlockChainBetBrasil");
  
  console.log("Deploying BlockChainBetBrasil...");
  // Em ethers v6, deploy() retorna uma Promise que resolve para a instância do Contrato.
  // O 'await' aqui garante que esperamos a transação ser enviada e o contrato ser minerado.
  const betBrasil = await BetBrasilFactory.deploy(); 

  // Em ethers v6, o endereço do contrato está em 'contract.target'
  // e a transação de deploy pode ser acessada de forma diferente se necessário,
  // mas geralmente o 'await' acima já é suficiente para ter o 'target' populado.
  
  // Vamos esperar a transação de deploy ser confirmada para garantir.
  // A instância 'betBrasil' tem um método 'waitForDeployment()' em ethers v6
  // ou podemos esperar a 'deploymentTransaction()' que retorna um objeto de transação com .wait()
  console.log("Waiting for deployment to complete...");
  await betBrasil.waitForDeployment(); // Método específico do ethers v6 para esperar o deploy

  const contractAddress = betBrasil.target; // <<<<---- A MUDANÇA PRINCIPAL!
  const deploymentTx = betBrasil.deploymentTransaction(); // Obtém a transação de deploy

  console.log("BlockChainBetBrasil contract instance obtained and deployment confirmed.");
  
  if (contractAddress && typeof contractAddress === 'string' && contractAddress.startsWith('0x')) {
    console.log("----------------------------------------------------");
    console.log("BlockChainBetBrasil deployed successfully!");
    console.log("   Account Used:", deployer.address);
    console.log("   Contract Address (target):", contractAddress);
    if (deploymentTx && deploymentTx.hash) {
      console.log("   Deployment Transaction Hash:", deploymentTx.hash);
    }
    console.log("----------------------------------------------------");
  } else {
    console.error("ERROR: Contract address (target) is undefined or invalid after deployment.");
    console.log("Full contract instance object for debugging:", betBrasil);
  }

  const finalBalance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance (after deployment):", ethers.formatEther(finalBalance), "ETH");
  
  // Compara bigints
  if (initialBalance !== 0n && finalBalance !== 0n) { 
    console.log("Gas spent on deployment (approx):", ethers.formatEther(initialBalance - finalBalance), "ETH");
  }
}

main()
  .then(() => {
    console.log("\nDeployment script finished.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\nError during deployment script execution:", error);
    process.exit(1);
  });