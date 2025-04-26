const { expect } = require("chai");

describe("BetBrasil", function () {
  let bet;
  let owner, player;

  beforeEach(async () => {
    [owner, player] = await ethers.getSigners();
    const BetBrasil = await ethers.getContractFactory("BetBrasil");
    bet = await BetBrasil.deploy();
  });

  it("Deve aceitar apostas válidas", async () => {
    await bet.connect(player).bet(42, { value: ethers.utils.parseEther("0.01") });
    expect(await bet.winningNumber()).to.equal(42);
  });

  it("Deve falhar com valor incorreto", async () => {
    await expect(
      bet.connect(player).bet(42, { value: ethers.utils.parseEther("0.02") })
    ).to.be.revertedWith("Valor exato: 0.01 MATIC");
  });
});