const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log(
    "Account balance:",
    (await hre.ethers.provider.getBalance(deployer.address)).toString()
  );

  // Calculate gas price
  const feeData = await hre.ethers.provider.getFeeData();
  const gasPrice = feeData.maxFeePerGas.mul(2); // Double the suggested gas price to ensure the transaction goes through
  console.log("Using gas price:", gasPrice.toString());

  // Common deployment options
  const deployOptions = {
    gasPrice: gasPrice,
  };

  // Deploy MockGovernance
  const MockGovernance = await hre.ethers.getContractFactory("MockGovernance");
  const mockGovernance = await MockGovernance.deploy(deployOptions);
  await mockGovernance.waitForDeployment();
  console.log("MockGovernance deployed to:", await mockGovernance.getAddress());

  // Deploy XGASToken
  const XGASToken = await hre.ethers.getContractFactory("XGASToken");
  const xGasToken = await XGASToken.deploy(deployOptions);
  await xGasToken.waitForDeployment();
  console.log("XGASToken deployed to:", await xGasToken.getAddress());

  // Deploy UnstakeNFT
  const UnstakeNFT = await hre.ethers.getContractFactory("UnstakeNFT");
  const unstakeNFT = await UnstakeNFT.deploy(deployOptions);
  await unstakeNFT.waitForDeployment();
  console.log("UnstakeNFT deployed to:", await unstakeNFT.getAddress());

  // Deploy NeoFlexCore
  const NeoFlexCore = await hre.ethers.getContractFactory("NeoFlexCore");
  const neoFlexCore = await NeoFlexCore.deploy(
    await mockGovernance.getAddress(),
    deployer.address, // Using deployer as the initial validator
    await xGasToken.getAddress(),
    await unstakeNFT.getAddress(),
    deployOptions
  );
  await neoFlexCore.waitForDeployment();
  console.log("NeoFlexCore deployed to:", await neoFlexCore.getAddress());

  // Set NeoFlexCore as operator for XGASToken
  await xGasToken.transferOperator(
    await neoFlexCore.getAddress(),
    deployOptions
  );
  console.log("XGASToken operator set to NeoFlexCore");

  // Set NeoFlexCore as operator for UnstakeNFT
  await unstakeNFT.transferOperator(
    await neoFlexCore.getAddress(),
    deployOptions
  );
  console.log("UnstakeNFT operator set to NeoFlexCore");

  console.log("Deployment completed successfully!");

  // Verify contracts
  console.log("Verifying contracts...");

  await verifyContract(await mockGovernance.getAddress(), []);
  await verifyContract(await xGasToken.getAddress(), []);
  await verifyContract(await unstakeNFT.getAddress(), []);
  await verifyContract(await neoFlexCore.getAddress(), [
    await mockGovernance.getAddress(),
    deployer.address,
    await xGasToken.getAddress(),
    await unstakeNFT.getAddress(),
  ]);

  console.log("Verification completed!");
}

async function verifyContract(address, constructorArguments) {
  try {
    await hre.run("verify:verify", {
      address: address,
      constructorArguments: constructorArguments,
    });
    console.log(`Contract at ${address} verified successfully`);
  } catch (error) {
    console.error(`Error verifying contract at ${address}:`, error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
