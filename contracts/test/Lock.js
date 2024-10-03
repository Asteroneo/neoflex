const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NeoFlexCore", function () {
  let NeoFlexCore, xGASToken, UnstakeNFT, MockGovernance;
  let neoFlexCore, xGasToken, unstakeNFT, mockGovernance;
  let owner, user1, user2, validator;

  beforeEach(async function () {
    [owner, user1, user2, validator] = await ethers.getSigners();

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

      // Check if all addresses are valid
      console.log("Validator address:", await validator.getAddress());
      expect(await mockGovernance.getAddress()).to.be.properAddress;
      expect(await xGasToken.getAddress()).to.be.properAddress;
      expect(await unstakeNFT.getAddress()).to.be.properAddress;
      expect(await validator.getAddress()).to.be.properAddress;

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
      await neoFlexCore.connect(user1).deposit({ value: depositAmount });

      const xGasBalance = await xGasToken.balanceOf(user1.address);
      expect(xGasBalance).to.be.gt(0);

      const totalStaked = await neoFlexCore.totalStaked();
      expect(totalStaked).to.equal(depositAmount);
    });
  });

  describe("Request Unstake", function () {
    it("Should allow users to request unstake and receive UnstakeNFT", async function () {
      const depositAmount = ethers.parseEther("1");
      await neoFlexCore.connect(user1).deposit({ value: depositAmount });

      const xGasBalance = await xGasToken.balanceOf(user1.address);
      await neoFlexCore.connect(user1).requestUnstake(xGasBalance);

      const nftBalance = await unstakeNFT.balanceOf(user1.address);
      expect(nftBalance).to.equal(1);
    });
  });

  describe("Claim Unstake", function () {
    it("Should allow users to claim unstake after the unstake period", async function () {
      const depositAmount = ethers.parseEther("1");
      await neoFlexCore.connect(user1).deposit({ value: depositAmount });

      const xGasBalance = await xGasToken.balanceOf(user1.address);
      await neoFlexCore.connect(user1).requestUnstake(xGasBalance);

      const nftId = 1; // Assuming this is the first NFT minted

      // Fast forward time
      await ethers.provider.send("evm_increaseTime", [2 * 7 * 24 * 60 * 60]); // 2 weeks
      await ethers.provider.send("evm_mine");

      const balanceBefore = await ethers.provider.getBalance(user1.address);
      await neoFlexCore.connect(user1).claimUnstake(nftId);
      const balanceAfter = await ethers.provider.getBalance(user1.address);

      expect(balanceAfter - balanceBefore).to.be.closeTo(
        depositAmount,
        ethers.parseEther("0.01")
      );
    });
  });

  // ... rest of the test cases ...
});
