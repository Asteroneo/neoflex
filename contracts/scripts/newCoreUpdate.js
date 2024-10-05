const hre = require("hardhat");

// Static addresses for xGAS and NFT
const XGAS_ADDRESS = "0x790038733898005D456eD605063ea9011a47Cc32";
const NFT_ADDRESS = "0x4388807e06140a7954c14524aE779CD1fB3D24F2";
const VALIDATOR = "0x84a32405966791d077811d4E9f21B43b1E7dd911";
const GOVERNANCE = "0x1212000000000000000000000000000000000001";

// Minimum gas limit
const MIN_GAS_LIMIT = 5000000n;

async function estimateGasLimit(contract, args) {
  try {
    const deploymentData = contract.interface.encodeDeploy(args);
    const estimatedGas = await contract.runner.provider.estimateGas({
      data: deploymentData,
    });
    const bufferedGas = (estimatedGas * 120n) / 100n; // Add 20% buffer
    return bufferedGas > MIN_GAS_LIMIT ? bufferedGas : MIN_GAS_LIMIT;
  } catch (error) {
    console.warn("Gas estimation failed:", error.message);
    return MIN_GAS_LIMIT;
  }
}

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log(
    "Account balance:",
    (await hre.ethers.provider.getBalance(deployer.address)).toString()
  );

  // Calculate gas price
  const feeData = await hre.ethers.provider.getFeeData();
  const gasPrice = feeData.maxFeePerGas * 1n; // Double the suggested gas price
  console.log("Using gas price:", gasPrice.toString());

  try {
    // Deploy NewCoreContract
    const NewCoreContract = await hre.ethers.getContractFactory("NeoFlexCore");
    console.log("Estimating gas for NeoFlexCore deployment...");
    const gasLimit = await estimateGasLimit(NewCoreContract, [
      GOVERNANCE,
      VALIDATOR,
      XGAS_ADDRESS,
      NFT_ADDRESS,
    ]);
    console.log("Gas limit to be used:", gasLimit.toString());

    console.log("Deploying NeoFlexCore...");
    const newCoreContract = await NewCoreContract.deploy(
      GOVERNANCE,
      VALIDATOR,
      XGAS_ADDRESS,
      NFT_ADDRESS,
      { gasLimit, gasPrice }
    );

    console.log("Waiting for deployment...");
    const deploymentResult = await newCoreContract.waitForDeployment();
    console.log("Deployment result:", deploymentResult);

    const newCoreAddress = await newCoreContract.getAddress();
    console.log("NeoFlexCore deployed to:", newCoreAddress);

    // Update operators
    console.log("Updating XGASToken operator...");
    const xGasToken = await hre.ethers.getContractAt("XGASToken", XGAS_ADDRESS);
    const txXGas = await xGasToken.transferOperator(newCoreAddress, {
      gasPrice,
    });
    await txXGas.wait();
    console.log("XGASToken operator set to NeoFlexCore");

    console.log("Updating UnstakeNFT operator...");
    const unstakeNFT = await hre.ethers.getContractAt(
      "UnstakeNFT",
      NFT_ADDRESS
    );
    const txNFT = await unstakeNFT.transferOperator(newCoreAddress, {
      gasPrice,
    });
    await txNFT.wait();
    console.log("UnstakeNFT operator set to NeoFlexCore");

    console.log("Deployment completed successfully!");

    // Verify contracts
    console.log("Verifying contracts...");
    await verifyContract(newCoreAddress, [
      GOVERNANCE,
      VALIDATOR,
      XGAS_ADDRESS,
      NFT_ADDRESS,
    ]);
    console.log("Verification completed!");
  } catch (error) {
    console.error("Deployment failed with error:", error);
    if (error.reason) console.error("Error reason:", error.reason);
    if (error.code) console.error("Error code:", error.code);
    if (error.transaction)
      console.error("Error transaction:", error.transaction);
    if (error.receipt) console.error("Error receipt:", error.receipt);
  }
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
