// Application constants
export const APP_NAME = "Briv Exchange";
export const APP_TAGLINE = "Trade Freely. Grow Fearlessly.";
export const APP_LOGO_TEXT = "BRIV";
export const APP_SUBTITLE = "Where Vision Meets Value";

// Supported currencies and trading pairs
export const SUPPORTED_CURRENCIES = [
  {
    symbol: "BTC",
    name: "Bitcoin",
    icon: "fa-brands fa-bitcoin text-warning",
    decimals: 8,
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    icon: "fa-brands fa-ethereum text-blue-300",
    decimals: 6,
  },
  {
    symbol: "BNB",
    name: "Binance Coin",
    icon: "fa-solid fa-b text-yellow-500",
    decimals: 6,
  },
  {
    symbol: "XRP",
    name: "Ripple",
    icon: "fa-solid fa-x text-blue-400",
    decimals: 4,
  },
  {
    symbol: "BRIV",
    name: "Briv Token",
    icon: "fa-solid fa-b text-primary",
    decimals: 6,
  },
  {
    symbol: "USDT",
    name: "Tether USD",
    icon: "fa-solid fa-dollar-sign text-green-400",
    decimals: 2,
  },
];

export const TRADING_PAIRS = [
  {
    id: 1,
    symbol: "BTC/USDT",
    baseSymbol: "BTC",
    quoteSymbol: "USDT",
    priceDecimals: 2,
    amountDecimals: 6,
  },
  {
    id: 2,
    symbol: "ETH/USDT",
    baseSymbol: "ETH",
    quoteSymbol: "USDT",
    priceDecimals: 2,
    amountDecimals: 6,
  },
  {
    id: 3,
    symbol: "BNB/USDT",
    baseSymbol: "BNB",
    quoteSymbol: "USDT",
    priceDecimals: 2,
    amountDecimals: 6,
  },
  {
    id: 4,
    symbol: "XRP/USDT",
    baseSymbol: "XRP",
    quoteSymbol: "USDT",
    priceDecimals: 4,
    amountDecimals: 2,
  },
  {
    id: 5,
    symbol: "BRIV/USDT",
    baseSymbol: "BRIV",
    quoteSymbol: "USDT",
    priceDecimals: 3,
    amountDecimals: 2,
  },
];

// Order types and sides
export const ORDER_TYPES = [
  { value: "limit", label: "Limit" },
  { value: "market", label: "Market" },
  { value: "stop_limit", label: "Stop-Limit" },
];

export const ORDER_SIDES = [
  { value: "buy", label: "Buy" },
  { value: "sell", label: "Sell" },
];

// Default fee structures
export const DEFAULT_MAKER_FEE = 0.1; // 0.1%
export const DEFAULT_TAKER_FEE = 0.1; // 0.1%
export const BRIV_TOKEN_FEE_DISCOUNT = 25; // 25% discount if holding BRIV tokens

// Time intervals for charts
export const CHART_INTERVALS = [
  { value: "1m", label: "1m" },
  { value: "5m", label: "5m" },
  { value: "15m", label: "15m" },
  { value: "1h", label: "1h" },
  { value: "4h", label: "4h" },
  { value: "1d", label: "1d" },
];

// Chart types
export const CHART_TYPES = [
  { value: "line", label: "Line", icon: "fa-chart-line" },
  { value: "candle", label: "Candle", icon: "fa-chart-column" },
  { value: "depth", label: "Depth", icon: "fa-chart-area" },
];

// Navigation items
export const NAV_ITEMS = [
  { path: "/", label: "Exchange", icon: "fa-chart-line" },
  { path: "/markets", label: "Markets", icon: "fa-globe" },
  { path: "/wallet", label: "Wallet", icon: "fa-wallet" },
  { path: "/profile", label: "Profile", icon: "fa-user" },
];

// WebSocket channels
export const WS_CHANNELS = {
  MARKET: "market",
  ORDERBOOK: "orderbook",
  TRADES: "trades",
  USER_ORDERS: "user:orders",
  USER_TRADES: "user:trades",
  USER_WALLET: "user:wallet",
};
