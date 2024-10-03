import {
  IconActivity,
  IconFileAnalytics,
  IconGift,
  IconSparkles,
  IconWallet,
  TablerIcon,
} from "@tabler/icons-react";
import StakeTab from "./StakeTab";

type TListItem = {
  icon: TablerIcon;
  label: string;
  value: string;
};

export default function Stake() {
  return (
    <div className="max-w-7xl min-w-[1100px] bg-opacity-50 rounded-3xl shadow-lg overflow-hidden flex gap-3 border-2 border-white border-opacity-30">
      <div className="w-1/2 relative before:absolute before:top-0 before:bottom-0 before:right-0 before:w-px before:bg-gradient-to-b before:from-transparent before:via-white before:to-transparent before:opacity-50">
        <StakeTab />
      </div>

      <div className="w-1/2 p-10 ">
        <h2 className="text-xl font-extralight mb-8">About VSL on Euclid</h2>
        <div className="space-y-4 mb-8">
          <ListItem icon={IconGift} label="Rewards" value="33%" />
          <ListItem icon={IconWallet} label="Fees" value="Low" />
          <ListItem icon={IconActivity} label="Unbonding" value="7-10 Days" />
          <ListItem
            icon={IconFileAnalytics}
            label="Value of 1 eEUCL"
            value="1 eEUCL = 1 EUCL"
          />
        </div>
        <div className="bg-green-[#79FFB8] bg-opacity-30 p-4 rounded-xl text-sm font-extralight">
          Want to learn more about rewards, fees and unbonding on Euclid? Check
          out the docs.
        </div>
        <h3 className="text-lg font-extralight mt-8 mb-6">Assets</h3>
        <div className="space-y-4">
          <ListItem
            label="Available to stake"
            icon={IconSparkles}
            value="0 GAS"
          />
          <div className="h-[1px] w-full bg-white" />
          <ListItem label="Liquid staked" icon={IconSparkles} value="0 GAS" />
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
      <span className="text-green-[#79FFB8] font-extralight">{value}</span>
    </div>
  );
}
