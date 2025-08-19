// Caminho: /scripts/deploy.js
import hre from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners(); // Pega a conta


  // CORREÇÃO FINAL: Fornecendo o endereço em minúsculas para forçar a função a calcular o checksum correto.
  const usdcAddress = hre.ethers.getAddress("0x1c7d4b196cb0c7b01d743fbc6116a902379c7a90");
 
  // Preço inicial de 1 USDC (tem 6 casas decimais)
  const initialTicketPrice = hre.ethers.parseUnits("1", 6);

  // Pega o "molde" do contrato
  const BlockChainBetBrasil = await hre.ethers.getContractFactory("BlockChainBetBrasil");

   console.log("Fazendo deploy do contrato com a conta:", deployer.address);
  
  // Inicia o deploy com os argumentos do constutor
  const contract = await BlockChainBetBrasil.deploy(usdcAddress, initialTicketPrice);

  // Espera o deploy ser confirmado na blockchain
  await contract.waitForDeployment();

  const contractAddress = await contract.getAddress();
  console.log(`✅ Contrato BlockChainBetBrasil deployado com sucesso em: ${contractAddress}`);

  // ---- Verificação Automática ----
  console.log("\nAguardando 30 segundos antes de tentar a verificação...");
  await new Promise(resolve => setTimeout(resolve, 30000)); // Espera para o Etherscan registrar o contrato

  try {
    console.log("Verificando contrato no Etherscan...");
    await hre.run("verify:verify", {
      address: contractAddress,
      constructorArguments: [usdcAddress, initialTicketPrice],
    });
    console.log("✅ Contrato verificado com sucesso!");
  } catch (error) {
    console.error("Falha na verificação automática:", error.message);
    console.log("Você pode tentar verificar manualmente mais tarde.");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});