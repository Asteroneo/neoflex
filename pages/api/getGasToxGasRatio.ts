// File: pages\api\getGasToxGasRatio.ts

// pages/api/getGasToXGasRatio.ts
import { NextApiRequest, NextApiResponse } from "next";
import { createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";
import NeoFlexCoreABI from "@/contracts/artifacts/contracts/NeoFlexCore.sol/NeoFlexCore.json";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CORE_ADDRESS as `0x${string}`;

const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("API route called");
  console.log("Contract Address:", CONTRACT_ADDRESS);

  try {
    console.log("Attempting to read contract");
    const data = await publicClient.readContract({
      address: CONTRACT_ADDRESS,
      abi: NeoFlexCoreABI.abi,
      functionName: "getGasToXGasRatio",
      args: [BigInt(10 ** 18)], // 1 GAS in wei
    });

    console.log("Contract read successful. Raw data:", data);

    if (typeof data === "bigint") {
      console.log("Data is bigint. Sending response.");
      res.status(200).json({ ratio: data.toString() });
    } else {
      console.log("Unexpected data type:", typeof data);
      throw new Error("Unexpected data type");
    }
  } catch (error) {
    console.error("Error fetching Gas to XGas ratio:", error);
    res.status(500).json({
      error: "Failed to fetch Gas to XGas ratio",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
