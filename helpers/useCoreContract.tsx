// File: helpers\useCoreContract.tsx

import { parseEther } from "viem";
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
  useContractRead,
} from "wagmi";
import NeoFlexCoreABI from "@/contracts/artifacts/contracts/NeoFlexCore.sol/NeoFlexCore.json";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CORE_ADDRESS as `0x${string}`;

export const useSmartContract = () => {
  const useDeposit = (amount: number) => {
    const { config } = usePrepareContractWrite({
      address: CONTRACT_ADDRESS,
      abi: NeoFlexCoreABI.abi,
      functionName: "deposit",
      value: parseEther(amount.toString()),
      enabled: amount > 0,
    });

    const { data, write, isLoading: isWriteLoading } = useContractWrite(config);

    const { isLoading: isTransactionLoading, isSuccess } =
      useWaitForTransaction({
        hash: data?.hash,
      });

    return {
      write,
      isWriteLoading,
      isTransactionLoading,
      isSuccess,
    };
  };

  const useGasToXGasRatio = () => {
    const { data, isError, isLoading } = useContractRead({
      address: CONTRACT_ADDRESS,
      abi: NeoFlexCoreABI.abi,
      functionName: "getGasToXGasRatio",
      args: [parseEther("1")], // Pass 1 GAS (10^18 wei) as the argument
    });

    return {
      ratio: data,
      isError,
      isLoading,
    };
  };

  // Add other contract functions here as needed

  return {
    useDeposit,
    useGasToXGasRatio,
  };
};
