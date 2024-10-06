import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import DefiFilter from "./DefiFilter";
import { IconGlobe, TablerIcon } from "@tabler/icons-react";
import { Button } from "@/components/ui/Button";

type TTableProps = {
  assetPair: string;
  apv: string;
  tvl: string;
  provider: TablerIcon;
  cta: string;
};

const tableContent: TTableProps[] = [
  {
    assetPair: "eATOM",
    apv: "12.56",
    tvl: "1,501,911",
    provider: IconGlobe,
    cta: "Add Liquidity",
  },
  {
    assetPair: "eATOM-EUCL",
    apv: "45.56",
    tvl: "1,501,911",
    provider: IconGlobe,
    cta: "Add Liquidity",
  },
  {
    assetPair: "eATOM-EUCL",
    apv: "45.56",
    tvl: "1,501,911",
    provider: IconGlobe,
    cta: "Lead",
  },
  {
    assetPair: "eATOM-EUCL",
    apv: "45.56",
    tvl: "1,501,911",
    provider: IconGlobe,
    cta: "Borrow",
  },
  {
    assetPair: "eATOM",
    apv: "12.56",
    tvl: "1,501,911",
    provider: IconGlobe,
    cta: "Vault",
  },
];

export default function DefiTable() {
  return (
    <div className="lg:max-w-7xl lg:min-w-[1100px] p-8 bg-opacity-50 rounded-3xl shadow-lg overflow-hidden border-2 border-white border-opacity-30">
      <h1 className="text-xl font-bold">DeFi Opportunities</h1>
      <div className="h-1" />
      <p className="text-[#989898]">Use your eAssets to earn extra yield in DeFi.</p>
      <div className="h-2" />
      <DefiFilter />
      <div className="h-4" />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Asset Pair</TableHead>
            <TableHead>APV (%)</TableHead>
            <TableHead>TVL</TableHead>
            <TableHead>Provider</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody  className="rounded-xl border p-4 border-[#252327] bg-[#141414]">
          {tableContent.map((item, index) => (
            <TableRow key={index} className="h-14">
              <TableCell className="font-medium">{item.assetPair}</TableCell>
              <TableCell>{item.apv}%</TableCell>
              <TableCell>${item.tvl}</TableCell>
              <TableCell>
                <item.provider className="w-5 h-5" />
              </TableCell>
              <TableCell className="text-right">
                <Button type="submit" className="w-full bg-[#79FFB8] text-black">
                  {item.cta}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
