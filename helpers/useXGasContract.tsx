import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  erc20ABI,
} from "wagmi";
import { parseEther } from "viem";

const XGAS_ADDRESS = process.env.NEXT_PUBLIC_XGAS_ADDRESS as `0x${string}`;
const CORE_CONTRACT_ADDRESS = process.env
  .NEXT_PUBLIC_CORE_ADDRESS as `0x${string}`;

export const useXGasContract = () => {
  const { address } = useAccount();

  const useXGasAllowance = () => {
    const { data, isError, isLoading, refetch } = useContractRead({
      address: XGAS_ADDRESS,
      abi: erc20ABI,
      functionName: "allowance",
      args: [address as `0x${string}`, CORE_CONTRACT_ADDRESS],
      enabled: !!address,
    });

    return {
      allowance: data,
      isError,
      isLoading,
      refetch,
    };
  };

  const useApproveXGas = () => {
    const { config } = usePrepareContractWrite({
      address: XGAS_ADDRESS,
      abi: erc20ABI,
      functionName: "approve",
      args: [CORE_CONTRACT_ADDRESS, parseEther("1000000000")], // Approve a large amount
    });

    const { write, data, isLoading, isSuccess, error } =
      useContractWrite(config);

    return {
      approve: write,
      data,
      isLoading,
      isSuccess,
      error,
    };
  };

  return {
    useXGasAllowance,
    useApproveXGas,
  };
};
