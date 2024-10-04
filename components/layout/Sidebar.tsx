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

type TSidebarItemProps = {
  icon: TablerIcon;
  text: string;
  active?: boolean;
};
function Sidebar() {
  return (
    <div className="w-64 bg-opacity-50 border-2 p-6 flex flex-col h-5/6 h-[95%] mt-6 mx-6 rounded-xl border-opacity-70 border-white">
      <div className="flex items-center justify-center mb-12">
        <IconSparkles className="w-8 h-8 text-[#79FFB8]" stroke={2} />
        <h1 className="text-3xl font-extralight ml-2">NeoFlex</h1>
      </div>
      <nav className="flex-grow space-y-6">
        <SidebarItem icon={IconLock} text="Staking" active />
        <SidebarItem icon={IconCoins} text="Assets" />
        <SidebarItem icon={IconBox} text="DeFi" />
        <SidebarItem icon={IconZeppelin} text="Airdrop" />
        <SidebarItem icon={IconBuildingBank} text="Governance" />
      </nav>
      <div className="text-xs text-gray-500 mt-auto text-center">
        Powered By NeoFlex Protocol
      </div>
    </div>
  );
}

function SidebarItem({ icon: Icon, text, active = false }: TSidebarItemProps) {
  return (
    <div
      className={`flex items-center p-2 rounded-lg  ${
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
    </div>
  );
}

export default Sidebar;
