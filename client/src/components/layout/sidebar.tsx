import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Wallet } from "@/lib/types";
import { getCurrencyIcon, formatNumber } from "@/lib/utils";
import { TRADING_PAIRS } from "@/lib/constants";

export function Sidebar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [quoteFilter, setQuoteFilter] = useState("USDT");
  
  // Fetch wallet data
  const { data: wallets } = useQuery<Wallet[]>({
    queryKey: ["/api/wallets"],
  });
  
  // Fetch market data for all trading pairs
  const { data: marketData } = useQuery({
    queryKey: ["/api/trading-pairs"],
  });
  
  // Calculate total balance (simplified for demo)
  const estimatedBalance = wallets?.reduce((total, wallet) => {
    // This is a simplified calculation - in a real app, you'd convert to USD based on current rates
    if (wallet.currency === "USDT") {
      return total + parseFloat(wallet.balance);
    }
    // For crypto, we'd multiply by the current USD rate
    return total + parseFloat(wallet.balance) * (wallet.currency === "BTC" ? 25000 : 
      wallet.currency === "ETH" ? 1800 : 
      wallet.currency === "BNB" ? 220 : 
      wallet.currency === "XRP" ? 0.5 : 
      wallet.currency === "BRIV" ? 5 : 1);
  }, 0) || 0;
  
  // Filter trading pairs based on search term and quote filter
  const filteredTradingPairs = TRADING_PAIRS
    .filter(pair => pair.quoteSymbol === quoteFilter)
    .filter(pair => 
      pair.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pair.baseSymbol.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
  return (
    <aside className="hidden md:block w-56 mr-4 sticky top-16 self-start">
      <Card className="overflow-hidden">
        {/* Balance Summary */}
        <CardContent className="p-4 border-b">
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Estimated Balance</h3>
          <div className="flex items-center mb-3">
            <span className="text-xl font-semibold">${formatNumber(estimatedBalance)}</span>
            <span className="text-success text-xs ml-2">+2.4%</span>
          </div>
          <div className="flex space-x-2 text-sm">
            <Link href="/wallet">
              <a className="flex-1 bg-primary hover:bg-primary/90 text-white rounded py-1 flex justify-center">
                Deposit
              </a>
            </Link>
            <Link href="/wallet">
              <a className="flex-1 bg-secondary hover:bg-secondary/90 rounded py-1 flex justify-center">
                Withdraw
              </a>
            </Link>
          </div>
        </CardContent>
        
        {/* Markets */}
        <div className="py-2">
          <div className="flex items-center justify-between px-4 py-2">
            <h3 className="font-medium">Markets</h3>
            <Tabs defaultValue="USDT" onValueChange={(value) => setQuoteFilter(value)}>
              <TabsList className="h-7 p-1">
                <TabsTrigger value="USDT" className="text-xs px-2 py-0.5">USDT</TabsTrigger>
                <TabsTrigger value="BTC" className="text-xs px-2 py-0.5">BTC</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          {/* Search */}
          <div className="px-4 mb-2">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search..."
                className="w-full bg-background text-sm pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          
          {/* Market List */}
          <div className="max-h-96 overflow-y-auto scrollbar-thin">
            {filteredTradingPairs.map((pair) => {
              // Find market data for this pair
              const pairData = marketData?.find((p: any) => 
                p.baseCurrency === pair.baseSymbol && p.quoteCurrency === pair.quoteSymbol
              );
              
              const change = pairData?.change24h ? parseFloat(pairData.change24h) : 0;
              const price = pairData?.lastPrice || "0";
              
              const iconClass = getCurrencyIcon(pair.baseSymbol);
              
              return (
                <Link href="/" key={pair.id}>
                  <a className="sidebar-hover flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-muted/20">
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-background rounded-full flex items-center justify-center mr-2">
                        <i className={iconClass}></i>
                      </div>
                      <div>
                        <div className="font-medium text-sm">{pair.symbol}</div>
                        <div className="text-xs text-muted-foreground">{pair.baseSymbol}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-sm">{formatNumber(price, pair.priceDecimals)}</div>
                      <div className={`text-xs ${change >= 0 ? 'text-success' : 'text-destructive'}`}>
                        {change >= 0 ? '+' : ''}{formatNumber(change, 2)}%
                      </div>
                    </div>
                  </a>
                </Link>
              );
            })}
          </div>
        </div>
      </Card>
    </aside>
  );
}
