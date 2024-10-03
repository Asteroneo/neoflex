require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const NEOX_RPC_URL = process.env.NEOX_RPC_URL;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.1",
  networks: {
    hardhat: {
      forking: {
        url: NEOX_RPC_URL,
        blockNumber: 524004, // Specify a block number if you want to fork from a specific block
      },
    },
    neoxTestnet: {
      url: NEOX_RPC_URL,
      chainId: 12227332,
      accounts: [`0x${PRIVATE_KEY}`],
    },
  },
  etherscan: {
    customChains: [
      {
        network: "neoxTestnet",
        chainId: 12227332,
        urls: {
          apiURL: "https://xt4scan.ngd.network/api",
          browserURL: "https://xt4scan.ngd.network",
        },
      },
    ],
  },
};
