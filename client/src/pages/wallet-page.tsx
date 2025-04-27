import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/layout/header";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import { BalanceSummary } from "@/components/wallet/balance-summary";
import { WalletCard } from "@/components/wallet/wallet-card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Wallet } from "@/lib/types";
import { Search, ArrowDownUp, Plus } from "lucide-react";

export default function WalletPage() {
  const [activeTab, setActiveTab] = useState<"all" | "crypto" | "fiat">("all");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Fetch wallet data
  const { data: wallets, isLoading } = useQuery<Wallet[]>({
    queryKey: ['/api/wallets'],
  });
  
  // Filter wallets based on active tab and search term
  const filteredWallets = wallets?.filter(wallet => {
    if (activeTab === "crypto" && wallet.currency === "USDT") return false;
    if (activeTab === "fiat" && wallet.currency !== "USDT") return false;
    
    if (searchTerm) {
      return wallet.currency.toLowerCase().includes(searchTerm.toLowerCase());
    }
    
    return true;
  });
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="container mx-auto px-4 py-6 pb-20 md:pb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-2xl font-bold mb-4 md:mb-0">Wallet Management</h1>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search assets..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" className="px-3">
                <ArrowDownUp className="h-4 w-4 mr-2" />
                Transfer
              </Button>
              <Button className="px-3">
                <Plus className="h-4 w-4 mr-2" />
                Deposit
              </Button>
            </div>
          </div>
        </div>
        
        <BalanceSummary />
        
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Your Assets</h2>
          <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as "all" | "crypto" | "fiat")}>
            <TabsList>
              <TabsTrigger value="all">All Assets</TabsTrigger>
              <TabsTrigger value="crypto">Crypto</TabsTrigger>
              <TabsTrigger value="fiat">Fiat</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : filteredWallets && filteredWallets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWallets.map(wallet => (
              <WalletCard key={wallet.id} wallet={wallet} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-wallet text-muted-foreground text-2xl"></i>
            </div>
            <h3 className="text-lg font-medium">No assets found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        )}
      </main>
      
      <MobileNavigation />
    </div>
  );
}
