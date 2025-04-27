import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupWebSocketServer } from "./websocket";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { TradingPair, User, Order, insertUserSchema } from "@shared/schema";
import { z } from "zod";

declare global {
  namespace Express {
    interface User extends User {}
  }
}

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up session management
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "briv-exchange-secret-key",
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      maxAge: 86400000, // 24 hours
      secure: process.env.NODE_ENV === "production",
    },
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  // Configure passport with local strategy
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        // Check if user exists by username or email
        let user = await storage.getUserByUsername(username);
        if (!user) {
          user = await storage.getUserByEmail(username);
        }
        
        if (!user || !(await comparePasswords(password, user.password))) {
          return done(null, false);
        } else {
          return done(null, user);
        }
      } catch (error) {
        return done(error);
      }
    })
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  // Authentication routes
  app.post("/api/register", async (req, res, next) => {
    try {
      // Validate the request body
      const userSchema = insertUserSchema.extend({
        confirmPassword: z.string(),
      }).refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
      });
      
      const validatedData = userSchema.parse(req.body);
      
      // Check if username or email already exists
      const existingUsername = await storage.getUserByUsername(validatedData.username);
      if (existingUsername) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      const existingEmail = await storage.getUserByEmail(validatedData.email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }

      // Create the user
      const user = await storage.createUser({
        ...validatedData,
        password: await hashPassword(validatedData.password),
      });

      // Create default wallets for the user
      const currencies = ["BTC", "ETH", "USDT", "BNB", "XRP", "BRIV"];
      for (const currency of currencies) {
        await storage.createWallet({
          userId: user.id,
          currency,
          address: `mock-${currency.toLowerCase()}-address-${randomBytes(8).toString("hex")}`,
        });
      }

      // Log the user in
      req.login(user, (err) => {
        if (err) return next(err);
        // Don't send password in response
        const { password, ...userWithoutPassword } = user;
        res.status(201).json(userWithoutPassword);
      });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/login", passport.authenticate("local"), (req, res) => {
    // Don't send password in response
    const { password, ...userWithoutPassword } = req.user as User;
    res.status(200).json(userWithoutPassword);
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    // Don't send password in response
    const { password, ...userWithoutPassword } = req.user as User;
    res.json(userWithoutPassword);
  });

  // Trading pairs routes
  app.get("/api/trading-pairs", async (req, res) => {
    try {
      const tradingPairs = await storage.getAllTradingPairs();
      res.json(tradingPairs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch trading pairs" });
    }
  });

  app.get("/api/trading-pairs/:id", async (req, res) => {
    try {
      const tradingPair = await storage.getTradingPair(parseInt(req.params.id));
      if (!tradingPair) {
        return res.status(404).json({ message: "Trading pair not found" });
      }
      res.json(tradingPair);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch trading pair" });
    }
  });

  // Market data routes
  app.get("/api/market-data/:tradingPairId", async (req, res) => {
    try {
      const marketData = await storage.getMarketData(parseInt(req.params.tradingPairId));
      if (!marketData) {
        return res.status(404).json({ message: "Market data not found" });
      }
      res.json(marketData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch market data" });
    }
  });

  // Wallet routes
  app.get("/api/wallets", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const wallets = await storage.getWalletsByUserId(req.user!.id);
      res.json(wallets);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch wallets" });
    }
  });

  app.get("/api/wallets/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const wallet = await storage.getWallet(parseInt(req.params.id));
      if (!wallet || wallet.userId !== req.user!.id) {
        return res.status(404).json({ message: "Wallet not found" });
      }
      res.json(wallet);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch wallet" });
    }
  });

  // Transaction routes
  app.get("/api/transactions", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const transactions = await storage.getTransactionsByUserId(req.user!.id);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  // Order routes
  app.get("/api/orders", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    const { status } = req.query;
    try {
      let orders = await storage.getOrdersByUserId(req.user!.id);
      
      if (status === 'open') {
        orders = orders.filter(order => ['open', 'partial'].includes(order.status));
      }
      
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.post("/api/orders", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const { tradingPairId, type, side, price, amount, stopPrice } = req.body;
      
      // Validate trading pair
      const tradingPair = await storage.getTradingPair(tradingPairId);
      if (!tradingPair) {
        return res.status(404).json({ message: "Trading pair not found" });
      }
      
      // Create order
      const order = await storage.createOrder({
        userId: req.user!.id,
        tradingPairId,
        type,
        side,
        status: "open",
        price,
        amount,
        stopPrice,
      });
      
      res.status(201).json(order);
    } catch (error) {
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  app.delete("/api/orders/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const order = await storage.getOrder(parseInt(req.params.id));
      if (!order || order.userId !== req.user!.id) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      const updatedOrder = await storage.updateOrderStatus(order.id, "cancelled");
      res.json(updatedOrder);
    } catch (error) {
      res.status(500).json({ message: "Failed to cancel order" });
    }
  });

  // Trade routes
  app.get("/api/trades", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const trades = await storage.getTradesByUserId(req.user!.id);
      res.json(trades);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch trades" });
    }
  });

  app.get("/api/trades/pair/:tradingPairId", async (req, res) => {
    try {
      const trades = await storage.getTradesByTradingPairId(parseInt(req.params.tradingPairId));
      res.json(trades);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch trades" });
    }
  });
  
  // Deposit and withdrawal simulation routes
  app.post("/api/wallets/deposit", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const { walletId, amount } = req.body;
      
      // Validate wallet
      const wallet = await storage.getWallet(walletId);
      if (!wallet || wallet.userId !== req.user!.id) {
        return res.status(404).json({ message: "Wallet not found" });
      }
      
      // Create transaction
      const transaction = await storage.createTransaction({
        userId: req.user!.id,
        walletId,
        type: "deposit",
        amount,
        fee: "0",
        status: "completed",
        fromAddress: "external",
        toAddress: wallet.address!,
      });
      
      // Update wallet balance
      const newBalance = (Number(wallet.balance) + Number(amount)).toString();
      const updatedWallet = await storage.updateWalletBalance(walletId, newBalance);
      
      res.status(201).json({ transaction, wallet: updatedWallet });
    } catch (error) {
      res.status(500).json({ message: "Failed to process deposit" });
    }
  });

  app.post("/api/wallets/withdraw", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const { walletId, amount, toAddress } = req.body;
      
      // Validate wallet
      const wallet = await storage.getWallet(walletId);
      if (!wallet || wallet.userId !== req.user!.id) {
        return res.status(404).json({ message: "Wallet not found" });
      }
      
      // Check balance
      if (Number(wallet.balance) < Number(amount)) {
        return res.status(400).json({ message: "Insufficient balance" });
      }
      
      // Calculate fee (0.1%)
      const fee = (Number(amount) * 0.001).toString();
      const totalDeduction = (Number(amount) + Number(fee)).toString();
      
      // Create transaction
      const transaction = await storage.createTransaction({
        userId: req.user!.id,
        walletId,
        type: "withdrawal",
        amount,
        fee,
        status: "completed",
        fromAddress: wallet.address!,
        toAddress,
      });
      
      // Update wallet balance
      const newBalance = (Number(wallet.balance) - Number(totalDeduction)).toString();
      const updatedWallet = await storage.updateWalletBalance(walletId, newBalance);
      
      res.status(201).json({ transaction, wallet: updatedWallet });
    } catch (error) {
      res.status(500).json({ message: "Failed to process withdrawal" });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);
  
  // Set up WebSocket server
  setupWebSocketServer(httpServer);

  return httpServer;
}
