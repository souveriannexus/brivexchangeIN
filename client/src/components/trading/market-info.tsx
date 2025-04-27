import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { formatNumber, getCurrencyIcon } from "@/lib/utils";
import { MarketPrice } from "@/lib/types";

interface MarketInfoProps {
  symbol: string;
  baseSymbol: string;
  quoteSymbol: string;
  tradingPairId: number;
}

export function MarketInfo({
  symbol,
  baseSymbol,
  quoteSymbol,
  tradingPairId,
}: MarketInfoProps) {
  // Fetch market data for the specific trading pair
  const { data: marketData } = useQuery<MarketPrice>({
    queryKey: [`/api/market-data/${tradingPairId}`],
  });
  
  // Calculate percent change color
  const changeColor = marketData && parseFloat(marketData.change24h) >= 0 
    ? "text-success" 
    : "text-destructive";
  
  const iconClass = getCurrencyIcon(baseSymbol);
  
  return (
    <Card className="bg-card border border-border rounded-lg p-3 mb-4 flex flex-wrap items-center">
      <div className="flex items-center mr-6">
        <div className="w-8 h-8 bg-background rounded-full flex items-center justify-center mr-2">
          <i className={`${iconClass} text-xl`}></i>
        </div>
        <div>
          <div className="text-lg font-semibold">{symbol}</div>
          <div className="text-xs text-muted-foreground">{baseSymbol}</div>
        </div>
      </div>
      
      <div className="flex flex-wrap">
        <div className="mr-6 mb-2 sm:mb-0">
          <div className="text-sm text-muted-foreground">Price</div>
          <div className="flex items-center">
            <div className="text-lg font-mono font-medium">
              {marketData ? formatNumber(marketData.lastPrice, 2) : "0.00"}
            </div>
            <div className={`ml-2 ${changeColor} text-xs`}>
              {marketData ? (parseFloat(marketData.change24h) >= 0 ? "+" : "") + formatNumber(marketData.change24h, 2) + "%" : "0.00%"}
            </div>
          </div>
        </div>
        
        <div className="mr-6 mb-2 sm:mb-0">
          <div className="text-sm text-muted-foreground">24h High</div>
          <div className="text-sm font-mono">
            {marketData ? formatNumber(marketData.high24h, 2) : "0.00"}
          </div>
        </div>
        
        <div className="mr-6 mb-2 sm:mb-0">
          <div className="text-sm text-muted-foreground">24h Low</div>
          <div className="text-sm font-mono">
            {marketData ? formatNumber(marketData.low24h, 2) : "0.00"}
          </div>
        </div>
        
        <div className="mr-6 mb-2 sm:mb-0">
          <div className="text-sm text-muted-foreground">24h Volume</div>
          <div className="text-sm font-mono">
            {marketData ? formatNumber(parseFloat(marketData.volume24h) / 1000000, 1) + "M" : "0.00M"}
          </div>
        </div>
      </div>
    </Card>
  );
}
