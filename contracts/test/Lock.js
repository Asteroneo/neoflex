const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NeoFlexCore on Forked Network", function () {
  let NeoFlexCore, xGASToken, UnstakeNFT, MockGovernance;
  let neoFlexCore, xGasToken, unstakeNFT, mockGovernance;
  let owner, user1, user2, validator;

  beforeEach(async function () {
    [owner, user1, user2, validator] = await ethers.getSigners();

    // Fund accounts with GAS
    const fundAmount = ethers.parseEther("100");
    await ethers.provider.send("hardhat_setBalance", [
      owner.address,
      ethers.toQuantity(fundAmount),
    ]);
    await ethers.provider.send("hardhat_setBalance", [
      user1.address,
      ethers.toQuantity(fundAmount),
    ]);
    await ethers.provider.send("hardhat_setBalance", [
      user2.address,
      ethers.toQuantity(fundAmount),
    ]);

    try {
      // Deploy mock contracts
      MockGovernance = await ethers.getContractFactory("MockGovernance");
      mockGovernance = await MockGovernance.deploy();
      console.log("Governance Deployed at:", await mockGovernance.getAddress());

      XGASToken = await ethers.getContractFactory("XGASToken");
      xGasToken = await XGASToken.deploy();
      console.log("XGAS Deployed at:", await xGasToken.getAddress());

      UnstakeNFT = await ethers.getContractFactory("UnstakeNFT");
      unstakeNFT = await UnstakeNFT.deploy();
      console.log("UnstakeNFT Deployed at:", await unstakeNFT.getAddress());

      // Deploy NeoFlexCore
      console.log("Starting Core Deployment");
      NeoFlexCore = await ethers.getContractFactory("NeoFlexCore");
      neoFlexCore = await NeoFlexCore.deploy(
        await mockGovernance.getAddress(),
        await validator.getAddress(),
        await xGasToken.getAddress(),
        await unstakeNFT.getAddress()
      );
      console.log("Core Deployed at:", await neoFlexCore.getAddress());

      // Set NeoFlexCore as operator for xGASToken and UnstakeNFT
      await xGasToken.transferOperator(await neoFlexCore.getAddress());
      console.log("Operator Updated for xGas");

      await unstakeNFT.transferOperator(await neoFlexCore.getAddress());
      console.log("Operator Updated for NFT");
    } catch (error) {
      console.error("Error in beforeEach:", error);
      throw error;
    }
  });

  describe("Deposit", function () {
    it("Should allow users to deposit GAS and receive xGAS", async function () {
      const depositAmount = ethers.parseEther("1");

      console.log(
        "User1 balance before deposit:",
        ethers.formatEther(await ethers.provider.getBalance(user1.address))
      );

      const tx = await neoFlexCore
        .connect(user1)
        .deposit({ value: depositAmount });
      await tx.wait(); // Wait for the transaction to be mined

      console.log(
        "User1 balance after deposit:",
        ethers.formatEther(await ethers.provider.getBalance(user1.address))
      );

      const xGasBalance = await xGasToken.balanceOf(user1.address);
      console.log("User1 xGAS balance:", ethers.formatEther(xGasBalance));

      expect(xGasBalance).to.be.gt(0);

      const totalStaked = await neoFlexCore.totalStaked();
      expect(totalStaked).to.equal(depositAmount);
    });
  });

  // ... rest of the test cases ...
});
