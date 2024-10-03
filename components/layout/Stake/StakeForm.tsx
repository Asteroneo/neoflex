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

type TStakeFormProps = {
  activeTab: string;
};

const formSchema = z.object({
  amount: z.number().min(1, { message: "Amount must be greater than 0" }),
});

export default function StakeForm({ activeTab }: TStakeFormProps) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
    },
  });

  const onSubmit = (data: unknown) => {
    console.log(data);
  };

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
              <FormLabel className="font-normal pl-1">{fromLabel}</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  className="rounded-full no-spinner"
                  icon={<IconSparkles stroke={2} />}
                  placeholderText={fromPlaceholder}
                />
              </FormControl>
              <div className="h-2" />
              <div className="flex justify-between pl-1">
                <FormDescription>
                  BALANCE: 0.00 {fromPlaceholder}
                </FormDescription>
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="ghost"
                    className="bg-[#79FFB8] text-black"
                  >
                    HALF
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    className="bg-[#79FFB8] text-black"
                  >
                    MAX
                  </Button>
                </div>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="h-2" />
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
              <FormLabel className="font-normal pl-1">{toLabel}</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  className="rounded-full no-spinner"
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
        <div className="space-y-4 mb-8">
          <div className="flex justify-between text-sm font-extralight">
            <span className="text-gray-400">Transaction Cost</span>
            <span>14,103.281212 EUCL</span>
          </div>
          <div className="flex justify-between text-sm font-extralight">
            <span className="text-gray-400">Redemption Rate</span>
            <span>1 VSL = 1.243222 eEUCL</span>
          </div>
          <div className="flex justify-between text-sm font-extralight">
            <span className="text-gray-400">Unbonding Period</span>
            <span>7 days</span>
          </div>
        </div>
        <Button type="submit" className="w-full bg-[#79FFB8] text-black h-12">
          Submit
        </Button>
      </form>
    </Form>
  );
}
