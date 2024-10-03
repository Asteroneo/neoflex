// File: utils\chains\neoxChain.ts

import { defineChain } from "viem";

export const neox = defineChain({
  id: 47763,
  name: "NeoX Mainnet",
  network: "neox",
  nativeCurrency: {
    decimals: 18,
    name: "GAS",
    symbol: "GAS",
  },
  rpcUrls: {
    default: {
      http: ["https://mainnet-1.rpc.banelabs.org"],
      webSocket: ["wss://mainnet.wss1.banelabs.org/"],
    },
    public: {
      http: ["https://mainnet-1.rpc.banelabs.org"],
      webSocket: ["wss://mainnet.wss1.banelabs.org/"],
    },
  },
  blockExplorers: {
    default: { name: "NeoX Explorer", url: "https://xexplorer.neo.org" },
  },
});

export const neoxTestnet = defineChain({
  id: 12227332,
  name: "NeoX TestNet",
  network: "neox-testnet",
  nativeCurrency: {
    decimals: 18,
    name: "GAS",
    symbol: "GAS",
  },
  rpcUrls: {
    default: {
      http: ["https://neoxt4seed1.ngd.network"],
      webSocket: ["wss://neoxt4wss1.ngd.network"],
    },
    public: {
      http: ["https://neoxt4seed1.ngd.network"],
      webSocket: ["wss://neoxt4wss1.ngd.network"],
    },
  },
  blockExplorers: {
    default: {
      name: "NeoX TestNet Explorer",
      url: "https://xt4scan.ngd.network",
    },
  },
});
