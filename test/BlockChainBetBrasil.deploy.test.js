const { expect } = require("chai");
const { ethers } = require("hardhat"); // ethers é injetado pelo Hardhat Runtime Environment

describe("BlockChainBetBrasil Contract - Deployment", function () {
  let BetBrasilFactory;
  let betBrasilContract;
  let deployer;
  let initialBalance;

  // Este bloco `beforeEach` será executado antes de cada teste (`it`) dentro deste `describe`
  beforeEach(async function () {
    // Pega a conta que fará o deploy (a primeira da lista de signers do Hardhat)
    [deployer] = await ethers.getSigners();

    // Guarda o saldo inicial do deployer para verificar o custo do gás depois
    initialBalance = await ethers.provider.getBalance(deployer.address);

    // Pega a "fábrica" (ContractFactory) para o nosso contrato
    BetBrasilFactory = await ethers.getContractFactory("BlockChainBetBrasil");

    // Faz o deploy do contrato
    // console.log("Deploying BlockChainBetBrasil for test..."); // Opcional para debug
    betBrasilContract = await BetBrasilFactory.deploy(/* Se o seu construtor tiver argumentos, passe-os aqui */);
    
    // Espera o contrato ser minerado e o deploy ser confirmado
    await betBrasilContract.waitForDeployment();
    // console.log("Contract deployed to:", betBrasilContract.target); // Opcional para debug
  });

  it("Should deploy the contract successfully", async function () {
    // Verifica se o contrato tem um endereço válido após o deploy
    // `betBrasilContract.target` contém o endereço do contrato em ethers v6
    expect(betBrasilContract.target).to.be.properAddress;
    expect(betBrasilContract.target).to.not.be.undefined;
    expect(betBrasilContract.target).to.not.be.null;
  });

  it("Should set the deployer as the owner (if an 'owner' function exists)", async function () {
    // Esta asserção só faz sentido SE o seu contrato BlockChainBetBrasil
    // tiver uma variável de estado pública `owner` ou uma função `owner()`
    // que retorne o endereço do proprietário.
    // Se não tiver, você pode remover ou adaptar este teste.
    if (typeof betBrasilContract.owner === 'function') {
      expect(await betBrasilContract.owner()).to.equal(deployer.address);
    } else {
      this.skip(); // Pula o teste se a função owner não existir, com uma mensagem
      // console.warn("Skipping owner test: contract does not have an 'owner' function or public variable.");
    }
  });

  it("Should have a deployment transaction hash", async function () {
    const deploymentTx = betBrasilContract.deploymentTransaction();
    expect(deploymentTx).to.not.be.null;
    expect(deploymentTx.hash).to.be.a('string');
    expect(deploymentTx.hash).to.match(/^0x[0-9a-fA-F]{64}$/); // Verifica se é um hash de transação válido
  });
  
  it("Should reduce the deployer's balance after deployment (due to gas costs)", async function () {
    const finalBalance = await ethers.provider.getBalance(deployer.address);
    // Em ethers v6, getBalance retorna BigInt. A comparação deve ser feita com BigInts.
    expect(finalBalance).to.be.a('bigint');
    expect(initialBalance).to.be.a('bigint');
    // O saldo final deve ser menor que o inicial (assumindo que o gás foi pago)
    // Pode haver casos onde a rede de teste não cobre gás, mas geralmente cobre.
    if (initialBalance > 0n) { // Só faz sentido se o saldo inicial não for zero
        expect(finalBalance).to.be.lt(initialBalance); // lt = less than
    } else {
        console.warn("Skipping gas cost check: initial balance was zero.");
    }
  });

  // Você pode adicionar mais testes relacionados ao estado inicial do contrato após o deploy.
  // Por exemplo, se o construtor define algum valor inicial:
  /*
  it("Should initialize 'someValue' correctly if set by constructor", async function() {
    // Supondo que seu contrato tenha uma função `getSomeValue()` ou uma variável pública `someValue`
    // E que o construtor defina `someValue` para, por exemplo, 100.
    // expect(await betBrasilContract.getSomeValue()).to.equal(100);
  });
  */
});