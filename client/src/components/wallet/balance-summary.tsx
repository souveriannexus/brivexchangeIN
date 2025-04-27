import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Wallet } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ChevronRight } from "lucide-react";

export function BalanceSummary() {
  // Fetch user wallets
  const { data: wallets, isLoading } = useQuery<Wallet[]>({
    queryKey: ['/api/wallets'],
  });

  // Calculate total balance in USD
  const calculateTotalBalance = () => {
    if (!wallets) return 0;
    
    // Simple calculation for demo - in real app would use current market rates
    return wallets.reduce((total, wallet) => {
      // Convert to USD based on current market rates (simplified for demo)
      if (wallet.currency === "USDT") {
        return total + parseFloat(wallet.balance);
      }
      
      // Use approximate rates for other currencies
      const rate = wallet.currency === "BTC" ? 25000 :
                 wallet.currency === "ETH" ? 1800 :
                 wallet.currency === "BNB" ? 220 :
                 wallet.currency === "XRP" ? 0.5 :
                 wallet.currency === "BRIV" ? 5 : 1;
                 
      return total + (parseFloat(wallet.balance) * rate);
    }, 0);
  };
  
  // Get 24h balance change (mock data for demo)
  const balanceChange = {
    percent: 2.45,
    amount: calculateTotalBalance() * 0.0245,
  };
  
  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium flex justify-between items-center">
          <span>Balance Summary</span>
          <Link href="/wallet">
            <Button variant="ghost" size="sm" className="text-xs">
              View All <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="py-4 flex justify-center">
            <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <div className="text-sm text-muted-foreground mb-1">Estimated Balance</div>
              <div className="flex items-center">
                <span className="text-2xl font-semibold">${formatNumber(calculateTotalBalance(), 2)}</span>
                <span className={`ml-2 text-xs ${balanceChange.percent >= 0 ? 'text-success' : 'text-destructive'}`}>
                  {balanceChange.percent >= 0 ? '+' : ''}{balanceChange.percent}% (${formatNumber(balanceChange.amount, 2)})
                </span>
              </div>
            </div>
            
            <div className="flex space-x-3 mb-4">
              <Link href="/wallet">
                <Button className="flex-1">
                  <i className="fa-solid fa-arrow-down mr-2"></i> Deposit
                </Button>
              </Link>
              <Link href="/wallet">
                <Button variant="outline" className="flex-1">
                  <i className="fa-solid fa-arrow-up mr-2"></i> Withdraw
                </Button>
              </Link>
              <Link href="/wallet">
                <Button variant="outline" className="flex-1">
                  <i className="fa-solid fa-arrow-right-arrow-left mr-2"></i> Transfer
                </Button>
              </Link>
            </div>
            
            <Tabs defaultValue="crypto">
              <TabsList className="w-full">
                <TabsTrigger value="crypto" className="flex-1">Crypto Assets</TabsTrigger>
                <TabsTrigger value="fiat" className="flex-1">Fiat Balance</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="mt-4">
              {wallets?.filter(w => w.currency !== "USDT").map((wallet) => (
                <div key={wallet.id} className="flex justify-between items-center py-2 border-b">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center mr-3">
                      <i className={`fa-brands ${
                        wallet.currency === "BTC" ? "fa-bitcoin text-warning" :
                        wallet.currency === "ETH" ? "fa-ethereum text-blue-300" :
                        wallet.currency === "BNB" ? "fa-solid fa-b text-yellow-500" :
                        wallet.currency === "XRP" ? "fa-solid fa-x text-blue-400" :
                        "fa-solid fa-b text-primary"
                      }`}></i>
                    </div>
                    <div>
                      <div className="font-medium">{wallet.currency}</div>
                      <div className="text-xs text-muted-foreground">
                        {
                          wallet.currency === "BTC" ? "Bitcoin" :
                          wallet.currency === "ETH" ? "Ethereum" :
                          wallet.currency === "BNB" ? "Binance Coin" :
                          wallet.currency === "XRP" ? "Ripple" :
                          "Briv Token"
                        }
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium font-mono">{formatNumber(wallet.balance, 6)}</div>
                    <div className="text-xs text-muted-foreground">
                      ≈ ${formatNumber(
                        parseFloat(wallet.balance) * (
                          wallet.currency === "BTC" ? 25000 :
                          wallet.currency === "ETH" ? 1800 :
                          wallet.currency === "BNB" ? 220 :
                          wallet.currency === "XRP" ? 0.5 : 5
                        ), 2
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {/* USDT (Fiat-like) */}
              <div className="flex justify-between items-center py-2 border-b">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center mr-3">
                    <i className="fa-solid fa-dollar-sign text-green-500"></i>
                  </div>
                  <div>
                    <div className="font-medium">USDT</div>
                    <div className="text-xs text-muted-foreground">Tether USD</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium font-mono">
                    {formatNumber(wallets?.find(w => w.currency === "USDT")?.balance || "0", 2)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    ≈ ${formatNumber(wallets?.find(w => w.currency === "USDT")?.balance || "0", 2)}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
