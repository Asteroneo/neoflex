
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from "@/utils/config";
import { Inter } from "next/font/google";
import Link from "next/link";
import Sidebar from "@/components/layout/Sidebar";
import Stake from "@/components/layout/Stake/Stake";
import { Toaster } from "react-hot-toast";
import { GetServerSideProps } from "next";
import {
  getTotalStaked,
  getXGasToGasRatio,
  getGasToXGasRatio,
} from "@/utils/getContractData";
import { ContractDataProvider } from "@/contexts/ContractDataContext";

export const getServerSideProps: GetServerSideProps = async () => {
  const xGasToGasRatio = await getXGasToGasRatio();
  const totalStaked = await getTotalStaked();
  const gasToXGasRatio = await getGasToXGasRatio();
  return {
    props: {
      xGasToGasRatio,
      totalStaked,
      gasToXGasRatio,
    },
  };
};

export interface PageProps {
  xGasToGasRatio: string | null;
  totalStaked: string | null;
  gasToXGasRatio: string | null;
}

export default function Home({
  xGasToGasRatio,
  totalStaked,
  gasToXGasRatio,
}: PageProps) {
  const origin =
    typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : SITE_URL;


  return (
    <ContractDataProvider
      value={{ xGasToGasRatio, totalStaked, gasToXGasRatio }}
    >
      <div className="h-screen flex overflow-hidden">
        <Sidebar />

        <div className="flex flex-col flex-1 overflow-auto">
          <div className="flex justify-end pt-6 pr-6">
            <ConnectButton />
          </div>

          <div className="flex-1 flex items-center justify-center">
            <Stake />
          </div>
        </div>
        <Toaster position="bottom-right" />
      </div>
    </ContractDataProvider>
  );
}
