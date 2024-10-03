require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const PRIVATE_KEY = process.env.PRIVATE_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.1",
  networks: {
    hardhat: {}, // Add this for local testing
    neoxTestnet: {
      url: "https://neoxt4seed1.ngd.network",
      chainId: 12227332,
      accounts: [`0x${PRIVATE_KEY}`],
    },
  },
};
