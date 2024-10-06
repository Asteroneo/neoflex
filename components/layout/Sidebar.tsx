import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  href: string;
  comingSoon?: boolean;
};

function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="lg:w-64 bg-opacity-50 border-2 p-6 flex flex-col h-[95%] mt-6 mx-6 rounded-xl border-opacity-70 border-white">
      <div className="flex items-center justify-center mb-12">
        <IconSparkles className="w-8 h-8 text-[#79FFB8]" stroke={2} />
        <h1 className="text-3xl font-extralight ml-2">NeoFlex</h1>
      </div>
      <nav className="flex-grow space-y-6">
        <SidebarItem icon={IconLock} text="Staking" href="/" />
        <SidebarItem icon={IconCoins} text="Withdraw" href="/withdraw" />
        <SidebarItem icon={IconBox} text="DeFi" href="#" comingSoon />
        <SidebarItem icon={IconZeppelin} text="Airdrop" href="#" comingSoon />
        <SidebarItem
          icon={IconBuildingBank}
          text="Governance"
          href="#"
          comingSoon
        />
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
  href,
  comingSoon = false,
}: TSidebarItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href} passHref className="block mb-6 last:mb-0">
      <div
        className={`flex items-center p-2 rounded-lg relative ${
          isActive
            ? "bg-gray-800 bg-opacity-50"
            : "hover:bg-gray-800 hover:bg-opacity-50"
        } cursor-pointer`}
      >
        <Icon
          className={`w-6 h-6 mr-3 ${
            isActive ? "text-[#79FFB8]" : "text-gray-400"
          }`}
          strokeWidth={1}
        />
        <span className={`font-semibold ${isActive ? "text-[#79FFB8]" : ""}`}>
          {text}
        </span>
        {comingSoon && (
          <span className="absolute top-0 right-0 bg-[#79FFB8] text-black text-xs px-1 py-0.5 rounded-bl-lg rounded-tr-lg">
            Soon
          </span>
        )}
      </div>
    </Link>
  );
}

export default Sidebar;
