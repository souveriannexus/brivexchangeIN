import { useState, useEffect } from "react";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import { MarketInfo } from "@/components/trading/market-info";
import { PriceChart } from "@/components/trading/price-chart";
import { OrderForm } from "@/components/trading/order-form";
import { OrderBook } from "@/components/trading/order-book";
import { SimplifiedOrders } from "@/components/trading/simplified-orders";
import { TradeHistory } from "@/components/trading/trade-history";
import { useQuery } from "@tanstack/react-query";
import { useWebSocket } from "@/hooks/use-websocket";
import { TRADING_PAIRS, WS_CHANNELS } from "@/lib/constants";

export default function ExchangePage() {
  const { subscribe, unsubscribe, lastMessage } = useWebSocket();
  
  // Default trading pair (ETH/USDT)
  const [selectedPair, setSelectedPair] = useState({
    id: 2,
    symbol: "ETH/USDT",
    baseSymbol: "ETH",
    quoteSymbol: "USDT",
  });
  
  // Current price state
  const [currentPrice, setCurrentPrice] = useState("1824.65");
  
  // Fetch market data
  // Define interface for market data
  interface MarketData {
    id: number;
    tradingPairId: number;
    lastPrice: number;
    volume24h: number;
    high24h: number;
    low24h: number;
    priceChange24h: number;
    priceChangePercent24h: number;
    updatedAt: string;
  }

  const { data: marketData } = useQuery<MarketData>({
    queryKey: [`/api/market-data/${selectedPair.id}`],
  });
  
  // Subscribe to market data updates via WebSocket
  useEffect(() => {
    const channel = `${WS_CHANNELS.MARKET}:${selectedPair.baseSymbol.toLowerCase()}_${selectedPair.quoteSymbol.toLowerCase()}`;
    subscribe(channel);
    
    return () => {
      unsubscribe(channel);
    };
  }, [selectedPair, subscribe, unsubscribe]);
  
  // Process WebSocket messages
  useEffect(() => {
    if (lastMessage?.type === 'marketUpdate' && lastMessage.data.tradingPairId === selectedPair.id) {
      setCurrentPrice(lastMessage.data.lastPrice.toString());
    }
  }, [lastMessage, selectedPair.id]);
  
  // Initialize price from market data
  useEffect(() => {
    if (marketData) {
      setCurrentPrice(marketData.lastPrice.toString());
    }
  }, [marketData]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="container mx-auto px-2 md:px-4 py-4 flex flex-col md:flex-row">
        <Sidebar />
        
        <div className="flex-1">
          {/* Market Info Bar */}
          <MarketInfo 
            symbol={selectedPair.symbol}
            baseSymbol={selectedPair.baseSymbol}
            quoteSymbol={selectedPair.quoteSymbol}
            tradingPairId={selectedPair.id}
          />
          
          {/* Trading Interface Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Chart Section */}
            <div className="lg:col-span-2">
              <PriceChart
                symbol={selectedPair.symbol}
                basePrice={parseFloat(currentPrice)}
              />
              
              <OrderForm 
                symbol={selectedPair.symbol}
                baseSymbol={selectedPair.baseSymbol}
                quoteSymbol={selectedPair.quoteSymbol}
                currentPrice={currentPrice}
                tradingPairId={selectedPair.id}
              />
            </div>
            
            {/* Right Sidebar - Order Book & Trade History */}
            <div className="lg:col-span-1 space-y-4">
              <OrderBook 
                symbol={selectedPair.symbol}
                basePrice={parseFloat(currentPrice)}
              />
              
              <SimplifiedOrders tradingPairId={selectedPair.id} />
              
              <TradeHistory 
                symbol={selectedPair.symbol}
                tradingPairId={selectedPair.id}
              />
            </div>
          </div>
          
          <MobileNavigation />
        </div>
      </main>
    </div>
  );
}
