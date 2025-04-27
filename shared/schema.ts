import { pgTable, text, serial, integer, boolean, timestamp, numeric, jsonb, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name"),
  profileImageUrl: text("profile_image_url"),
  phone: text("phone"),
  emailVerified: boolean("email_verified").default(false),
  phoneVerified: boolean("phone_verified").default(false),
  twoFactorEnabled: boolean("two_factor_enabled").default(false),
  twoFactorSecret: text("two_factor_secret"),
  kycStatus: text("kyc_status").default("unverified"),
  role: text("role").default("user"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
  fullName: true,
});

// Wallet schema
export const wallets = pgTable("wallets", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  currency: text("currency").notNull(), // BTC, ETH, USDT, etc.
  address: text("address"),
  balance: numeric("balance", { precision: 24, scale: 8 }).default("0").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertWalletSchema = createInsertSchema(wallets).pick({
  userId: true,
  currency: true,
  address: true,
});

// Transaction schema
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  walletId: integer("wallet_id").notNull().references(() => wallets.id),
  type: text("type").notNull(), // deposit, withdrawal, transfer
  amount: numeric("amount", { precision: 24, scale: 8 }).notNull(),
  fee: numeric("fee", { precision: 24, scale: 8 }).default("0"),
  status: text("status").notNull(), // pending, completed, failed
  txHash: text("tx_hash"),
  fromAddress: text("from_address"),
  toAddress: text("to_address"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertTransactionSchema = createInsertSchema(transactions).pick({
  userId: true,
  walletId: true,
  type: true,
  amount: true,
  fee: true,
  status: true,
  txHash: true,
  fromAddress: true,
  toAddress: true,
});

// Trading pairs schema
export const tradingPairs = pgTable("trading_pairs", {
  id: serial("id").primaryKey(),
  baseCurrency: text("base_currency").notNull(), // BTC, ETH, etc.
  quoteCurrency: text("quote_currency").notNull(), // USDT, USDC, etc.
  minOrderSize: numeric("min_order_size", { precision: 24, scale: 8 }).default("0.0001"),
  maxOrderSize: numeric("max_order_size", { precision: 24, scale: 8 }),
  priceDecimalPlaces: integer("price_decimal_places").default(2),
  amountDecimalPlaces: integer("amount_decimal_places").default(6),
  makerFee: numeric("maker_fee", { precision: 5, scale: 4 }).default("0.001"),
  takerFee: numeric("taker_fee", { precision: 5, scale: 4 }).default("0.001"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertTradingPairSchema = createInsertSchema(tradingPairs).pick({
  baseCurrency: true,
  quoteCurrency: true,
  minOrderSize: true,
  maxOrderSize: true,
  priceDecimalPlaces: true,
  amountDecimalPlaces: true,
  makerFee: true,
  takerFee: true,
  isActive: true,
});

// Order schema
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  tradingPairId: integer("trading_pair_id").notNull().references(() => tradingPairs.id),
  type: text("type").notNull(), // limit, market, stop_limit
  side: text("side").notNull(), // buy, sell
  status: text("status").notNull(), // open, filled, partial, cancelled
  price: numeric("price", { precision: 24, scale: 8 }),
  amount: numeric("amount", { precision: 24, scale: 8 }).notNull(),
  filled: numeric("filled", { precision: 24, scale: 8 }).default("0"),
  stopPrice: numeric("stop_price", { precision: 24, scale: 8 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at"),
});

export const insertOrderSchema = createInsertSchema(orders).pick({
  userId: true,
  tradingPairId: true,
  type: true,
  side: true,
  status: true,
  price: true,
  amount: true,
  stopPrice: true,
});

// Trade schema
export const trades = pgTable("trades", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id),
  userId: integer("user_id").notNull().references(() => users.id),
  tradingPairId: integer("trading_pair_id").notNull().references(() => tradingPairs.id),
  side: text("side").notNull(), // buy, sell
  price: numeric("price", { precision: 24, scale: 8 }).notNull(),
  amount: numeric("amount", { precision: 24, scale: 8 }).notNull(),
  fee: numeric("fee", { precision: 24, scale: 8 }).notNull(),
  feeCurrency: text("fee_currency").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertTradeSchema = createInsertSchema(trades).pick({
  orderId: true,
  userId: true,
  tradingPairId: true,
  side: true,
  price: true,
  amount: true,
  fee: true,
  feeCurrency: true,
});

// Market data schema (for caching current prices)
export const marketData = pgTable("market_data", {
  id: serial("id").primaryKey(),
  tradingPairId: integer("trading_pair_id").notNull().references(() => tradingPairs.id),
  lastPrice: numeric("last_price", { precision: 24, scale: 8 }).notNull(),
  change24h: numeric("change_24h", { precision: 10, scale: 2 }),
  high24h: numeric("high_24h", { precision: 24, scale: 8 }),
  low24h: numeric("low_24h", { precision: 24, scale: 8 }),
  volume24h: numeric("volume_24h", { precision: 24, scale: 8 }),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Wallet = typeof wallets.$inferSelect;
export type InsertWallet = z.infer<typeof insertWalletSchema>;
export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type TradingPair = typeof tradingPairs.$inferSelect;
export type InsertTradingPair = z.infer<typeof insertTradingPairSchema>;
export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Trade = typeof trades.$inferSelect;
export type InsertTrade = z.infer<typeof insertTradeSchema>;
export type MarketData = typeof marketData.$inferSelect;
