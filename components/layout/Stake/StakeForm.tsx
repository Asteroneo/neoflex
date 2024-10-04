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
import { useAccount, usePublicClient } from "wagmi";
import { formatEther } from "viem";
import { useSmartContract } from "@/helpers/useCoreContract";
import { useTransaction } from "@/contexts/TransactionContext";

type TStakeFormProps = {
  activeTab: string;
};

const formSchema = z.object({
  amount: z
    .number()
    .min(1, { message: "Amount must be at least 1" })
    .multipleOf(0.01, { message: "Amount must be a multiple of 0.1" }),
});

export default function StakeForm({ activeTab }: TStakeFormProps) {
  const { address } = useAccount();
  const { setStatus } = useTransaction();
  const publicClient = usePublicClient();
  const { useDeposit, useGasToXGasRatio } = useSmartContract();
  const [balance, setBalance] = useState<string>("0");
  const [mounted, setMounted] = useState(false);
  const [ratioDisplay, setRatioDisplay] = useState<string>("Loading...");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 1,
    },
  });

  const amount = form.watch("amount");

  const { write, isWriteLoading, isTransactionLoading, isSuccess } =
    useDeposit(amount);
  const {
    ratio,
    isError: isRatioError,
    isLoading: isRatioLoading,
  } = useGasToXGasRatio();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      if (isRatioLoading) {
        setRatioDisplay("Loading...");
      } else if (isRatioError) {
        setRatioDisplay("Error fetching ratio");
      } else if (typeof ratio === "bigint") {
        setRatioDisplay(`1 GAS = ${formatEther(ratio)} xGAS`);
      } else {
        setRatioDisplay("N/A");
      }
    }
  }, [mounted, isRatioLoading, isRatioError, ratio]);

  const getBalance = async (address: `0x${string}`) => {
    const balance = await publicClient.getBalance({ address });
    return formatEther(balance);
  };

  useEffect(() => {
    async function fetchBalance() {
      if (address && mounted) {
        const fetchedBalance = await getBalance(address);
        setBalance(fetchedBalance);
      }
    }

    fetchBalance();
  }, [address, mounted]);

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
  const fromLabel = isStaking ? "Amount to Stake" : "Amount to Unstake";
  const toLabel = isStaking
    ? "Amount to Receive (xGAS)"
    : "Amount to Receive (GAS)";
  const fromPlaceholder = isStaking ? "GAS" : "xGAS";
  const toPlaceholder = isStaking ? "xGAS" : "GAS";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold pl-1">
                {fromLabel}
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
                  placeholderText={fromPlaceholder}
                />
              </FormControl>
              <div className="h-2" />
              <div className="flex justify-between pl-1">
                <FormDescription className="opacity-50">
                  BALANCE: {parseFloat(balance).toFixed(2)} {fromPlaceholder}
                </FormDescription>
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="ghost"
                    className="bg-[#79FFB8] text-black"
                    onClick={() => {
                      const maxAmount =
                        Math.floor(parseFloat(balance) * 10) / 20;
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
                        Math.floor(parseFloat(balance) * 10) / 10;
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
                {toLabel}
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.000001"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  className="rounded-full no-spinner p-6"
                  icon={<IconSparkles stroke={2} />}
                  placeholderText={toPlaceholder}
                />
              </FormControl>
              <div className="h-2" />
              <FormDescription>BALANCE: 0.00 {toPlaceholder}</FormDescription>
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
            <span className="font-medium">{ratioDisplay}</span>
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
