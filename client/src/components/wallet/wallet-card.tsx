import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardFooter 
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { formatNumber, getCurrencyIcon } from "@/lib/utils";
import { Wallet, Transaction } from "@/lib/types";
import { Copy, ArrowDownToLine, ArrowUpFromLine, RotateCw } from "lucide-react";

interface WalletCardProps {
  wallet: Wallet;
}

export function WalletCard({ wallet }: WalletCardProps) {
  const { toast } = useToast();
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawAddress, setWithdrawAddress] = useState("");
  
  // Fetch transactions for this wallet
  const { data: transactions } = useQuery<Transaction[]>({
    queryKey: ['/api/transactions'],
  });
  
  // Filter transactions for this wallet
  const walletTransactions = transactions?.filter(
    transaction => transaction.walletId === wallet.id
  ) || [];
  
  // Deposit mutation
  const depositMutation = useMutation({
    mutationFn: async (data: { walletId: number; amount: string }) => {
      const res = await apiRequest("POST", "/api/wallets/deposit", data);
      return await res.json();
    },
    onSuccess: () => {
      setDepositAmount("");
      queryClient.invalidateQueries({ queryKey: ['/api/wallets'] });
      queryClient.invalidateQueries({ queryKey: ['/api/transactions'] });
      toast({
        title: "Deposit successful",
        description: `${depositAmount} ${wallet.currency} has been added to your wallet`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Deposit failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Withdraw mutation
  const withdrawMutation = useMutation({
    mutationFn: async (data: { walletId: number; amount: string; toAddress: string }) => {
      const res = await apiRequest("POST", "/api/wallets/withdraw", data);
      return await res.json();
    },
    onSuccess: () => {
      setWithdrawAmount("");
      setWithdrawAddress("");
      queryClient.invalidateQueries({ queryKey: ['/api/wallets'] });
      queryClient.invalidateQueries({ queryKey: ['/api/transactions'] });
      toast({
        title: "Withdrawal successful",
        description: `${withdrawAmount} ${wallet.currency} has been sent`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Withdrawal failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Handle deposit
  const handleDeposit = () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }
    
    depositMutation.mutate({
      walletId: wallet.id,
      amount: depositAmount,
    });
  };
  
  // Handle withdraw
  const handleWithdraw = () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }
    
    if (!withdrawAddress) {
      toast({
        title: "Invalid address",
        description: "Please enter a valid withdrawal address",
        variant: "destructive",
      });
      return;
    }
    
    if (parseFloat(withdrawAmount) > parseFloat(wallet.balance)) {
      toast({
        title: "Insufficient balance",
        description: `Your ${wallet.currency} balance is too low for this withdrawal`,
        variant: "destructive",
      });
      return;
    }
    
    withdrawMutation.mutate({
      walletId: wallet.id,
      amount: withdrawAmount,
      toAddress: withdrawAddress,
    });
  };
  
  // Copy address to clipboard
  const copyAddressToClipboard = () => {
    if (wallet.address) {
      navigator.clipboard.writeText(wallet.address);
      toast({
        title: "Address copied",
        description: "Address has been copied to clipboard",
      });
    }
  };
  
  // Get USD value
  const getUsdValue = () => {
    // Mock conversion rates
    const usdRate = wallet.currency === "USDT" ? 1 :
                  wallet.currency === "BTC" ? 25000 :
                  wallet.currency === "ETH" ? 1800 :
                  wallet.currency === "BNB" ? 220 :
                  wallet.currency === "XRP" ? 0.5 : 5;
    
    return parseFloat(wallet.balance) * usdRate;
  };
  
  // Get icon class
  const iconClass = getCurrencyIcon(wallet.currency);
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center">
          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center mr-3">
            <i className={`${iconClass}`}></i>
          </div>
          <div>
            {wallet.currency}
            <span className="text-xs font-normal text-muted-foreground ml-2">
              {
                wallet.currency === "BTC" ? "Bitcoin" :
                wallet.currency === "ETH" ? "Ethereum" :
                wallet.currency === "BNB" ? "Binance Coin" :
                wallet.currency === "XRP" ? "Ripple" :
                wallet.currency === "USDT" ? "Tether USD" : "Briv Token"
              }
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="flex flex-col">
          <div className="text-2xl font-medium font-mono mb-1">
            {formatNumber(wallet.balance, wallet.currency === "USDT" ? 2 : 6)}
          </div>
          <div className="text-sm text-muted-foreground">
            ≈ ${formatNumber(getUsdValue(), 2)}
          </div>
        </div>
        
        <div className="mt-4">
          <div className="text-sm text-muted-foreground mb-1">Wallet Address</div>
          <div className="flex items-center bg-secondary p-2 rounded text-sm font-mono overflow-hidden">
            <div className="truncate">{wallet.address || "No address available"}</div>
            <Button variant="ghost" size="sm" className="ml-1 p-0 h-6 w-6" onClick={copyAddressToClipboard}>
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex space-x-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex-1">
              <ArrowDownToLine className="mr-2 h-4 w-4" />
              Deposit
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Deposit {wallet.currency}</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <div className="mb-4">
                <Label>Your {wallet.currency} Address</Label>
                <div className="flex items-center bg-secondary p-2 mt-2 rounded text-sm font-mono overflow-hidden">
                  <div className="truncate">{wallet.address || "No address available"}</div>
                  <Button variant="ghost" size="sm" className="ml-1 p-0 h-6 w-6" onClick={copyAddressToClipboard}>
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Send only {wallet.currency} to this address. Sending any other coin may result in permanent loss.
                </p>
              </div>
              
              <div className="mb-4">
                <Label>QR Code</Label>
                <div className="mt-2 bg-white p-4 rounded flex justify-center">
                  <div className="w-32 h-32 bg-gray-200 rounded flex items-center justify-center text-gray-500 text-xs">
                    QR Code Placeholder
                  </div>
                </div>
              </div>
              
              {/* Demo Mode - Quick Deposit */}
              <div className="border-t pt-4 mt-4">
                <h3 className="text-sm font-medium mb-2">Demo Mode: Quick Deposit</h3>
                <p className="text-xs text-muted-foreground mb-2">
                  For demo purposes, you can instantly deposit funds:
                </p>
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    placeholder="Amount"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    min="0"
                    step="0.01"
                  />
                  <Button 
                    onClick={handleDeposit} 
                    disabled={depositMutation.isPending || !depositAmount}
                  >
                    {depositMutation.isPending ? (
                      <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <ArrowDownToLine className="mr-2 h-4 w-4" />
                    )}
                    Deposit
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex-1">
              <ArrowUpFromLine className="mr-2 h-4 w-4" />
              Withdraw
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Withdraw {wallet.currency}</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <div className="grid gap-4">
                <div>
                  <Label>Recipient Address</Label>
                  <Input
                    type="text"
                    placeholder={`Enter ${wallet.currency} address`}
                    className="mt-1"
                    value={withdrawAddress}
                    onChange={(e) => setWithdrawAddress(e.target.value)}
                  />
                </div>
                
                <div>
                  <div className="flex justify-between">
                    <Label>Amount</Label>
                    <span className="text-xs text-muted-foreground">
                      Available: {formatNumber(wallet.balance, wallet.currency === "USDT" ? 2 : 6)}
                    </span>
                  </div>
                  <Input
                    type="number"
                    placeholder="0.00"
                    className="mt-1"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    min="0"
                    max={wallet.balance}
                    step="0.000001"
                  />
                  <div className="flex justify-between text-xs mt-1">
                    <span>Fee: 0.1%</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-5 p-0 text-primary"
                      onClick={() => setWithdrawAmount(wallet.balance)}
                    >
                      MAX
                    </Button>
                  </div>
                </div>
                
                <Button 
                  onClick={handleWithdraw} 
                  disabled={
                    withdrawMutation.isPending || 
                    !withdrawAmount || 
                    !withdrawAddress || 
                    parseFloat(withdrawAmount) > parseFloat(wallet.balance)
                  }
                >
                  {withdrawMutation.isPending ? (
                    <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <ArrowUpFromLine className="mr-2 h-4 w-4" />
                  )}
                  Withdraw {wallet.currency}
                </Button>
                
                <p className="text-xs text-muted-foreground">
                  Please double-check the address before confirming the withdrawal.
                  Transactions cannot be reversed once processed.
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardFooter>
      
      {/* Transaction History */}
      <div className="border-t">
        <Tabs defaultValue="all" className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium">Transaction History</h3>
            <TabsList className="h-7">
              <TabsTrigger value="all" className="text-xs px-2">All</TabsTrigger>
              <TabsTrigger value="deposit" className="text-xs px-2">Deposits</TabsTrigger>
              <TabsTrigger value="withdraw" className="text-xs px-2">Withdrawals</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="all" className="mt-0">
            {walletTransactions.length > 0 ? (
              <div className="space-y-2 max-h-40 overflow-y-auto scrollbar-thin">
                {walletTransactions.map((tx) => (
                  <div key={tx.id} className="flex justify-between text-sm p-2 border rounded">
                    <div>
                      <div className="flex items-center">
                        <i className={`fa-solid ${tx.type === 'deposit' ? 'fa-arrow-down text-success' : 'fa-arrow-up text-destructive'} mr-2`}></i>
                        <span className="capitalize">{tx.type}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(tx.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-medium ${tx.type === 'deposit' ? 'text-success' : 'text-destructive'}`}>
                        {tx.type === 'deposit' ? '+' : '-'}{formatNumber(tx.amount, wallet.currency === "USDT" ? 2 : 6)}
                      </div>
                      {tx.type === 'withdrawal' && (
                        <div className="text-xs text-muted-foreground">
                          Fee: {formatNumber(tx.fee, wallet.currency === "USDT" ? 2 : 6)}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground text-sm">
                No transactions yet
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="deposit" className="mt-0">
            {walletTransactions.filter(tx => tx.type === 'deposit').length > 0 ? (
              <div className="space-y-2 max-h-40 overflow-y-auto scrollbar-thin">
                {walletTransactions.filter(tx => tx.type === 'deposit').map((tx) => (
                  <div key={tx.id} className="flex justify-between text-sm p-2 border rounded">
                    <div>
                      <div className="flex items-center">
                        <i className="fa-solid fa-arrow-down text-success mr-2"></i>
                        <span>Deposit</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(tx.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-success">
                        +{formatNumber(tx.amount, wallet.currency === "USDT" ? 2 : 6)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground text-sm">
                No deposits yet
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="withdraw" className="mt-0">
            {walletTransactions.filter(tx => tx.type === 'withdrawal').length > 0 ? (
              <div className="space-y-2 max-h-40 overflow-y-auto scrollbar-thin">
                {walletTransactions.filter(tx => tx.type === 'withdrawal').map((tx) => (
                  <div key={tx.id} className="flex justify-between text-sm p-2 border rounded">
                    <div>
                      <div className="flex items-center">
                        <i className="fa-solid fa-arrow-up text-destructive mr-2"></i>
                        <span>Withdrawal</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(tx.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-destructive">
                        -{formatNumber(tx.amount, wallet.currency === "USDT" ? 2 : 6)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Fee: {formatNumber(tx.fee, wallet.currency === "USDT" ? 2 : 6)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground text-sm">
                No withdrawals yet
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
}
