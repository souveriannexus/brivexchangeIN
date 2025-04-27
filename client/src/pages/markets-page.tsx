import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/layout/header";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Link } from "wouter";
import { formatNumber, getColorByValue, getCurrencyIcon } from "@/lib/utils";
import { Search, Star } from "lucide-react";

export default function MarketsPage() {
  const [marketTab, setMarketTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [favorites, setFavorites] = useState<number[]>([]);
  
  // Fetch trading pairs
  const { data: tradingPairs, isLoading } = useQuery({
    queryKey: ['/api/trading-pairs'],
  });
  
  // Filter trading pairs based on active tab and search term
  const filteredPairs = tradingPairs?.filter((pair: any) => {
    // Filter by market tab
    if (marketTab === "favorites" && !favorites.includes(pair.id)) {
      return false;
    }
    
    // Filter by search term
    if (searchTerm) {
      const symbol = `${pair.baseCurrency}/${pair.quoteCurrency}`;
      return symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
             pair.baseCurrency.toLowerCase().includes(searchTerm.toLowerCase()) ||
             pair.quoteCurrency.toLowerCase().includes(searchTerm.toLowerCase());
    }
    
    return true;
  });
  
  // Toggle favorite
  const toggleFavorite = (id: number) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    );
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="container mx-auto px-4 py-6 pb-20 md:pb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-2xl font-bold mb-4 md:mb-0">Markets</h1>
          
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search markets..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <Card>
          <CardHeader className="pb-0">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <Tabs defaultValue="all" value={marketTab} onValueChange={setMarketTab}>
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="favorites">
                    <Star className="h-4 w-4 mr-1" /> Favorites
                  </TabsTrigger>
                  <TabsTrigger value="spot">Spot</TabsTrigger>
                  <TabsTrigger value="futures">Futures</TabsTrigger>
                </TabsList>
              </Tabs>
              
              <div className="flex gap-2">
                <Tabs defaultValue="usdt">
                  <TabsList>
                    <TabsTrigger value="usdt">USDT</TabsTrigger>
                    <TabsTrigger value="btc">BTC</TabsTrigger>
                    <TabsTrigger value="eth">ETH</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="pt-6">
            {isLoading ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-10"></TableHead>
                      <TableHead>Pair</TableHead>
                      <TableHead className="text-right">Last Price</TableHead>
                      <TableHead className="text-right">24h Change</TableHead>
                      <TableHead className="text-right">24h High</TableHead>
                      <TableHead className="text-right">24h Low</TableHead>
                      <TableHead className="text-right">24h Volume</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPairs?.map((pair: any) => {
                      // Get market data for this pair
                      const symbol = `${pair.baseCurrency}/${pair.quoteCurrency}`;
                      const iconClass = getCurrencyIcon(pair.baseCurrency);
                      
                      // Get market data (in a real app, this would come from the server)
                      // For demo, using the trading pair ID to derive mock data
                      const change = (pair.id === 1 ? 1.45 : 
                                    pair.id === 2 ? 2.32 : 
                                    pair.id === 3 ? -0.75 : 
                                    pair.id === 4 ? 3.21 : 8.45);
                      
                      const lastPrice = (pair.id === 1 ? 25431.20 : 
                                       pair.id === 2 ? 1824.65 : 
                                       pair.id === 3 ? 231.45 : 
                                       pair.id === 4 ? 0.5487 : 5.324);
                      
                      const high = lastPrice * 1.02;
                      const low = lastPrice * 0.98;
                      const volume = lastPrice * (pair.id * 10000);
                      
                      return (
                        <TableRow key={pair.id}>
                          <TableCell>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={() => toggleFavorite(pair.id)}
                            >
                              <Star 
                                className={`h-4 w-4 ${favorites.includes(pair.id) ? "fill-yellow-500 text-yellow-500" : ""}`} 
                              />
                            </Button>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center mr-2">
                                <i className={iconClass}></i>
                              </div>
                              <div>
                                <div className="font-medium">
                                  {symbol}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {
                                    pair.baseCurrency === "BTC" ? "Bitcoin" :
                                    pair.baseCurrency === "ETH" ? "Ethereum" :
                                    pair.baseCurrency === "BNB" ? "Binance Coin" :
                                    pair.baseCurrency === "XRP" ? "Ripple" :
                                    "Briv Token"
                                  }
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-mono">
                            {formatNumber(lastPrice, 2)}
                          </TableCell>
                          <TableCell className={`text-right ${getColorByValue(change)}`}>
                            {change >= 0 ? "+" : ""}{formatNumber(change, 2)}%
                          </TableCell>
                          <TableCell className="text-right font-mono">
                            {formatNumber(high, 2)}
                          </TableCell>
                          <TableCell className="text-right font-mono">
                            {formatNumber(low, 2)}
                          </TableCell>
                          <TableCell className="text-right font-mono">
                            {formatNumber(volume / 1000000, 2)}M
                          </TableCell>
                          <TableCell className="text-right">
                            <Link href="/">
                              <Button variant="outline" size="sm">
                                Trade
                              </Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      
      <MobileNavigation />
    </div>
  );
}
