import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrderBook as OrderBookType, OrderBookEntry } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import { generateOrderBookData } from "@/lib/market-data";

interface OrderBookProps {
  symbol: string;
  basePrice: number;
}

export function OrderBook({ symbol, basePrice }: OrderBookProps) {
  const [orderBook, setOrderBook] = useState<OrderBookType>({ asks: [], bids: [] });
  const [view, setView] = useState<"book" | "trades">("book");
  
  // Initialize order book data
  useEffect(() => {
    // In a real app, this would come from WebSocket
    setOrderBook(generateOrderBookData(basePrice));
    
    // Simulate updates
    const interval = setInterval(() => {
      setOrderBook(generateOrderBookData(basePrice));
    }, 5000);
    
    return () => clearInterval(interval);
  }, [basePrice]);
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-0">
        <Tabs defaultValue="book" value={view} onValueChange={(v) => setView(v as "book" | "trades")}>
          <TabsList className="w-full rounded-none border-b">
            <TabsTrigger value="book" className="rounded-none flex-1">Order Book</TabsTrigger>
            <TabsTrigger value="trades" className="rounded-none flex-1">Market Trades</TabsTrigger>
          </TabsList>
          
          {/* Order Book Header */}
          <div className="flex items-center justify-between p-2 text-xs text-muted-foreground">
            <div className="flex-1">Price</div>
            <div className="flex-1 text-right">Amount</div>
            <div className="flex-1 text-right">Total</div>
          </div>
        </Tabs>
      </CardHeader>
      
      <CardContent className="p-0">
        {/* Sell Orders (Red) */}
        <div className="max-h-64 overflow-y-auto scrollbar-thin">
          {orderBook.asks.map((order, index) => (
            <OrderBookRow 
              key={`ask-${index}`} 
              order={order} 
              type="ask" 
            />
          ))}
        </div>
        
        {/* Current Price */}
        <div className="flex items-center justify-between p-2 text-sm font-medium border-b border-t bg-secondary">
          <span className="font-mono text-success">{formatNumber(basePrice, 2)}</span>
          <span className="text-xs text-muted-foreground">≈ ${formatNumber(basePrice, 2)}</span>
        </div>
        
        {/* Buy Orders (Green) */}
        <div className="max-h-64 overflow-y-auto scrollbar-thin">
          {orderBook.bids.map((order, index) => (
            <OrderBookRow 
              key={`bid-${index}`} 
              order={order} 
              type="bid" 
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

interface OrderBookRowProps {
  order: OrderBookEntry;
  type: "ask" | "bid";
}

function OrderBookRow({ order, type }: OrderBookRowProps) {
  return (
    <div className="order-book-row flex items-center p-2 text-xs border-b cursor-pointer relative">
      <div className={`flex-1 ${type === "ask" ? "text-destructive" : "text-success"} font-mono`}>
        {formatNumber(order.price, 2)}
      </div>
      <div className="flex-1 text-right font-mono">
        {formatNumber(order.amount, 6)}
      </div>
      <div className="flex-1 text-right font-mono">
        {formatNumber(order.total, 2)}
      </div>
      <div 
        className={`h-1 ${type === "ask" ? "bg-destructive/10" : "bg-success/10"} absolute right-0`}
        style={{ width: `${order.depth || 0}%` }}
      />
    </div>
  );
}
