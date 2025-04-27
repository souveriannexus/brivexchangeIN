import { MarketPrice, OrderBook, TradeHistoryItem } from "./types";

// Generate order book data for demo
export function generateOrderBookData(basePrice: number, depth: number = 20): OrderBook {
  const asks: { price: string; amount: string; total: string }[] = [];
  const bids: { price: string; amount: string; total: string }[] = [];

  let askPrice = basePrice;
  let bidPrice = basePrice;
  let maxTotal = 0;

  // Generate ask orders (sells - higher than base price)
  for (let i = 0; i < depth; i++) {
    // Slightly increase the price for each ask level (0.01% to 0.1% higher)
    askPrice += askPrice * (Math.random() * 0.001 + 0.0001);
    const amount = (Math.random() * 2 + 0.1).toFixed(6);
    const total = (askPrice * parseFloat(amount)).toFixed(2);
    
    asks.push({
      price: askPrice.toFixed(2),
      amount,
      total,
    });
    
    if (parseFloat(total) > maxTotal) maxTotal = parseFloat(total);
  }

  // Generate bid orders (buys - lower than base price)
  for (let i = 0; i < depth; i++) {
    // Slightly decrease the price for each bid level (0.01% to 0.1% lower)
    bidPrice -= bidPrice * (Math.random() * 0.001 + 0.0001);
    const amount = (Math.random() * 2 + 0.1).toFixed(6);
    const total = (bidPrice * parseFloat(amount)).toFixed(2);
    
    bids.push({
      price: bidPrice.toFixed(2),
      amount,
      total,
    });
    
    if (parseFloat(total) > maxTotal) maxTotal = parseFloat(total);
  }

  // Sort asks in descending order (highest ask first)
  asks.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
  
  // Calculate depth percentage for visualization
  asks.forEach((ask) => {
    ask.depth = (parseFloat(ask.total) / maxTotal) * 100;
  });
  
  bids.forEach((bid) => {
    bid.depth = (parseFloat(bid.total) / maxTotal) * 100;
  });

  return { asks, bids };
}

// Generate trade history data for demo
export function generateTradeHistoryData(
  basePrice: number,
  count: number = 20
): TradeHistoryItem[] {
  const trades: TradeHistoryItem[] = [];
  
  let lastTime = new Date();
  let lastPrice = basePrice;

  for (let i = 0; i < count; i++) {
    // Randomly generate price with small variation from previous
    const priceChange = lastPrice * (Math.random() * 0.004 - 0.002);
    const price = lastPrice + priceChange;
    
    // Randomly generate amount
    const amount = (Math.random() * 1 + 0.05).toFixed(6);
    
    // Calculate total
    const total = (price * parseFloat(amount)).toFixed(2);
    
    // Decrease time by random seconds (10 to 60 seconds)
    const timeDecrease = Math.floor(Math.random() * 50) + 10;
    lastTime = new Date(lastTime.getTime() - timeDecrease * 1000);
    
    // Format time as HH:MM:SS
    const timeString = lastTime.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: false
    });
    
    trades.push({
      id: i + 1,
      side: Math.random() > 0.5 ? 'buy' : 'sell',
      price: price.toFixed(2),
      amount,
      total,
      time: timeString,
    });
    
    lastPrice = price;
  }

  return trades;
}

// Generate candlestick data for TradingView charts
export function generateCandlestickData(
  basePrice: number,
  periods: number = 100,
  timeframe: number = 15 // minutes
): {
  time: number; // Timestamp in seconds
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}[] {
  const data = [];
  let lastClose = basePrice;
  let time = Math.floor(Date.now() / 1000) - periods * timeframe * 60;

  for (let i = 0; i < periods; i++) {
    // Use the last close as this candle's open
    const open = lastClose;
    
    // Generate a random volatility factor (0.1% to 1%)
    const volatility = basePrice * (Math.random() * 0.01 + 0.001);
    
    // Generate random price movements
    const movement = Math.random() > 0.5 ? 1 : -1;
    const change = volatility * movement;
    const close = open + change;
    
    // Generate high and low that respect open and close
    const highFromOpenClose = Math.max(open, close);
    const lowFromOpenClose = Math.min(open, close);
    
    const highExtra = volatility * Math.random();
    const lowExtra = volatility * Math.random();
    
    const high = highFromOpenClose + highExtra;
    const low = lowFromOpenClose - lowExtra;
    
    // Generate a random volume
    const volume = basePrice * (Math.random() * 100 + 10);
    
    data.push({
      time: time + (i * timeframe * 60),
      open,
      high,
      low,
      close,
      volume,
    });
    
    lastClose = close;
  }

  return data;
}
