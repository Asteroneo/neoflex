import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { IconArrowDown, IconSparkles } from "@tabler/icons-react";
import { useSmartContract } from "@/helpers/useCoreContract";
import { useXGasContract } from "@/helpers/useXGasContract";
import { parseEther, formatEther } from "viem";

import { useBalance } from "@/utils/fetchBalance";
import { toast } from "react-hot-toast";
import { useContractData } from "@/contexts/ContractDataContext";
import UnstakeSuccessPopup from "@/components/popup/unstakeSuccessPopup";

type TStakeFormProps = {
  activeTab: string;
};

export default function StakeForm({ activeTab }: TStakeFormProps) {
  const isStaking = activeTab === "stake";

  const formSchema = z.object({
    amount: z
      .number()
      .min(isStaking ? 1 : 0.1, {
        message: `Amount must be at least ${isStaking ? "1" : "0.1"}`,
      })
      .multipleOf(0.1, { message: "Amount must be a multiple of 0.1" }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { amount: isStaking ? 1 : 0.1 },
  });

  const { totalStaked, xGasToGasRatio, gasToXGasRatio } = useContractData();
  const amount = form.watch("amount");

  const { useDeposit, useRequestUnstake } = useSmartContract();
  const { useXGasAllowance, useApproveXGas } = useXGasContract();
  const [showUnstakePopup, setShowUnstakePopup] = useState(false);

  const {
    write: writeDeposit,
    isWriteLoading: isDepositWriteLoading,
    isTransactionLoading: isDepositTransactionLoading,
    isSuccess: isDepositSuccess,
    error: depositError,
  } = useDeposit(amount);
  const {
    write: writeRequestUnstake,
    isWriteLoading: isUnstakeWriteLoading,
    isTransactionLoading: isUnstakeTransactionLoading,
    isSuccess: isUnstakeSuccess,
    error: unstakeError,
  } = useRequestUnstake(amount);
  const { allowance: xGasAllowance, refetch: refetchAllowance } =
    useXGasAllowance();
  const {
    approve: writeApprove,
    isLoading: isApproveLoading,
    isSuccess: isApproveSuccess,
    error: approveError,
  } = useApproveXGas();

  const [isApproving, setIsApproving] = useState(false);

  const { balance: gasBalance } = useBalance();
  const { balance: xGasBalance } = useBalance(
    process.env.NEXT_PUBLIC_XGAS_ADDRESS as `0x${string}`
  );

  const onSubmit = async (formData: z.infer<typeof formSchema>) => {
    if (isStaking) {
      if (!writeDeposit) {
        toast.error("Unable to submit transaction. Please try again.");
        return;
      }
      toast.loading("Waiting for approval in MetaMask...", { id: "txn" });
      writeDeposit();
    } else {
      const amountInWei = parseEther(formData.amount.toString());
      if (xGasAllowance && xGasAllowance < amountInWei) {
        setIsApproving(true);
        toast.loading("Waiting for approval in MetaMask...", { id: "approve" });
        writeApprove?.();
      } else {
        if (!writeRequestUnstake) {
          toast.error("Unable to submit transaction. Please try again.");
          return;
        }
        toast.loading("Waiting for approval in MetaMask...", { id: "txn" });
        writeRequestUnstake();
      }
    }
  };

  useEffect(() => {
    if (isStaking) {
      if (isDepositWriteLoading) {
        toast.loading("Waiting for approval in MetaMask...", { id: "txn" });
      } else if (isDepositTransactionLoading) {
        toast.loading("Processing transaction...", { id: "txn" });
      } else if (isDepositSuccess) {
        toast.success("Transaction successful!", { id: "txn" });
        form.reset();
      } else if (depositError) {
        toast.error(depositError.message || "Transaction failed", {
          id: "txn",
        });
      }
    } else {
      if (isUnstakeWriteLoading) {
        toast.loading("Waiting for approval...", { id: "txn" });
      } else if (isUnstakeTransactionLoading) {
        toast.loading("Processing transaction...", { id: "txn" });
      } else if (isUnstakeSuccess) {
        toast.success("Transaction successful!", { id: "txn" });
        form.reset();
        setShowUnstakePopup(true); // Show the popup when unstake is successful
      } else if (unstakeError) {
        toast.error(unstakeError.message || "Transaction failed", {
          id: "txn",
        });
      }
    }
  }, [
    isDepositWriteLoading,
    isDepositTransactionLoading,
    isDepositSuccess,
    depositError,
    isUnstakeWriteLoading,
    isUnstakeTransactionLoading,
    isUnstakeSuccess,
    unstakeError,
    form,
    isStaking,
  ]);

  useEffect(() => {
    if (isApproveLoading) {
      toast.loading("Processing approval...", { id: "approve" });
    } else if (isApproveSuccess) {
      toast.success("xGAS approved!", { id: "approve" });
      setIsApproving(false);
      refetchAllowance();
    } else if (approveError) {
      toast.error(approveError.message || "Approval failed", { id: "approve" });
      setIsApproving(false);
    }
  }, [isApproveLoading, isApproveSuccess, approveError, refetchAllowance]);

  const userGasBalance = {
    balance: isStaking ? gasBalance : xGasBalance,
    label: isStaking ? "Amount to Stake" : "Amount to Unstake",
    placeholder: isStaking ? "GAS" : "xGAS",
  };

  const userXGasBalance = {
    balance: isStaking ? xGasBalance : gasBalance,
    label: isStaking ? "Amount to Receive (xGAS)" : "Amount to Receive (GAS)",
    placeholder: isStaking ? "xGAS" : "GAS",
  };

  const convertAmount = (amount: number): number => {
    if (isStaking && gasToXGasRatio) {
      return amount * parseFloat(gasToXGasRatio);
    } else if (!isStaking && xGasToGasRatio) {
      return amount * parseFloat(xGasToGasRatio);
    }
    return amount;
  };

  const convertedAmount = useMemo(
    () => convertAmount(amount),
    [amount, isStaking, gasToXGasRatio, xGasToGasRatio]
  );

  const isLoading = isStaking
    ? isDepositWriteLoading || isDepositTransactionLoading
    : isUnstakeWriteLoading || isUnstakeTransactionLoading || isApproveLoading;

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold pl-1">
                  {userGasBalance.label}
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={isStaking ? "1" : "0.1"}
                    step="0.01"
                    {...field}
                    onChange={(e) => {
                      const value =
                        e.target.value === "" ? 1 : parseFloat(e.target.value);
                      field.onChange(value);
                    }}
                    className="rounded-full no-spinner p-6"
                    icon={<IconSparkles stroke={2} />}
                    placeholderText={userGasBalance.placeholder}
                  />
                </FormControl>
                <div className="h-2" />
                <div className="flex justify-between pl-1">
                  <FormDescription className="opacity-50">
                    BALANCE: {parseFloat(userGasBalance.balance).toFixed(2)}{" "}
                    {userGasBalance.placeholder}
                  </FormDescription>
                  <div className="flex items-center gap-3">
                    <Button
                      type="button"
                      variant="ghost"
                      className="bg-[#79FFB8] text-black"
                      onClick={() => {
                        const maxAmount =
                          Math.floor(parseFloat(userGasBalance.balance) * 10) /
                          20;
                        form.setValue("amount", Math.max(1, maxAmount));
                      }}
                    >
                      HALF
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      className="bg-[#79FFB8] text-black"
                      onClick={() => {
                        const maxAmount =
                          Math.floor(parseFloat(userGasBalance.balance) * 10) /
                          10;
                        form.setValue("amount", Math.max(1, maxAmount));
                      }}
                    >
                      MAX
                    </Button>
                  </div>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex w-full justify-center">
            <div className="flex justify-center items-center rounded-full bg-[#79FFB8] w-10 h-10">
              <IconArrowDown stroke={2} className="text-black" />
            </div>
          </div>
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold pl-1">
                  {userXGasBalance.label}
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.000001"
                    value={convertedAmount.toFixed(6)}
                    readOnly
                    className="rounded-full no-spinner p-6"
                    icon={<IconSparkles stroke={2} />}
                    placeholderText={userXGasBalance.placeholder}
                  />
                </FormControl>
                <div className="h-2" />
                <FormDescription className="opacity-50">
                  BALANCE: {parseFloat(userXGasBalance.balance).toFixed(2)}{" "}
                  {userXGasBalance.placeholder}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="space-y-2 mb-8">
            <div className="flex justify-between text-sm font-extralight">
              <span className="text-gray-400">Total Staked</span>
              <span className="font-medium">
                {totalStaked ? parseFloat(totalStaked).toFixed(2) : "0.00"} GAS
              </span>
            </div>
            <div className="flex justify-between text-sm font-extralight">
              <span className="text-gray-400">Redemption Rate</span>
              <span className="font-medium">
                {xGasToGasRatio ? `1 xGAS = ${xGasToGasRatio} GAS` : "N/A"}
              </span>
            </div>
            <div className="flex justify-between text-sm font-extralight">
              <span className="text-gray-400">Unbonding Period</span>
              <span className="font-medium">14 days</span>
            </div>
          </div>
          <Button
            type="submit"
            className="w-full bg-[#79FFB8] text-black h-12"
            disabled={isLoading}
          >
            {isLoading
              ? "Processing..."
              : isApproving
              ? "Approve xGAS"
              : isStaking
              ? "Stake"
              : "Unstake"}
          </Button>
        </form>
      </Form>
      <UnstakeSuccessPopup
        isOpen={showUnstakePopup}
        onClose={() => setShowUnstakePopup(false)}
      />
    </>
  );
}
