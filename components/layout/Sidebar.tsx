// File: components\layout\Sidebar.tsx
import React from "react";
import {
  IconBox,
  IconBuildingBank,
  IconCoins,
  IconLock,
  IconSparkles,
  IconZeppelin,
  TablerIcon,
} from "@tabler/icons-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

type TSidebarItemProps = {
  icon: TablerIcon;
  text: string;
  active?: boolean;
  comingSoon?: boolean;
};

function Sidebar() {
  return (
    <div className="lg:w-64 bg-opacity-50 border-2 p-6 flex flex-col h-[95%] mt-6 mx-6 rounded-xl border-opacity-70 border-white">
      <div className="flex items-center justify-center mb-12">
        <IconSparkles className="w-8 h-8 text-[#79FFB8]" stroke={2} />
        <h1 className="text-3xl font-extralight ml-2">NeoFlex</h1>
      </div>
      <nav className="flex-grow space-y-6">
        <SidebarItem icon={IconLock} text="Staking" active />
        <SidebarItem icon={IconCoins} text="Assets" comingSoon />
        <SidebarItem icon={IconBox} text="DeFi" comingSoon />
        <SidebarItem icon={IconZeppelin} text="Airdrop" comingSoon />
        <SidebarItem icon={IconBuildingBank} text="Governance" comingSoon />
        <div className="lg:hidden w-full">
					<ConnectButton />
          </div>
      </nav>
      <div className="text-xs text-gray-500 mt-auto text-center">
        Powered By NeoFlex Protocol
      </div>
    </div>
  );
}

function SidebarItem({
  icon: Icon,
  text,
  active = false,
  comingSoon = false,
}: TSidebarItemProps) {
  return (
    <div
      className={`flex items-center p-2 rounded-lg relative ${
        active
          ? "bg-gray-800 bg-opacity-50"
          : "hover:bg-gray-800 hover:bg-opacity-50"
      }`}
    >
      <Icon
        className={`w-6 h-6 mr-3 ${
          active ? "text-[#79FFB8]" : "text-gray-400"
        }`}
        strokeWidth={1}
      />
      <span className={`font-semibold ${active ? "text-[#79FFB8]" : ""}`}>
        {text}
      </span>
      {comingSoon && (
        <span className="absolute top-0 right-0 bg-[#79FFB8] text-black text-xs px-1 py-0.5 rounded-bl-lg rounded-tr-lg">
          Soon
        </span>
      )}
    </div>
  );
}

export default Sidebar;
