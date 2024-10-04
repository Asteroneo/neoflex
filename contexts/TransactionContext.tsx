import React, { createContext, useContext, useState, ReactNode } from "react";
import { toast } from "react-hot-toast";

type TransactionStatus =
  | "idle"
  | "waitingApproval"
  | "processing"
  | "success"
  | "error";

interface TransactionContextType {
  status: TransactionStatus;
  setStatus: (status: TransactionStatus) => void;
}

const TransactionContext = createContext<TransactionContextType | undefined>(
  undefined
);

export const TransactionProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [status, setStatus] = useState<TransactionStatus>("idle");

  const handleStatusChange = (newStatus: TransactionStatus) => {
    setStatus(newStatus);
    // Dismiss any existing toasts
    toast.dismiss();

    switch (newStatus) {
      case "waitingApproval":
        toast.loading("Waiting for approval...", { duration: 5000 });
        break;
      case "processing":
        toast.loading("Processing transaction...", { duration: 5000 });
        break;
      case "success":
        toast.success("Transaction successful!", { duration: 5000 });
        break;
      case "error":
        toast.error("Transaction failed. Please try again.", {
          duration: 5000,
        });
        break;
    }
  };

  return (
    <TransactionContext.Provider
      value={{ status, setStatus: handleStatusChange }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransaction = () => {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error("useTransaction must be used within a TransactionProvider");
  }
  return context;
};
