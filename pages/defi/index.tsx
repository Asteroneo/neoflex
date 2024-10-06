import DefiTable from "@/components/layout/DefiTable/DefiTable";
import Sidebar from "@/components/layout/Sidebar";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Toaster } from "react-hot-toast";

export default function TablePage() {
	return (
		<div className="h-screen flex overflow-hidden">
			<Sidebar />

			<div className="flex flex-col flex-1 overflow-auto relative">
				<div className="lg:flex justify-end pt-6 pr-6 hidden">
					<ConnectButton />
				</div>
      <div className="h-8"/>

				<div className="flex-1 flex items-center justify-center md:mt-6 md:mr-6">
					<DefiTable />
				</div>
			</div>
			<Toaster position="bottom-right" />
		</div>
	);
}
