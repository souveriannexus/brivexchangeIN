import { 
  User, InsertUser, 
  Wallet, InsertWallet,
  Transaction, InsertTransaction,
  TradingPair, InsertTradingPair,
  Order, InsertOrder,
  Trade, InsertTrade,
  MarketData
} from "@shared/schema";
import { WebSocket } from "ws";
import createMemoryStore from "memorystore";
import session from "express-session";

// Client connection type
export type ClientConnection = {
  userId?: number;
  subscriptions: Set<string>;
  ws: WebSocket;
};

// Session store
const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // Session store
  sessionStore: session.SessionStore;

  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;
  
  // Wallet methods
  getWallet(id: number): Promise<Wallet | undefined>;
  getWalletsByUserId(userId: number): Promise<Wallet[]>;
  getWalletByUserIdAndCurrency(userId: number, currency: string): Promise<Wallet | undefined>;
  createWallet(wallet: InsertWallet): Promise<Wallet>;
  updateWalletBalance(id: number, amount: string): Promise<Wallet | undefined>;
  
  // Transaction methods
  getTransaction(id: number): Promise<Transaction | undefined>;
  getTransactionsByUserId(userId: number): Promise<Transaction[]>;
  getTransactionsByWalletId(walletId: number): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  
  // Trading pair methods
  getTradingPair(id: number): Promise<TradingPair | undefined>;
  getTradingPairBySymbol(baseSymbol: string, quoteSymbol: string): Promise<TradingPair | undefined>;
  getAllTradingPairs(): Promise<TradingPair[]>;
  createTradingPair(tradingPair: InsertTradingPair): Promise<TradingPair>;
  
  // Order methods
  getOrder(id: number): Promise<Order | undefined>;
  getOrdersByUserId(userId: number): Promise<Order[]>;
  getOpenOrdersByUserId(userId: number): Promise<Order[]>;
  getOrdersByTradingPairId(tradingPairId: number): Promise<Order[]>;
  getOpenOrdersByTradingPairId(tradingPairId: number): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: number, status: string, filled?: string): Promise<Order | undefined>;
  
  // Trade methods
  getTrade(id: number): Promise<Trade | undefined>;
  getTradesByUserId(userId: number): Promise<Trade[]>;
  getTradesByTradingPairId(tradingPairId: number): Promise<Trade[]>;
  createTrade(trade: InsertTrade): Promise<Trade>;
  
  // Market data methods
  getMarketData(tradingPairId: number): Promise<MarketData | undefined>;
  updateMarketData(tradingPairId: number, data: Partial<MarketData>): Promise<MarketData | undefined>;
  
  // WebSocket methods
  addClient(clientId: string, client: ClientConnection): void;
  getClient(clientId: string): ClientConnection | undefined;
  removeClient(clientId: string): void;
  getAllClients(): Map<string, ClientConnection>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private wallets: Map<number, Wallet>;
  private transactions: Map<number, Transaction>;
  private tradingPairs: Map<number, TradingPair>;
  private orders: Map<number, Order>;
  private trades: Map<number, Trade>;
  private marketDataMap: Map<number, MarketData>;
  private clients: Map<string, ClientConnection>;
  sessionStore: session.SessionStore;
  
  userId: number = 1;
  walletId: number = 1;
  transactionId: number = 1;
  tradingPairId: number = 1;
  orderId: number = 1;
  tradeId: number = 1;
  marketDataId: number = 1;

  constructor() {
    this.users = new Map();
    this.wallets = new Map();
    this.transactions = new Map();
    this.tradingPairs = new Map();
    this.orders = new Map();
    this.trades = new Map();
    this.marketDataMap = new Map();
    this.clients = new Map();
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // Clear expired sessions every 24h
    });
    
    // Initialize with some trading pairs
    this.initTradingPairs();
  }

  private initTradingPairs() {
    const pairs = [
      { baseCurrency: "BTC", quoteCurrency: "USDT" },
      { baseCurrency: "ETH", quoteCurrency: "USDT" },
      { baseCurrency: "BNB", quoteCurrency: "USDT" },
      { baseCurrency: "XRP", quoteCurrency: "USDT" },
      { baseCurrency: "BRIV", quoteCurrency: "USDT" },
    ];

    pairs.forEach(pair => {
      this.createTradingPair({
        baseCurrency: pair.baseCurrency,
        quoteCurrency: pair.quoteCurrency,
        isActive: true,
      });
    });
    
    // Initialize market data for trading pairs
    this.initMarketData();
  }
  
  private initMarketData() {
    // Sample market data initialization
    const marketData = [
      { tradingPairId: 1, lastPrice: "25431.20", change24h: "1.45", high24h: "25987.54", low24h: "24978.32", volume24h: "428500000" },
      { tradingPairId: 2, lastPrice: "1824.65", change24h: "2.32", high24h: "1856.78", low24h: "1789.32", volume24h: "254700000" },
      { tradingPairId: 3, lastPrice: "231.45", change24h: "-0.75", high24h: "234.56", low24h: "228.76", volume24h: "87600000" },
      { tradingPairId: 4, lastPrice: "0.5487", change24h: "3.21", high24h: "0.5624", low24h: "0.5312", volume24h: "156300000" },
      { tradingPairId: 5, lastPrice: "5.324", change24h: "8.45", high24h: "5.478", low24h: "4.964", volume24h: "24500000" },
    ];
    
    marketData.forEach((data, index) => {
      this.marketDataMap.set(index + 1, {
        id: index + 1,
        tradingPairId: data.tradingPairId,
        lastPrice: data.lastPrice,
        change24h: data.change24h,
        high24h: data.high24h,
        low24h: data.low24h,
        volume24h: data.volume24h,
        updatedAt: new Date(),
      });
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase(),
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase(),
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { 
      ...insertUser, 
      id,
      emailVerified: false,
      phoneVerified: false,
      twoFactorEnabled: false,
      kycStatus: "unverified",
      role: "user",
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Wallet methods
  async getWallet(id: number): Promise<Wallet | undefined> {
    return this.wallets.get(id);
  }

  async getWalletsByUserId(userId: number): Promise<Wallet[]> {
    return Array.from(this.wallets.values()).filter(
      (wallet) => wallet.userId === userId,
    );
  }

  async getWalletByUserIdAndCurrency(userId: number, currency: string): Promise<Wallet | undefined> {
    return Array.from(this.wallets.values()).find(
      (wallet) => wallet.userId === userId && wallet.currency === currency,
    );
  }

  async createWallet(insertWallet: InsertWallet): Promise<Wallet> {
    const id = this.walletId++;
    const wallet: Wallet = {
      ...insertWallet,
      id,
      balance: "0",
      createdAt: new Date(),
    };
    this.wallets.set(id, wallet);
    return wallet;
  }

  async updateWalletBalance(id: number, amount: string): Promise<Wallet | undefined> {
    const wallet = await this.getWallet(id);
    if (!wallet) return undefined;
    
    const updatedWallet = { 
      ...wallet, 
      balance: amount,
    };
    this.wallets.set(id, updatedWallet);
    return updatedWallet;
  }

  // Transaction methods
  async getTransaction(id: number): Promise<Transaction | undefined> {
    return this.transactions.get(id);
  }

  async getTransactionsByUserId(userId: number): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).filter(
      (transaction) => transaction.userId === userId,
    );
  }

  async getTransactionsByWalletId(walletId: number): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).filter(
      (transaction) => transaction.walletId === walletId,
    );
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const id = this.transactionId++;
    const transaction: Transaction = {
      ...insertTransaction,
      id,
      createdAt: new Date(),
    };
    this.transactions.set(id, transaction);
    return transaction;
  }

  // Trading pair methods
  async getTradingPair(id: number): Promise<TradingPair | undefined> {
    return this.tradingPairs.get(id);
  }

  async getTradingPairBySymbol(baseSymbol: string, quoteSymbol: string): Promise<TradingPair | undefined> {
    return Array.from(this.tradingPairs.values()).find(
      (pair) => pair.baseCurrency.toLowerCase() === baseSymbol.toLowerCase() && 
                pair.quoteCurrency.toLowerCase() === quoteSymbol.toLowerCase(),
    );
  }

  async getAllTradingPairs(): Promise<TradingPair[]> {
    return Array.from(this.tradingPairs.values());
  }

  async createTradingPair(insertTradingPair: InsertTradingPair): Promise<TradingPair> {
    const id = this.tradingPairId++;
    const tradingPair: TradingPair = {
      ...insertTradingPair,
      id,
      minOrderSize: insertTradingPair.minOrderSize || "0.0001",
      priceDecimalPlaces: insertTradingPair.priceDecimalPlaces || 2,
      amountDecimalPlaces: insertTradingPair.amountDecimalPlaces || 6,
      makerFee: insertTradingPair.makerFee || "0.001",
      takerFee: insertTradingPair.takerFee || "0.001",
      isActive: insertTradingPair.isActive !== undefined ? insertTradingPair.isActive : true,
      createdAt: new Date(),
    };
    this.tradingPairs.set(id, tradingPair);
    return tradingPair;
  }

  // Order methods
  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async getOrdersByUserId(userId: number): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(
      (order) => order.userId === userId,
    );
  }

  async getOpenOrdersByUserId(userId: number): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(
      (order) => order.userId === userId && ['open', 'partial'].includes(order.status),
    );
  }

  async getOrdersByTradingPairId(tradingPairId: number): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(
      (order) => order.tradingPairId === tradingPairId,
    );
  }

  async getOpenOrdersByTradingPairId(tradingPairId: number): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(
      (order) => order.tradingPairId === tradingPairId && ['open', 'partial'].includes(order.status),
    );
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = this.orderId++;
    const order: Order = {
      ...insertOrder,
      id,
      filled: "0",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.orders.set(id, order);
    return order;
  }

  async updateOrderStatus(id: number, status: string, filled?: string): Promise<Order | undefined> {
    const order = await this.getOrder(id);
    if (!order) return undefined;
    
    const updatedOrder = { 
      ...order, 
      status,
      filled: filled !== undefined ? filled : order.filled,
      updatedAt: new Date(),
    };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }

  // Trade methods
  async getTrade(id: number): Promise<Trade | undefined> {
    return this.trades.get(id);
  }

  async getTradesByUserId(userId: number): Promise<Trade[]> {
    return Array.from(this.trades.values()).filter(
      (trade) => trade.userId === userId,
    );
  }

  async getTradesByTradingPairId(tradingPairId: number): Promise<Trade[]> {
    return Array.from(this.trades.values()).filter(
      (trade) => trade.tradingPairId === tradingPairId,
    );
  }

  async createTrade(insertTrade: InsertTrade): Promise<Trade> {
    const id = this.tradeId++;
    const trade: Trade = {
      ...insertTrade,
      id,
      createdAt: new Date(),
    };
    this.trades.set(id, trade);
    return trade;
  }

  // Market data methods
  async getMarketData(tradingPairId: number): Promise<MarketData | undefined> {
    return Array.from(this.marketDataMap.values()).find(
      (data) => data.tradingPairId === tradingPairId,
    );
  }

  async updateMarketData(tradingPairId: number, updates: Partial<MarketData>): Promise<MarketData | undefined> {
    const marketData = await this.getMarketData(tradingPairId);
    if (!marketData) return undefined;
    
    const updatedMarketData = { 
      ...marketData, 
      ...updates,
      updatedAt: new Date(),
    };
    this.marketDataMap.set(marketData.id, updatedMarketData);
    return updatedMarketData;
  }
  
  // WebSocket methods
  addClient(clientId: string, client: ClientConnection): void {
    this.clients.set(clientId, client);
  }
  
  getClient(clientId: string): ClientConnection | undefined {
    return this.clients.get(clientId);
  }
  
  removeClient(clientId: string): void {
    this.clients.delete(clientId);
  }
  
  getAllClients(): Map<string, ClientConnection> {
    return this.clients;
  }
}

export const storage = new MemStorage();
