import { useEffect, useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useWebSocket } from "@/hooks/use-websocket";
import { Trade, TradeHistoryItem } from "@/lib/types";
import { formatNumber, formatTime } from "@/lib/utils";
import { WS_CHANNELS } from "@/lib/constants";
import { generateTradeHistoryData } from "@/lib/market-data";

interface TradeHistoryProps {
  symbol: string;
  tradingPairId: number;
}

export function TradeHistory({ symbol, tradingPairId }: TradeHistoryProps) {
  const [tradeHistory, setTradeHistory] = useState<TradeHistoryItem[]>([]);
  const { subscribe, unsubscribe, lastMessage } = useWebSocket();
  
  // Fetch initial trade data
  const { data: initialTrades } = useQuery<Trade[]>({
    queryKey: [`/api/trades/pair/${tradingPairId}`],
  });
  
  // Initialize with fetched data or generated data while loading
  useEffect(() => {
    // If we have actual data from API, format it for display
    if (initialTrades && initialTrades.length > 0) {
      const formattedTrades: TradeHistoryItem[] = initialTrades.map(trade => ({
        id: trade.id,
        side: trade.side,
        price: trade.price,
        amount: trade.amount,
        total: (parseFloat(trade.price) * parseFloat(trade.amount)).toFixed(2),
        time: formatTime(trade.createdAt),
      }));
      setTradeHistory(formattedTrades);
    } else {
      // Otherwise use generated data for demo purposes
      const basePrice = symbol.includes("BTC") ? 25000 :
                      symbol.includes("ETH") ? 1800 :
                      symbol.includes("BNB") ? 230 :
                      symbol.includes("XRP") ? 0.5 : 5;
      setTradeHistory(generateTradeHistoryData(basePrice));
    }
  }, [initialTrades, symbol]);
  
  // Subscribe to trade updates via WebSocket
  useEffect(() => {
    const channel = `${WS_CHANNELS.TRADES}:${symbol.toLowerCase().replace('/', '_')}`;
    subscribe(channel);
    
    return () => {
      unsubscribe(channel);
    };
  }, [symbol, subscribe, unsubscribe]);
  
  // Process WebSocket messages
  useEffect(() => {
    if (lastMessage?.type === 'tradeUpdate' && lastMessage.data.tradingPairId === tradingPairId) {
      const newTrade = lastMessage.data;
      const formattedTrade: TradeHistoryItem = {
        id: newTrade.id,
        side: newTrade.side,
        price: newTrade.price,
        amount: newTrade.amount,
        total: (parseFloat(newTrade.price) * parseFloat(newTrade.amount)).toFixed(2),
        time: formatTime(new Date()),
      };
      
      // Add new trade to the top and limit to 20 trades
      setTradeHistory(prev => [formattedTrade, ...prev.slice(0, 19)]);
    }
  }, [lastMessage, tradingPairId]);
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-3 border-b flex justify-between items-center">
        <h2 className="font-medium">Trade History</h2>
        <Button variant="ghost" size="sm" className="px-2 py-1 h-7">
          <i className="fa-solid fa-filter text-muted-foreground text-sm"></i>
        </Button>
      </CardHeader>
      
      <CardContent className="p-3">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
          <div className="w-2/12">Type</div>
          <div className="w-3/12">Price</div>
          <div className="w-3/12">Amount</div>
          <div className="w-4/12">Time</div>
        </div>
        
        {tradeHistory.length > 0 ? (
          tradeHistory.map((trade) => (
            <div key={`trade-${trade.id}`} className="flex items-center justify-between text-xs py-2 border-b">
              <div className={`w-2/12 ${trade.side === 'buy' ? 'text-success' : 'text-destructive'}`}>
                {trade.side === 'buy' ? 'Buy' : 'Sell'}
              </div>
              <div className="w-3/12 font-mono">{formatNumber(trade.price, 2)}</div>
              <div className="w-3/12 font-mono">{formatNumber(trade.amount, 6)}</div>
              <div className="w-4/12 text-muted-foreground">{trade.time}</div>
            </div>
          ))
        ) : (
          <div className="text-center text-muted-foreground py-6">
            <p className="text-sm">No trades yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
