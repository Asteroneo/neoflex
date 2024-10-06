import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { IconGlobe, IconSparkles } from "@tabler/icons-react";
import { Button } from "@/components/ui/Button";
import { useNftContract } from "@/helpers/useNftContract";
import { useAccount } from "wagmi";
import { SquareDashedMousePointer } from "lucide-react";
import { formatEther } from "viem";
import Link from "next/link";

interface UnstakeRequest {
  amount: bigint;
  mintTime: bigint;
  user: `0x${string}`;
}

export default function WithdrawTable() {
  const { address } = useAccount();
  const { useGetUserTokens } = useNftContract();
  const { userTokens, isLoading, isError } = useGetUserTokens();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // Return null on server-side
  }

  if (isLoading) {
    return (
      <div className="lg:max-w-7xl lg:min-w-[1100px] min-h-[80%] p-8 bg-opacity-50 rounded-3xl shadow-lg overflow-hidden border-2 border-white border-opacity-30">
        <h1 className="text-xl font-bold">Withdraw Requests</h1>
        <div className="h-1" />
        <p className="text-[#989898]">Loading...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="lg:max-w-7xl lg:min-w-[1100px] min-h-[80%] p-8 bg-opacity-50 rounded-3xl shadow-lg overflow-hidden border-2 border-white border-opacity-30">
        <h1 className="text-xl font-bold">Withdraw Requests</h1>
        <div className="h-1" />
        <p className="text-[#989898]">Error fetching data</p>
      </div>
    );
  }

  const [tokenIds, unstakeRequests] = (userTokens as [
    bigint[],
    UnstakeRequest[]
  ]) || [[], []];

  return (
    <div className="lg:max-w-7xl lg:min-w-[1100px] min-h-[80%] p-12 bg-opacity-50 rounded-3xl shadow-lg overflow-hidden border-2 border-white border-opacity-30">
      <h1 className="text-xl font-bold">Withdraw Requests</h1>
      <div className="h-1" />
      <p className="text-[#989898]">
        Please check the current status of your unbonding requests.<br></br>{" "}
        Note that there is a 14-day unbonding period required to revoke your
        vote from the node before you can withdraw.
      </p>
      <div className="h-8" />
      {!tokenIds.length ? (
        <div className="w-full h-max bg-[#1a1b1f] bg-opacity-50 rounded-lg flex flex-col items-center justify-center p-8 min-h-[450px]">
          <SquareDashedMousePointer className="w-16 h-16 mb-4 text-gray-400" />
          <p className="text-xl text-gray-400">
            You don't have any withdraw request.
          </p>
        </div>
      ) : (
        <div className="rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-[transparent]">
                <TableHead>Event Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Unlocking Time</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="bg-[#1a1b1f]">
              {unstakeRequests.map((request: UnstakeRequest, index: number) => {
                const twoWeeksInSeconds = BigInt(2 * 7 * 24 * 60 * 60);
                const unlockingTimestamp = request.mintTime + twoWeeksInSeconds;
                const unlockingTime = new Date(
                  Number(unlockingTimestamp) * 1000
                );
                const isButtonDisabled = Date.now() < unlockingTime.getTime();
                const amountInEther = parseFloat(
                  formatEther(request.amount)
                ).toFixed(4);

                return (
                  <TableRow key={index} className="h-14">
                    <TableCell className="font-medium">xGas Withdraw</TableCell>
                    <TableCell className="font-extrabold text-[#79FFB8]">
                      {amountInEther} GAS
                    </TableCell>
                    <TableCell>{unlockingTime.toLocaleString()}</TableCell>
                    <TableCell className="flex items-center justify-start h-fit">
                      <div className="flex items-center">
                        <IconSparkles
                          className="w-4 h-4 text-[#79FFB8]"
                          stroke={2}
                        />
                        <h3 className="text-base font-extralight ml-2">
                          NeoFlex
                        </h3>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        type="submit"
                        className="w-full bg-[#79FFB8] text-black"
                        disabled={isButtonDisabled}
                      >
                        {isButtonDisabled ? "Locked" : "Withdraw"}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
              {/* Static row with dotted border */}
              <TableRow className="h-16 border-t border-dashed border-[#252327] bg-opacity-40">
                <TableCell colSpan={5} className="text-center text-white">
                  Add additional withdraw request in the{" "}
                  <Link href="/" className="text-[#79FFB8] hover:underline">
                    dashboard
                  </Link>{" "}
                  page
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
