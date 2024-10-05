import React, { createContext, useContext, ReactNode } from "react";

interface ContractData {
  xGasToGasRatio: string | null;
  totalStaked: string | null;
  gasToXGasRatio: string | null;
}

const ContractDataContext = createContext<ContractData | undefined>(undefined);

export function useContractData() {
  const context = useContext(ContractDataContext);
  if (context === undefined) {
    throw new Error(
      "useContractData must be used within a ContractDataProvider"
    );
  }
  return context;
}

interface ContractDataProviderProps {
  children: ReactNode;
  value: ContractData;
}

export function ContractDataProvider({
  children,
  value,
}: ContractDataProviderProps) {
  return (
    <ContractDataContext.Provider value={value}>
      {children}
    </ContractDataContext.Provider>
  );
}
