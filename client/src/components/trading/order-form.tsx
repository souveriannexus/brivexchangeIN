import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Wallet } from "@/lib/types";
import { formatNumber, calculateTotal } from "@/lib/utils";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface OrderFormProps {
  symbol: string;
  baseSymbol: string;
  quoteSymbol: string;
  currentPrice: string;
  tradingPairId: number;
}

export function OrderForm({
  symbol,
  baseSymbol,
  quoteSymbol,
  currentPrice,
  tradingPairId,
}: OrderFormProps) {
  const { toast } = useToast();
  
  // State for order form
  const [tradeType, setTradeType] = useState<"spot" | "margin" | "futures">("spot");
  const [orderType, setOrderType] = useState<"limit" | "market" | "stop_limit">("limit");
  const [demoMode, setDemoMode] = useState<boolean>(true); // Default to demo mode enabled
  
  // Buy form state
  const [buyPrice, setBuyPrice] = useState(currentPrice);
  const [buyAmount, setBuyAmount] = useState("");
  const [buyTotal, setBuyTotal] = useState("");
  
  // Sell form state
  const [sellPrice, setSellPrice] = useState(currentPrice);
  const [sellAmount, setSellAmount] = useState("");
  const [sellTotal, setSellTotal] = useState("");
  
  // Update price when current price changes
  if (currentPrice !== buyPrice) {
    setBuyPrice(currentPrice);
  }
  if (currentPrice !== sellPrice) {
    setSellPrice(currentPrice);
  }
  
  // Calculate totals
  const updateBuyTotal = (price: string, amount: string) => {
    if (price && amount) {
      setBuyTotal(calculateTotal(price, amount));
    } else {
      setBuyTotal("");
    }
  };
  
  const updateSellTotal = (price: string, amount: string) => {
    if (price && amount) {
      setSellTotal(calculateTotal(price, amount));
    } else {
      setSellTotal("");
    }
  };
  
  // Update totals when inputs change
  const handleBuyPriceChange = (price: string) => {
    setBuyPrice(price);
    updateBuyTotal(price, buyAmount);
  };
  
  const handleBuyAmountChange = (amount: string) => {
    setBuyAmount(amount);
    updateBuyTotal(buyPrice, amount);
  };
  
  const handleSellPriceChange = (price: string) => {
    setSellPrice(price);
    updateSellTotal(price, sellAmount);
  };
  
  const handleSellAmountChange = (amount: string) => {
    setSellAmount(amount);
    updateSellTotal(sellPrice, amount);
  };
  
  // Get wallet data
  const { data: wallets } = useQuery<Wallet[]>({
    queryKey: ["/api/wallets"],
  });
  
  // Find base and quote wallets
  const baseWallet = wallets?.find(w => w.currency === baseSymbol);
  const quoteWallet = wallets?.find(w => w.currency === quoteSymbol);
  
  // Create order mutation
  const createOrderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      const res = await apiRequest("POST", "/api/orders", orderData);
      return await res.json();
    },
    onSuccess: () => {
      // Clear form
      setBuyAmount("");
      setBuyTotal("");
      setSellAmount("");
      setSellTotal("");
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      queryClient.invalidateQueries({ queryKey: ["/api/wallets"] });
      
      toast({
        title: "Order placed successfully",
        description: "Your order has been submitted to the order book",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to place order",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Handle demo order placement
  const handleDemoOrder = (side: 'buy' | 'sell', price: string, amount: string) => {
    // In demo mode, we just show a success message without making an actual API call
    setTimeout(() => {
      // Clear form
      if (side === 'buy') {
        setBuyAmount("");
        setBuyTotal("");
      } else {
        setSellAmount("");
        setSellTotal("");
      }
      
      toast({
        title: `Demo ${side} order placed`,
        description: `${side === 'buy' ? 'Bought' : 'Sold'} ${amount} ${baseSymbol} at ${price} ${quoteSymbol}`,
        variant: "default",
      });
    }, 500); // Add a small delay to simulate API call
  };
  
  // Handle order placement
  const handleBuyOrder = () => {
    if (!buyAmount || !buyPrice) {
      toast({
        title: "Invalid order",
        description: "Please enter both price and amount",
        variant: "destructive",
      });
      return;
    }
    
    if (demoMode) {
      handleDemoOrder('buy', buyPrice, buyAmount);
      return;
    }
    
    createOrderMutation.mutate({
      tradingPairId,
      type: orderType,
      side: "buy",
      price: buyPrice,
      amount: buyAmount,
      status: "open",
    });
  };
  
  const handleSellOrder = () => {
    if (!sellAmount || !sellPrice) {
      toast({
        title: "Invalid order",
        description: "Please enter both price and amount",
        variant: "destructive",
      });
      return;
    }
    
    if (demoMode) {
      handleDemoOrder('sell', sellPrice, sellAmount);
      return;
    }
    
    createOrderMutation.mutate({
      tradingPairId,
      type: orderType,
      side: "sell",
      price: sellPrice,
      amount: sellAmount,
      status: "open",
    });
  };
  
  // Calculate percentage of available balance
  const calculatePercentage = (percentage: number, wallet: Wallet | undefined, isBuy: boolean) => {
    if (!wallet) return;
    
    const availableBalance = parseFloat(wallet.balance);
    
    if (isBuy) {
      // For buy orders, calculate how much of quote currency (e.g., USDT) to use
      // and convert to base currency amount
      const quoteAmount = availableBalance * (percentage / 100);
      const estimatedBaseAmount = quoteAmount / parseFloat(buyPrice);
      setBuyAmount(estimatedBaseAmount.toFixed(6));
      updateBuyTotal(buyPrice, estimatedBaseAmount.toString());
    } else {
      // For sell orders, directly use percentage of base currency
      const baseAmount = availableBalance * (percentage / 100);
      setSellAmount(baseAmount.toFixed(6));
      updateSellTotal(sellPrice, baseAmount.toString());
    }
  };
  
  return (
    <Card className="overflow-hidden">
      {/* Tabs */}
      <Tabs defaultValue="spot" value={tradeType} onValueChange={(value) => setTradeType(value as any)}>
        <TabsList className="w-full rounded-none border-b">
          <TabsTrigger value="spot" className="flex-1 rounded-none">Spot</TabsTrigger>
          <TabsTrigger value="margin" className="flex-1 rounded-none">Margin</TabsTrigger>
          <TabsTrigger value="futures" className="flex-1 rounded-none">Futures</TabsTrigger>
        </TabsList>
      </Tabs>
      
      {/* Order Types */}
      <Tabs defaultValue="limit" value={orderType} onValueChange={(value) => setOrderType(value as any)}>
        <TabsList className="w-full rounded-none border-b bg-secondary">
          <TabsTrigger value="limit" className="flex-1 rounded-none">Limit</TabsTrigger>
          <TabsTrigger value="market" className="flex-1 rounded-none">Market</TabsTrigger>
          <TabsTrigger value="stop_limit" className="flex-1 rounded-none">Stop-Limit</TabsTrigger>
        </TabsList>
      </Tabs>
      
      {/* Demo Mode Toggle */}
      <div className="p-2 bg-muted/40 border-b flex items-center justify-end">
        <div className="flex items-center space-x-2">
          <Label htmlFor="demo-mode" className="text-xs font-medium">Demo Mode</Label>
          <Switch
            id="demo-mode"
            checked={demoMode}
            onCheckedChange={setDemoMode}
          />
        </div>
      </div>
      
      {/* Order Form */}
      <CardContent className="p-4 flex flex-col md:flex-row">
        {/* Buy Form */}
        <div className="flex-1 mb-4 md:mb-0 md:mr-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-success font-medium">Buy {baseSymbol}</h3>
            <div className="text-xs text-muted-foreground">
              Available: <span className="text-foreground">{quoteWallet ? formatNumber(quoteWallet.balance, 2) : "0"} {quoteSymbol}</span>
            </div>
          </div>
          
          <div className="mb-3">
            <label className="block text-xs text-muted-foreground mb-1">Price</label>
            <div className="relative">
              <Input
                type="text"
                value={buyPrice}
                onChange={(e) => handleBuyPriceChange(e.target.value)}
                className="w-full pr-16 font-mono"
                disabled={orderType === "market"}
              />
              <span className="absolute right-3 top-2 text-muted-foreground text-sm">{quoteSymbol}</span>
            </div>
          </div>
          
          <div className="mb-3">
            <label className="block text-xs text-muted-foreground mb-1">Amount</label>
            <div className="relative">
              <Input
                type="text"
                value={buyAmount}
                onChange={(e) => handleBuyAmountChange(e.target.value)}
                placeholder="0.00"
                className="w-full pr-16 font-mono"
              />
              <span className="absolute right-3 top-2 text-muted-foreground text-sm">{baseSymbol}</span>
            </div>
          </div>
          
          {/* Percentage buttons */}
          <div className="flex space-x-2 mb-3">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 h-7" 
              onClick={() => calculatePercentage(25, quoteWallet, true)}
            >
              25%
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 h-7" 
              onClick={() => calculatePercentage(50, quoteWallet, true)}
            >
              50%
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 h-7" 
              onClick={() => calculatePercentage(75, quoteWallet, true)}
            >
              75%
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 h-7" 
              onClick={() => calculatePercentage(100, quoteWallet, true)}
            >
              100%
            </Button>
          </div>
          
          <div className="mb-3">
            <label className="block text-xs text-muted-foreground mb-1">Total</label>
            <div className="relative">
              <Input
                type="text"
                value={buyTotal}
                readOnly
                placeholder="0.00"
                className="w-full pr-16 font-mono"
              />
              <span className="absolute right-3 top-2 text-muted-foreground text-sm">{quoteSymbol}</span>
            </div>
          </div>
          
          <Button 
            className="w-full bg-success hover:bg-success/90" 
            onClick={handleBuyOrder}
            disabled={createOrderMutation.isPending}
          >
            Buy {baseSymbol}
          </Button>
        </div>
        
        {/* Sell Form */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-destructive font-medium">Sell {baseSymbol}</h3>
            <div className="text-xs text-muted-foreground">
              Available: <span className="text-foreground">{baseWallet ? formatNumber(baseWallet.balance, 6) : "0"} {baseSymbol}</span>
            </div>
          </div>
          
          <div className="mb-3">
            <label className="block text-xs text-muted-foreground mb-1">Price</label>
            <div className="relative">
              <Input
                type="text"
                value={sellPrice}
                onChange={(e) => handleSellPriceChange(e.target.value)}
                className="w-full pr-16 font-mono"
                disabled={orderType === "market"}
              />
              <span className="absolute right-3 top-2 text-muted-foreground text-sm">{quoteSymbol}</span>
            </div>
          </div>
          
          <div className="mb-3">
            <label className="block text-xs text-muted-foreground mb-1">Amount</label>
            <div className="relative">
              <Input
                type="text"
                value={sellAmount}
                onChange={(e) => handleSellAmountChange(e.target.value)}
                placeholder="0.00"
                className="w-full pr-16 font-mono"
              />
              <span className="absolute right-3 top-2 text-muted-foreground text-sm">{baseSymbol}</span>
            </div>
          </div>
          
          {/* Percentage buttons */}
          <div className="flex space-x-2 mb-3">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 h-7" 
              onClick={() => calculatePercentage(25, baseWallet, false)}
            >
              25%
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 h-7" 
              onClick={() => calculatePercentage(50, baseWallet, false)}
            >
              50%
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 h-7" 
              onClick={() => calculatePercentage(75, baseWallet, false)}
            >
              75%
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 h-7" 
              onClick={() => calculatePercentage(100, baseWallet, false)}
            >
              100%
            </Button>
          </div>
          
          <div className="mb-3">
            <label className="block text-xs text-muted-foreground mb-1">Total</label>
            <div className="relative">
              <Input
                type="text"
                value={sellTotal}
                readOnly
                placeholder="0.00"
                className="w-full pr-16 font-mono"
              />
              <span className="absolute right-3 top-2 text-muted-foreground text-sm">{quoteSymbol}</span>
            </div>
          </div>
          
          <Button 
            className="w-full bg-destructive hover:bg-destructive/90" 
            onClick={handleSellOrder}
            disabled={createOrderMutation.isPending}
          >
            Sell {baseSymbol}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
