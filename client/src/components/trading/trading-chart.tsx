import { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import * as LightweightCharts from 'lightweight-charts';
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Maximize, Sliders } from "lucide-react";
import { generateCandlestickData } from "@/lib/market-data";
import { CHART_TYPES, CHART_INTERVALS } from "@/lib/constants";
import { useWebSocket } from "@/hooks/use-websocket";

type ChartType = 'line' | 'candle' | 'depth';
type TimeInterval = '1m' | '5m' | '15m' | '1h' | '4h' | '1d';

interface TradingChartProps {
  symbol: string;
  basePrice: number;
}

export function TradingChart({ symbol, basePrice }: TradingChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const seriesRef = useRef<any>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const lastCandleTimeRef = useRef<number>(0);
  
  const [chartType, setChartType] = useState<ChartType>('candle');
  const [timeInterval, setTimeInterval] = useState<TimeInterval>('15m');
  
  // Connect to WebSocket for real-time updates
  const { subscribe, unsubscribe, lastMessage } = useWebSocket();
  const [symbolParts] = useState(() => {
    // Parse the symbol (e.g., BTC/USDT -> btc_usdt)
    const parts = symbol.split('/');
    if (parts.length === 2) {
      return `${parts[0].toLowerCase()}_${parts[1].toLowerCase()}`;
    }
    return symbol.toLowerCase().replace('/', '_');
  });
  
  // Initialize chart
  useEffect(() => {
    if (chartContainerRef.current) {
      // Create chart
      const chart = LightweightCharts.createChart(chartContainerRef.current, {
        layout: {
          background: { color: 'rgba(30, 30, 30, 0)' },
          textColor: '#D9D9D9',
        },
        grid: {
          vertLines: { color: 'rgba(42, 46, 57, 0.2)' },
          horzLines: { color: 'rgba(42, 46, 57, 0.2)' },
        },
        crosshair: {
          mode: LightweightCharts.CrosshairMode.Normal,
        },
        timeScale: {
          timeVisible: true,
          secondsVisible: false,
          borderColor: 'rgba(42, 46, 57, 0.3)',
        },
        rightPriceScale: {
          borderColor: 'rgba(42, 46, 57, 0.3)',
        },
        handleScroll: {
          vertTouchDrag: true,
        },
      });
      
      chartRef.current = chart;
      
      // Create candlestick series for more detailed price information
      const series = chart.addSeries({
        type: 'Candlestick',
        upColor: '#10B981', // Green for price increases
        downColor: '#ef4444', // Red for price decreases
        borderVisible: false,
        wickUpColor: '#10B981',
        wickDownColor: '#ef4444',
      } as any);
      
      // Generate sample data
      const data = generateCandlestickData(basePrice, 100, 
        timeInterval === '1m' ? 1 : 
        timeInterval === '5m' ? 5 : 
        timeInterval === '15m' ? 15 :
        timeInterval === '1h' ? 60 :
        timeInterval === '4h' ? 240 : 1440);
      
      // Set the data
      series.setData(data.map(candle => ({ 
        time: candle.time as unknown as number,
        open: typeof candle.open === 'number' ? candle.open : parseFloat(candle.open),
        high: typeof candle.high === 'number' ? candle.high : parseFloat(candle.high),
        low: typeof candle.low === 'number' ? candle.low : parseFloat(candle.low),
        close: typeof candle.close === 'number' ? candle.close : parseFloat(candle.close)
      } as any)));
      
      // Keep a reference to the series for updates
      seriesRef.current = series;
      
      // Keep track of the last candle time
      if (data.length > 0) {
        lastCandleTimeRef.current = data[data.length - 1].time as unknown as number;
      }
      
      // Set up resize observer
      const handleResize = () => {
        chart.applyOptions({
          width: chartContainerRef.current?.clientWidth || 600,
          height: chartContainerRef.current?.clientHeight || 400,
        });
      };
      
      resizeObserverRef.current = new ResizeObserver(handleResize);
      resizeObserverRef.current.observe(chartContainerRef.current);
      
      // Initial sizing
      handleResize();
      
      // Clean up
      return () => {
        if (resizeObserverRef.current && chartContainerRef.current) {
          resizeObserverRef.current.unobserve(chartContainerRef.current);
        }
        chart.remove();
      };
    }
  }, [basePrice]);
  
  // Update chart data when timeInterval changes
  useEffect(() => {
    if (chartRef.current) {
      const series = chartRef.current.series()[0]; // Get the first series
      if (series) {
        const data = generateCandlestickData(basePrice, 100, 
          timeInterval === '1m' ? 1 : 
          timeInterval === '5m' ? 5 : 
          timeInterval === '15m' ? 15 :
          timeInterval === '1h' ? 60 :
          timeInterval === '4h' ? 240 : 1440);
        
        series.setData(data.map(candle => ({
          time: candle.time as unknown as number,
          open: typeof candle.open === 'number' ? candle.open : parseFloat(candle.open),
          high: typeof candle.high === 'number' ? candle.high : parseFloat(candle.high),
          low: typeof candle.low === 'number' ? candle.low : parseFloat(candle.low),
          close: typeof candle.close === 'number' ? candle.close : parseFloat(candle.close)
        } as any)));
        
        // Update the reference to the series
        seriesRef.current = series;
        
        // Keep track of the last candle time
        if (data.length > 0) {
          lastCandleTimeRef.current = data[data.length - 1].time as unknown as number;
        }
      }
    }
  }, [timeInterval, basePrice]);
  
  // Subscribe to market updates via WebSocket
  useEffect(() => {
    // Wait a bit to ensure connection is established before subscribing
    const subscriptionTimer = setTimeout(() => {
      // Subscribe to the market channel for this trading pair
      const marketChannel = `market:${symbolParts}`;
      console.log(`Subscribing to WebSocket channel: ${marketChannel}`);
      subscribe(marketChannel);
      
      // Force a re-subscription just to be safe
      setTimeout(() => {
        console.log(`Re-subscribing to ensure connection: ${marketChannel}`);
        subscribe(marketChannel);
      }, 2000);
    }, 1000);
    
    // Clean up on unmount
    return () => {
      clearTimeout(subscriptionTimer);
      const marketChannel = `market:${symbolParts}`;
      console.log(`Unsubscribing from WebSocket channel: ${marketChannel}`);
      unsubscribe(marketChannel);
    };
  }, [subscribe, unsubscribe, symbolParts]);
  
  // Handle incoming WebSocket messages
  useEffect(() => {
    if (!lastMessage || !seriesRef.current) return;
    
    try {
      // Check if this is a market update for our symbol
      if (lastMessage.type === 'marketUpdate' && lastMessage.data) {
        console.log('Received WebSocket market update:', lastMessage);
        const marketData = lastMessage.data;
        
        // Only update if this is for our trading pair
        if (marketData.tradingPairId) {
          const currentPrice = parseFloat(marketData.lastPrice);
          
          // Get current time for the new candle
          const now = Math.floor(Date.now() / 1000);
          
          // Determine candle duration based on timeInterval
          const candleDuration = 
            timeInterval === '1m' ? 60 : 
            timeInterval === '5m' ? 300 : 
            timeInterval === '15m' ? 900 :
            timeInterval === '1h' ? 3600 :
            timeInterval === '4h' ? 14400 : 86400;
          
          // Calculate candle time (round down to nearest interval)
          const candleTime = Math.floor(now / candleDuration) * candleDuration;
          
          // Check if we need to add a new candle or update the last one
          if (candleTime > lastCandleTimeRef.current) {
            // Add a new candle
            seriesRef.current.update({
              time: candleTime,
              open: currentPrice,
              high: currentPrice,
              low: currentPrice,
              close: currentPrice
            });
            lastCandleTimeRef.current = candleTime;
          } else {
            // Update the last candle - get the data directly instead of using .bars()
            try {
              // Update the existing candle
              seriesRef.current.update({
                time: lastCandleTimeRef.current,
                close: currentPrice,
                // We might not know the original values, so we're being conservative here
                high: currentPrice > parseFloat(marketData.high24h || '0') ? currentPrice : parseFloat(marketData.high24h || '0'),
                low: currentPrice < parseFloat(marketData.low24h || '0') ? currentPrice : parseFloat(marketData.low24h || '0')
              });
            } catch (err) {
              console.error('Error updating candle:', err);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error processing WebSocket message:', error);
    }
  }, [lastMessage, timeInterval]);
  
  return (
    <Card className="overflow-hidden mb-4">
      {/* Chart Header */}
      <CardHeader className="p-3 border-b flex justify-between items-center">
        <div className="flex items-center space-x-2">
          {CHART_TYPES.map((type) => (
            <Button
              key={type.value}
              variant={chartType === type.value ? "default" : "outline"}
              size="sm"
              className="h-7 text-xs"
              onClick={() => setChartType(type.value as ChartType)}
            >
              <i className={`fa-solid ${type.icon} mr-1`}></i> {type.label}
            </Button>
          ))}
        </div>
        <div className="flex items-center space-x-2">
          {CHART_INTERVALS.map((interval) => (
            <Button
              key={interval.value}
              variant={timeInterval === interval.value ? "default" : "outline"}
              size="sm"
              className="h-7 text-xs px-2 py-1"
              onClick={() => setTimeInterval(interval.value as TimeInterval)}
            >
              {interval.label}
            </Button>
          ))}
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="h-7">
            <Maximize className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-7">
            <Sliders className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      {/* Chart Content */}
      <CardContent className="p-0">
        <div ref={chartContainerRef} className="trading-chart w-full h-96" />
      </CardContent>
    </Card>
  );
}
