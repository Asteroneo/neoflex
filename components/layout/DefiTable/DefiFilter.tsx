import { ToggleGroup, ToggleGroupItem } from "@/components/ui/ToggleGroup";
import { cn } from "@/utils";

const filterOptions = [
	{ value: "all", label: "All" },
	{ value: "borrowing-lending", label: "Borrowing & Lending" },
	{ value: "vaults", label: "Vaults" },
	{ value: "liquidity-providers", label: "Liquidity Providers" },
	{ value: "mint-stable-coins", label: "Mint Stable Coins" },
];

export default function DefiFilter() {
	return (
		<ToggleGroup type="single"  defaultValue="all">
			{filterOptions.map((option) => (
				<ToggleGroupItem key={option.value} value={option.value} aria-label={option.label} className={cn()}>
           
					{option.label}
				</ToggleGroupItem>
			))}
		</ToggleGroup>
	);
}
