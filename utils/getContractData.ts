// File: /utils/getContractData.ts

import { createPublicClient, http, parseEther } from "viem";
import NeoFlexCoreABI from "@/contracts/artifacts/contracts/NeoFlexCore.sol/NeoFlexCore.json";
import { neoxTestnet } from "./chains/neoxChain";
import { formatEther } from "viem";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CORE_ADDRESS as `0x${string}`;

export async function getGasToXGasRatio() {
  const client = createPublicClient({
    chain: neoxTestnet, // Use the correct chain
    transport: http(),
  });

  try {
    console.log("Fetching Gas to XGas ratio serverside");
    const data = await client.readContract({
      address: CONTRACT_ADDRESS,
      abi: NeoFlexCoreABI.abi,
      functionName: "getGasToXGasRatio",
      args: [parseEther("1")], // 1 GAS in wei
    });

    return data ? formatEther(data as bigint) : null;
  } catch (error) {
    console.error("Error fetching Gas to XGas ratio server:", error);
    return null;
  }
}

export async function getXGasToGasRatio() {
  const client = createPublicClient({
    chain: neoxTestnet, // Use the correct chain
    transport: http(),
  });

  try {
    console.log("Fetching Gas to XGas ratio serverside");
    const data = await client.readContract({
      address: CONTRACT_ADDRESS,
      abi: NeoFlexCoreABI.abi,
      functionName: "getXGasToGasRatio",
      args: [parseEther("1")], // 1 GAS in wei
    });

    return data ? formatEther(data as bigint) : null;
  } catch (error) {
    console.error("Error fetching Gas to XGas ratio server:", error);
    return null;
  }
}

export async function getTotalStaked() {
  const client = createPublicClient({
    chain: neoxTestnet,
    transport: http(),
  });

  try {
    console.log("Fetching total staked amount serverside");
    const data = await client.readContract({
      address: CONTRACT_ADDRESS,
      abi: NeoFlexCoreABI.abi,
      functionName: "totalStaked",
    });

    return data ? formatEther(data as bigint) : null;
  } catch (error) {
    console.error("Error fetching total staked amount server:", error);
    return null;
  }
}
