// File: components\layout\Stake\StakeTab.tsx

import { cn } from "@/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/Tab";
import StakeForm from "./StakeForm";
import { useState } from "react";

interface StakeTabProps {
  xGasToGasRatio: string | null;
}

export default function StakeTab({ xGasToGasRatio }: StakeTabProps) {
  const [activeTab, setActiveTab] = useState("stake");

  return (
    <Tabs
      defaultValue="stake"
      className="p-10 min-h-[727px]"
      onValueChange={(value) => setActiveTab(value)}
    >
      <TabsList>
        <TabsTrigger
          value="stake"
          className={cn(
            "h-10  px-4 mr-4 font-light text-lg",
            activeTab === "stake"
              ? "text-[#79FFB8] border-b border-[#79FFB8] rounded-none"
              : "text-gray-400"
          )}
        >
          Stake
        </TabsTrigger>

        <TabsTrigger
          value="unstake"
          className={cn(
            "text-lg font-light",
            activeTab === "unstake"
              ? "text-[#79FFB8] border-b border-[#79FFB8] rounded-none"
              : "text-gray-400"
          )}
        >
          Unstake
        </TabsTrigger>
      </TabsList>
      <TabsContent value="stake">
        <div className="h-6" />
        <StakeForm activeTab={activeTab} xGasToGasRatio={xGasToGasRatio} />
      </TabsContent>
      <TabsContent value="unstake">
        <div className="h-6" />
        <StakeForm activeTab={activeTab} xGasToGasRatio={xGasToGasRatio} />
      </TabsContent>
    </Tabs>
  );
}
