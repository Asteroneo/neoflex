// File: components\layout\Stake\Stake.tsx

import {
  IconActivity,
  IconFileAnalytics,
  IconGift,
  IconSparkles,
  IconWallet,
  TablerIcon,
} from "@tabler/icons-react";
import StakeTab from "./StakeTab";
import { useBalance } from "@/utils/fetchBalance"; // Import the improved hook

type TListItem = {
  icon: TablerIcon;
  label: string;
  value: string;
};

interface StakeProps {
  xGasToGasRatio: string | null;
}

export default function Stake({ xGasToGasRatio }: StakeProps) {
  const {
    balance: gasBalance,
    isLoading: isGasLoading,
    error: gasError,
  } = useBalance(); // Use the hook for GAS balance
  const {
    balance: xGasBalance,
    isLoading: isXGasLoading,
    error: xGasError,
  } = useBalance(process.env.NEXT_PUBLIC_XGAS_ADDRESS as `0x${string}`); // Ensure the address is in the correct format

  return (
    <div className="max-w-7xl min-w-[1100px] bg-opacity-50 rounded-3xl shadow-lg overflow-hidden flex gap-3 border-2 border-white border-opacity-30">
      <div className="w-1/2 relative before:absolute before:top-0 before:bottom-0 before:right-0 before:w-px before:bg-gradient-to-b before:from-transparent before:via-white before:to-transparent before:opacity-50">
        <StakeTab xGasToGasRatio={xGasToGasRatio} />
      </div>

      <div className="w-1/2 p-10 ">
        <h2 className="text-xl font-extralight mb-8">About xGAS on NeoX</h2>
        <div className="space-y-4 mb-8">
          <ListItem icon={IconGift} label="Rewards" value="7.5% APR" />
          <ListItem icon={IconWallet} label="Fees" value="0%" />
          <ListItem icon={IconActivity} label="Unbonding" value="14 Days" />
          <ListItem
            icon={IconFileAnalytics}
            label="Ratio of xGAS"
            value={` ${
              xGasToGasRatio ? parseFloat(xGasToGasRatio).toFixed(4) : "N/A"
            } GAS`}
          />
        </div>
        <div className="bg-green-[#79FFB8] bg-opacity-30 p-4 rounded-xl text-sm font-extralight">
          Want to learn more about rewards, fees and unbonding on Neox? Check
          out the docs.
        </div>
        <h3 className="text-lg font-extralight mt-8 mb-6">Assets</h3>
        <div className="space-y-4">
          <ListItem
            label="Available to stake"
            icon={IconSparkles}
            value={
              isGasLoading
                ? "Loading..."
                : `${parseFloat(gasBalance).toFixed(2)} GAS`
            }
          />
          <div className="h-[1px] w-full bg-white" />
          <ListItem
            label="Your Liquid staked"
            icon={IconSparkles}
            value={
              isXGasLoading
                ? "Loading..."
                : `${parseFloat(xGasBalance) * Number(xGasToGasRatio)} GAS`
            }
          />{" "}
        </div>
      </div>
    </div>
  );
}

function ListItem({ icon: Icon, label, value }: TListItem) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <Icon className="w-8 h-8 mr-3 text-green-[#79FFB8]" strokeWidth={1} />
        <span className="font-extralight">{label}</span>
      </div>
      <span className="text-green-[#79FFB8] font-bold">{value}</span>
    </div>
  );
}
