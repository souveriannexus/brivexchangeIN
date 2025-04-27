import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format number with thousand separators and decimal places
export function formatNumber(
  value: number | string,
  decimals: number = 2,
  thousandSeparator: string = ",",
  decimalSeparator: string = "."
): string {
  if (value === undefined || value === null) return "0";
  
  const num = typeof value === "string" ? parseFloat(value) : value;
  
  // Check if the number is NaN
  if (isNaN(num)) return "0";
  
  const fixedNum = num.toFixed(decimals);
  const parts = fixedNum.split(".");
  
  // Add thousand separators
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator);
  
  return parts.join(decimalSeparator);
}

// Format currency with symbol
export function formatCurrency(
  value: number | string,
  currency: string = "USD",
  decimals: number = 2
): string {
  if (value === undefined || value === null) return `$0.00`;
  
  const num = typeof value === "string" ? parseFloat(value) : value;
  
  if (isNaN(num)) return `$0.00`;
  
  switch (currency.toUpperCase()) {
    case "USD":
    case "USDT":
    case "USDC":
      return `$${formatNumber(num, decimals)}`;
    case "EUR":
      return `€${formatNumber(num, decimals)}`;
    case "GBP":
      return `£${formatNumber(num, decimals)}`;
    case "BTC":
      return `₿${formatNumber(num, 8)}`;
    case "ETH":
      return `Ξ${formatNumber(num, 6)}`;
    default:
      return `${formatNumber(num, decimals)} ${currency}`;
  }
}

// Get currency icon class (mainly for crypto currencies)
export function getCurrencyIcon(currency: string): string {
  const lowerCurrency = currency.toLowerCase();
  switch (lowerCurrency) {
    case "btc":
    case "bitcoin":
      return "fa-brands fa-bitcoin text-warning";
    case "eth":
    case "ethereum":
      return "fa-brands fa-ethereum text-blue-300";
    case "bnb":
      return "fa-solid fa-b text-yellow-500";
    case "xrp":
      return "fa-solid fa-x text-blue-400";
    case "briv":
      return "fa-solid fa-b text-primary";
    case "usdt":
    case "usdc":
      return "fa-solid fa-dollar-sign text-green-400";
    default:
      return "fa-solid fa-coins text-gray-400";
  }
}

// Format time in HH:MM:SS format
export function formatTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
}

// Format date in YYYY-MM-DD format
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString([], { year: "numeric", month: "short", day: "numeric" });
}

// Generate a random price movement (for demo purposes)
export function randomPriceChange(basePrice: number, volatilityPercentage: number = 0.5): number {
  const changePercent = (Math.random() * volatilityPercentage * 2) - volatilityPercentage;
  return basePrice * (1 + changePercent / 100);
}

// Calculate percentage change
export function calculatePercentageChange(oldValue: number, newValue: number): number {
  return ((newValue - oldValue) / oldValue) * 100;
}

// Truncate text with ellipsis
export function truncateText(text: string, maxLength: number): string {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
}

// Get color class based on value (positive/negative)
export function getColorByValue(value: number | string): string {
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return "text-foreground";
  
  if (num > 0) return "text-success";
  if (num < 0) return "text-destructive";
  return "text-foreground";
}

// Calculate total value from price and amount
export function calculateTotal(price: string | number, amount: string | number): string {
  const p = typeof price === "string" ? parseFloat(price) : price;
  const a = typeof amount === "string" ? parseFloat(amount) : amount;
  
  if (isNaN(p) || isNaN(a)) return "0";
  
  return (p * a).toString();
}
