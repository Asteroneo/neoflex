// File: pages\index.tsx

import Image from "next/image";
import Head from "next/head";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from "@/utils/config";
import { Inter } from "next/font/google";
import Link from "next/link";
import Sidebar from "@/components/layout/Sidebar";
import Stake from "@/components/layout/Stake/Stake";
import { TransactionProvider } from "@/contexts/TransactionContext";
import { Toaster } from "react-hot-toast";
import { GetServerSideProps } from "next";
import { getGasToXGasRatio, getXGasToGasRatio } from "@/utils/getContractData";

export const getServerSideProps: GetServerSideProps = async () => {
  const xGasToGasRatio = await getXGasToGasRatio();

  return {
    props: {
      xGasToGasRatio,
    },
  };
};

interface HomeProps {
  xGasToGasRatio: string | null;
}

export default function Home({ xGasToGasRatio }: HomeProps) {
  const origin =
    typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : SITE_URL;

  const links = [
    {
      title: "Next.js",
      description:
        "Seamlessly integrate your decentralized application with Next.js, a popular React-based framework.",
      href: "https://nextjs.org",
    },
    {
      title: "RainbowKit",
      description: "A powerful and easy-to-use wallet Ethereum-based dApps.",
      href: "https://www.rainbowkit.com",
    },
    {
      title: "WAGMI",
      description:
        "wagmi is a collection of React Hooks containing everything you need to start working with Ethereum.",
      href: "https://wagmi.sh",
    },
    {
      title: "Examples",
      description:
        "Start by exploring some pre-built examples to inspire your creativity!",
      href: `${origin}/examples`,
    },
  ];

  return (
    <TransactionProvider>
      <div className="h-screen flex overflow-hidden">
        <Sidebar />

        <div className="flex flex-col flex-1 overflow-auto">
          <div className="flex justify-end pt-6 pr-6">
            <ConnectButton />
          </div>

          <div className="flex-1 flex items-center justify-center">
            <Stake xGasToGasRatio={xGasToGasRatio} />
          </div>
        </div>
        <Toaster position="bottom-right" />
      </div>
    </TransactionProvider>
  );
}
