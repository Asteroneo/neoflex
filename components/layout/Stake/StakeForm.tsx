// File: components\layout\Stake\StakeForm.tsx

import React, { useState, useEffect } from "react";
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
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconArrowDown, IconSparkles } from "@tabler/icons-react";
import { useSmartContract } from "@/helpers/useCoreContract";
import { useTransaction } from "@/contexts/TransactionContext";
import { useBalance } from "@/utils/fetchBalance"; // Import the improved hook

type TStakeFormProps = {
  activeTab: string;
  xGasToGasRatio: string | null;
};

const formSchema = z.object({
  amount: z
    .number()
    .min(1, { message: "Amount must be at least 1" })
    .multipleOf(0.1, { message: "Amount must be a multiple of 0.1" }),
});

export default function StakeForm({
  activeTab,
  xGasToGasRatio,
}: TStakeFormProps) {
  const { setStatus } = useTransaction();
  const { useDeposit } = useSmartContract();
  const {
    balance: gasBalance,
    isLoading: isGasLoading,
    error: gasError,
  } = useBalance(); // Use the hook for GAS balance
  const {
    balance: xGasBalance,
    isLoading: isXGasLoading,
    error: xGasError,
  } = useBalance(process.env.NEXT_PUBLIC_XGAS_ADDRESS as `0x${string}`); // Ensure the address is in the correct format

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 1,
    },
  });

  const amount = form.watch("amount");

  const { write, isWriteLoading, isTransactionLoading, isSuccess } =
    useDeposit(amount);

  const onSubmit = async (formData: z.infer<typeof formSchema>) => {
    if (!write) {
      setStatus("error");
      return;
    }

    try {
      setStatus("waitingApproval");
      await write();
      setStatus("processing");
    } catch (error) {
      setStatus("error");
      console.error(error);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      setStatus("success");
      form.reset();
    }
  }, [isSuccess, form, setStatus]);

  useEffect(() => {
    if (!isWriteLoading && !isTransactionLoading && !isSuccess) {
      setStatus("idle");
    }
  }, [isWriteLoading, isTransactionLoading, isSuccess, setStatus]);

  const isLoading = isWriteLoading || isTransactionLoading;

  const isStaking = activeTab === "stake";
  // New constants for swapping based on isStaking
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

  return (
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
                  min="1"
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
                  {userGasBalance.placeholder}{" "}
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
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
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
            <span className="text-gray-400">Transaction Cost</span>
            <span className="font-medium">14,103.281212 EUCL</span>
          </div>
          <div className="flex justify-between text-sm font-extralight">
            <span className="text-gray-400">Redemption Rate</span>
            <span className="font-medium">
              {xGasToGasRatio ? `1 xGAS = ${xGasToGasRatio} GAS` : "N/A"}
            </span>{" "}
          </div>
          <div className="flex justify-between text-sm font-extralight">
            <span className="text-gray-400">Unbonding Period</span>
            <span className="font-medium">14 days</span>
          </div>
        </div>
        <Button
          type="submit"
          className="w-full bg-[#79FFB8] text-black h-12"
          disabled={isLoading || !write}
        >
          {isLoading ? "Processing..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
}
