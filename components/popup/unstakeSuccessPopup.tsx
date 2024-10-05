"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import Link from "next/link";

interface UnstakeSuccessPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UnstakeSuccessPopup({
  isOpen,
  onClose,
}: UnstakeSuccessPopupProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    }
  }, [isOpen]);

  const checkVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeInOut" },
    },
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/50 fixed inset-0" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#181818] rounded-lg p-6 w-[90vw] max-w-[425px] max-h-[85vh] shadow-xl focus:outline-none border border-gray-700">
          <div className="flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-[#79FFB8]/20 flex items-center justify-center mb-4">
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-[#79FFB8]"
              >
                <motion.path
                  d="M20 6L9 17l-5-5"
                  variants={checkVariants}
                  initial="hidden"
                  animate={isAnimating ? "visible" : "hidden"}
                />
              </motion.svg>
            </div>
            <Dialog.Title className="text-2xl font-bold mb-2 text-white">
              Unstake Request Submitted
            </Dialog.Title>
            <Dialog.Description className="text-center mb-4 text-gray-300">
              You can claim back your GAS in 14 days. Track your pending
              requests on the{" "}
              <Link
                href="/dashboard"
                className="text-[#79FFB8] hover:underline"
              >
                Assets Dashboard
              </Link>
              .
            </Dialog.Description>
            <button
              onClick={onClose}
              className="bg-[#79FFB8] text-black px-4 py-2 rounded hover:bg-[#79FFB8]/80 focus:outline-none focus:ring-2 focus:ring-[#79FFB8] focus:ring-opacity-50 w-full font-medium transition-colors"
            >
              Close
            </button>
          </div>
          <Dialog.Close asChild>
            <button
              className="absolute top-4 right-4 inline-flex items-center justify-center rounded-full p-1 focus:outline-none focus-visible:ring focus-visible:ring-[#79FFB8] focus-visible:ring-opacity-75"
              aria-label="Close"
            >
              <Cross2Icon className="h-4 w-4 text-gray-400 hover:text-gray-200" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
