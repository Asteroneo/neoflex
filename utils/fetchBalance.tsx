import { useState, useEffect } from "react";
import { useAccount, usePublicClient, useContractRead } from "wagmi";
import { formatEther, parseEther } from "viem";
import { erc20ABI } from "wagmi";

export function useBalance(tokenAddress?: `0x${string}`) {
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();
  const [balance, setBalance] = useState<string>("0");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const { data: erc20Balance, isError: isErc20Error } = useContractRead({
    address: tokenAddress,
    abi: erc20ABI,
    functionName: "balanceOf",
    args: [address as `0x${string}`],
    enabled: !!address && !!tokenAddress && isConnected,
  });

  useEffect(() => {
    async function fetchBalance() {
      if (!isConnected || !address) {
        setBalance("0");
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        if (tokenAddress) {
          // ERC20 token balance
          if (isErc20Error) {
            throw new Error("Failed to fetch ERC20 balance");
          }
          setBalance(formatEther(erc20Balance || BigInt(0)));
        } else {
          // Native token (GAS) balance
          const fetchedBalance = await publicClient.getBalance({ address });
          setBalance(formatEther(fetchedBalance));
        }
      } catch (err) {
        console.error("Error fetching balance:", err);
        setError(
          err instanceof Error ? err : new Error("Unknown error occurred")
        );
        setBalance("0");
      } finally {
        setIsLoading(false);
      }
    }

    fetchBalance();
  }, [
    address,
    tokenAddress,
    publicClient,
    erc20Balance,
    isErc20Error,
    isConnected,
  ]);

  return { balance, isLoading, error };
}
