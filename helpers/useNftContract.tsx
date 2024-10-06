import { useContractRead } from "wagmi";
import { useAccount } from "wagmi";
import UnstakeNFTABI from "@/abi/UnstakeNFT.json";

const NFT_CONTRACT_ADDRESS = process.env
  .NEXT_PUBLIC_NFT_ADDRESS as `0x${string}`;

export const useNftContract = () => {
  const { address } = useAccount();

  const useGetUserTokens = () => {
    const { data, isError, isLoading, refetch } = useContractRead({
      address: NFT_CONTRACT_ADDRESS,
      abi: UnstakeNFTABI.abi,
      functionName: "getUserTokens",
      args: [address as `0x${string}`],
      enabled: !!address,
    });

    return {
      userTokens: data,
      isError,
      isLoading,
      refetch,
    };
  };

  return {
    useGetUserTokens,
  };
};
