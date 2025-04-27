// Market Data Types
export type MarketPrice = {
  symbol: string;
  lastPrice: string;
  change24h: string;
  high24h: string;
  low24h: string;
  volume24h: string;
  baseCurrency: string;
  quoteCurrency: string;
  baseIcon?: string;
  updatedAt: Date;
};

// Trading Types
export type OrderType = 'limit' | 'market' | 'stop_limit';
export type OrderSide = 'buy' | 'sell';
export type OrderStatus = 'open' | 'filled' | 'partial' | 'cancelled';

export type Order = {
  id: number;
  userId: number;
  tradingPairId: number;
  type: OrderType;
  side: OrderSide;
  status: OrderStatus;
  price: string;
  amount: string;
  filled: string;
  stopPrice?: string;
  createdAt: Date;
  updatedAt?: Date;
};

export type OpenOrder = {
  id: number;
  symbol: string;
  type: OrderType;
  side: OrderSide;
  price: string;
  amount: string;
  filled: string;
  total: string;
  createdAt: Date;
};

export type Trade = {
  id: number;
  orderId?: number;
  tradingPairId: number;
  userId: number;
  side: OrderSide;
  price: string;
  amount: string;
  fee: string;
  feeCurrency: string;
  createdAt: Date;
};

export type TradeHistoryItem = {
  id: number;
  side: OrderSide;
  price: string;
  amount: string;
  total: string;
  time: string;
};

export type OrderBookEntry = {
  price: string;
  amount: string;
  total: string;
  depth?: number; // For visualization (0-100%)
};

export type OrderBook = {
  asks: OrderBookEntry[]; // Sell orders
  bids: OrderBookEntry[]; // Buy orders
};

// Wallet Types
export type Wallet = {
  id: number;
  userId: number;
  currency: string;
  address?: string;
  balance: string;
  createdAt: Date;
};

export type Transaction = {
  id: number;
  userId: number;
  walletId: number;
  type: 'deposit' | 'withdrawal' | 'transfer';
  amount: string;
  fee: string;
  status: 'pending' | 'completed' | 'failed';
  txHash?: string;
  fromAddress?: string;
  toAddress?: string;
  createdAt: Date;
};

// User Types
export type UserProfile = {
  id: number;
  username: string;
  email: string;
  fullName?: string;
  profileImageUrl?: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  twoFactorEnabled: boolean;
  kycStatus: string;
  role: string;
  createdAt: Date;
};

// WebSocket Types
export type WebSocketMessage = {
  type: string;
  data: any;
};

export type SubscriptionChannel = string;
