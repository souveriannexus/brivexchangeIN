import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  Search,
  Filter,
  CreditCard,
  Wallet,
  Clock,
  Shield,
  ThumbsUp,
  AlertTriangle,
  ChevronDown,
  RefreshCw,
  Plus,
} from "lucide-react";

// Sample merchant data
const merchants = [
  {
    id: 1,
    name: "CryptoTrader89",
    avatarSrc: "",
    completedTrades: 1482,
    completionRate: 99.2,
    verified: true,
  },
  {
    id: 2,
    name: "BitcoinMaster",
    avatarSrc: "",
    completedTrades: 872,
    completionRate: 98.7,
    verified: true,
  },
  {
    id: 3,
    name: "BlockchainPro",
    avatarSrc: "",
    completedTrades: 635,
    completionRate: 97.5,
    verified: true,
  },
  {
    id: 4,
    name: "CryptoWizard",
    avatarSrc: "",
    completedTrades: 324,
    completionRate: 99.8,
    verified: true,
  },
  {
    id: 5,
    name: "SatoshiFan",
    avatarSrc: "",
    completedTrades: 156,
    completionRate: 96.5,
    verified: false,
  },
];

// Sample buy offers
const buyOffers = [
  {
    id: 1,
    merchant: merchants[0],
    asset: "BTC",
    price: 64215.75,
    currency: "USD",
    paymentMethods: ["Bank Transfer", "Credit Card"],
    availableAmount: 1.25,
    minAmount: 0.01,
    maxAmount: 0.5,
    timeLimit: 15,
  },
  {
    id: 2,
    merchant: merchants[1],
    asset: "BTC",
    price: 64180.50,
    currency: "USD",
    paymentMethods: ["Bank Transfer", "PayPal"],
    availableAmount: 0.85,
    minAmount: 0.005,
    maxAmount: 0.25,
    timeLimit: 30,
  },
  {
    id: 3,
    merchant: merchants[2],
    asset: "ETH",
    price: 3155.25,
    currency: "USD",
    paymentMethods: ["Wise", "Revolut"],
    availableAmount: 15.75,
    minAmount: 0.1,
    maxAmount: 5,
    timeLimit: 20,
  },
  {
    id: 4,
    merchant: merchants[3],
    asset: "USDT",
    price: 0.998,
    currency: "USD",
    paymentMethods: ["Zelle", "Cash App"],
    availableAmount: 5000,
    minAmount: 100,
    maxAmount: 2000,
    timeLimit: 15,
  },
  {
    id: 5,
    merchant: merchants[4],
    asset: "BTC",
    price: 64250.25,
    currency: "USD",
    paymentMethods: ["Bank Transfer"],
    availableAmount: 0.35,
    minAmount: 0.01,
    maxAmount: 0.1,
    timeLimit: 25,
  },
];

// Sample sell offers
const sellOffers = [
  {
    id: 101,
    merchant: merchants[0],
    asset: "BTC",
    price: 63985.50,
    currency: "USD",
    paymentMethods: ["Bank Transfer", "Cash App"],
    availableAmount: 0.75,
    minAmount: 0.01,
    maxAmount: 0.3,
    timeLimit: 15,
  },
  {
    id: 102,
    merchant: merchants[2],
    asset: "BTC",
    price: 63950.25,
    currency: "USD",
    paymentMethods: ["Bank Transfer", "Wise"],
    availableAmount: 0.42,
    minAmount: 0.005,
    maxAmount: 0.2,
    timeLimit: 30,
  },
  {
    id: 103,
    merchant: merchants[3],
    asset: "ETH",
    price: 3140.75,
    currency: "USD",
    paymentMethods: ["Zelle", "PayPal"],
    availableAmount: 12.5,
    minAmount: 0.1,
    maxAmount: 4,
    timeLimit: 20,
  },
  {
    id: 104,
    merchant: merchants[1],
    asset: "USDT",
    price: 1.002,
    currency: "USD",
    paymentMethods: ["Bank Transfer", "Credit Card"],
    availableAmount: 8000,
    minAmount: 100,
    maxAmount: 3000,
    timeLimit: 15,
  },
  {
    id: 105,
    merchant: merchants[4],
    asset: "BTC",
    price: 63900.75,
    currency: "USD",
    paymentMethods: ["Bank Transfer"],
    availableAmount: 0.22,
    minAmount: 0.01,
    maxAmount: 0.1,
    timeLimit: 25,
  },
];

// Sample trade history
const tradeHistory = [
  {
    id: 201,
    type: "Buy",
    asset: "BTC",
    amount: 0.15,
    price: 63850.25,
    totalValue: 9577.54,
    currency: "USD",
    merchant: "CryptoTrader89",
    status: "Completed",
    date: "2023-04-26 15:42:33",
  },
  {
    id: 202,
    type: "Sell",
    asset: "ETH",
    amount: 2.5,
    price: 3125.75,
    totalValue: 7814.38,
    currency: "USD",
    merchant: "BlockchainPro",
    status: "Completed",
    date: "2023-04-24 11:23:17",
  },
  {
    id: 203,
    type: "Buy",
    asset: "USDT",
    amount: 1000,
    price: 0.999,
    totalValue: 999.00,
    currency: "USD",
    merchant: "BitcoinMaster",
    status: "Completed",
    date: "2023-04-23 09:17:05",
  },
];

export default function P2PPage() {
  const [marketTab, setMarketTab] = useState("buy");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAsset, setSelectedAsset] = useState("all");
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  const filteredOffers = (marketTab === "buy" ? buyOffers : sellOffers).filter((offer) => {
    if (selectedAsset !== "all" && offer.asset !== selectedAsset) return false;
    if (selectedPaymentMethod !== "all" && !offer.paymentMethods.includes(selectedPaymentMethod)) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        offer.merchant.name.toLowerCase().includes(query) ||
        offer.asset.toLowerCase().includes(query) ||
        offer.paymentMethods.some(method => method.toLowerCase().includes(query))
      );
    }
    return true;
  });
  
  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col space-y-6">
        {/* Page header */}
        <div className="flex flex-col space-y-2">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">P2P Trading</h1>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Create Offer
            </Button>
          </div>
          <p className="text-muted-foreground">
            Buy and sell crypto directly with other users using your preferred payment methods.
          </p>
        </div>
        
        {/* Main content */}
        <Tabs defaultValue="market" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="market">P2P Market</TabsTrigger>
            <TabsTrigger value="myOrders">My Orders</TabsTrigger>
            <TabsTrigger value="history">Trade History</TabsTrigger>
          </TabsList>
          
          {/* P2P Market Tab */}
          <TabsContent value="market" className="space-y-4">
            <Card>
              <CardHeader className="pb-0">
                <Tabs value={marketTab} onValueChange={setMarketTab} className="w-full">
                  <TabsList className="grid w-full max-w-xs grid-cols-2">
                    <TabsTrigger value="buy">Buy</TabsTrigger>
                    <TabsTrigger value="sell">Sell</TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>
              
              <CardContent>
                {/* Filters */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 py-4">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search offers..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Select value={selectedAsset} onValueChange={setSelectedAsset}>
                      <SelectTrigger>
                        <SelectValue placeholder="Asset" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Assets</SelectItem>
                        <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
                        <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                        <SelectItem value="USDT">Tether (USDT)</SelectItem>
                        <SelectItem value="XRP">Ripple (XRP)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                      <SelectTrigger>
                        <SelectValue placeholder="Currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="GBP">GBP</SelectItem>
                        <SelectItem value="CAD">CAD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Select value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
                      <SelectTrigger>
                        <SelectValue placeholder="Payment Method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Payment Methods</SelectItem>
                        <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                        <SelectItem value="Credit Card">Credit Card</SelectItem>
                        <SelectItem value="PayPal">PayPal</SelectItem>
                        <SelectItem value="Wise">Wise</SelectItem>
                        <SelectItem value="Revolut">Revolut</SelectItem>
                        <SelectItem value="Cash App">Cash App</SelectItem>
                        <SelectItem value="Zelle">Zelle</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button variant="outline" size="icon" className="ml-2">
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="ml-2">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Offers table */}
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Merchant</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Limit/Available</TableHead>
                        <TableHead>Payment Methods</TableHead>
                        <TableHead>Trade</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredOffers.length > 0 ? (
                        filteredOffers.map((offer) => (
                          <TableRow key={offer.id}>
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <Avatar>
                                  <AvatarFallback>{offer.merchant.name.substring(0, 2)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium flex items-center">
                                    {offer.merchant.name}
                                    {offer.merchant.verified && (
                                      <Shield className="h-4 w-4 text-blue-500 ml-1" />
                                    )}
                                  </div>
                                  <div className="text-xs text-muted-foreground flex items-center">
                                    <ThumbsUp className="h-3 w-3 mr-1" />
                                    {offer.merchant.completionRate}% | {offer.merchant.completedTrades} trades
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            
                            <TableCell>
                              <div className="font-medium">{offer.price.toLocaleString()} {offer.currency}</div>
                              <div className="text-xs text-muted-foreground">per {offer.asset}</div>
                            </TableCell>
                            
                            <TableCell>
                              <div className="space-y-1">
                                <div className="text-xs text-muted-foreground">
                                  Limit: {offer.minAmount} - {offer.maxAmount} {offer.asset}
                                </div>
                                <div className="text-xs">
                                  Available: {offer.availableAmount} {offer.asset}
                                </div>
                              </div>
                            </TableCell>
                            
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {offer.paymentMethods.map((method, i) => (
                                  <Badge key={i} variant="outline" className="text-xs">
                                    {method}
                                  </Badge>
                                ))}
                              </div>
                            </TableCell>
                            
                            <TableCell>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button size="sm">
                                    {marketTab === "buy" ? "Buy" : "Sell"}
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>
                                      {marketTab === "buy" ? `Buy ${offer.asset}` : `Sell ${offer.asset}`}
                                    </DialogTitle>
                                    <DialogDescription>
                                      Trading with {offer.merchant.name} at {offer.price.toLocaleString()} {offer.currency}
                                    </DialogDescription>
                                  </DialogHeader>
                                  
                                  <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium">Amount ({offer.asset})</label>
                                      <Input 
                                        type="number" 
                                        placeholder={`${offer.minAmount} - ${offer.maxAmount}`} 
                                        min={offer.minAmount}
                                        max={offer.maxAmount}
                                        step="0.00001"
                                      />
                                      <div className="text-xs text-muted-foreground">
                                        Min: {offer.minAmount} {offer.asset} | Max: {offer.maxAmount} {offer.asset}
                                      </div>
                                    </div>
                                    
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium">Payment Method</label>
                                      <Select defaultValue={offer.paymentMethods[0]}>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select payment method" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {offer.paymentMethods.map((method, i) => (
                                            <SelectItem key={i} value={method}>
                                              {method}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    
                                    <div className="rounded-md border p-3 bg-muted/30">
                                      <div className="flex justify-between mb-2">
                                        <span className="text-muted-foreground">Price:</span>
                                        <span>{offer.price.toLocaleString()} {offer.currency}</span>
                                      </div>
                                      <div className="flex justify-between mb-2">
                                        <span className="text-muted-foreground">Amount:</span>
                                        <span>0.1 {offer.asset}</span>
                                      </div>
                                      <Separator className="my-2" />
                                      <div className="flex justify-between font-medium">
                                        <span>Total:</span>
                                        <span>{(0.1 * offer.price).toLocaleString()} {offer.currency}</span>
                                      </div>
                                    </div>
                                    
                                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                      <Clock className="h-4 w-4" />
                                      <span>Payment must be completed within {offer.timeLimit} minutes</span>
                                    </div>
                                  </div>
                                  
                                  <DialogFooter>
                                    <Button variant="outline">Cancel</Button>
                                    <Button>{marketTab === "buy" ? "Buy" : "Sell"} {offer.asset}</Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                            No offers found matching your criteria.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* My Orders Tab */}
          <TabsContent value="myOrders" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>My Active P2P Orders</CardTitle>
                <CardDescription>
                  View and manage your active buy and sell orders.
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="text-center py-10 text-muted-foreground">
                  You don't have any active P2P orders.
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Trade History Tab */}
          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>P2P Trade History</CardTitle>
                <CardDescription>
                  Your completed P2P transactions.
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {tradeHistory.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Asset/Amount</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Merchant</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tradeHistory.map((trade) => (
                        <TableRow key={trade.id}>
                          <TableCell className={trade.type === "Buy" ? "text-green-500" : "text-red-500"}>
                            {trade.type}
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{trade.amount} {trade.asset}</div>
                            <div className="text-xs text-muted-foreground">
                              {trade.totalValue.toLocaleString()} {trade.currency}
                            </div>
                          </TableCell>
                          <TableCell>
                            {trade.price.toLocaleString()} {trade.currency}
                          </TableCell>
                          <TableCell>{trade.merchant}</TableCell>
                          <TableCell>{trade.date}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                              {trade.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-10 text-muted-foreground">
                    You don't have any P2P trade history.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Secure Escrow System</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                All P2P trades are protected by our escrow system. Funds are only released when both parties confirm the transaction is complete.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Multiple Payment Methods</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Choose from a variety of payment methods including bank transfers, credit/debit cards, and popular payment apps.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Dispute Resolution</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Our 24/7 support team is available to help resolve any disputes that may arise during the trading process.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Create Offer Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New P2P Offer</DialogTitle>
            <DialogDescription>
              Set up your buy or sell offer to trade with other users.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <Tabs defaultValue="createSell" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="createBuy">Buy Offer</TabsTrigger>
                <TabsTrigger value="createSell">Sell Offer</TabsTrigger>
              </TabsList>
              
              <TabsContent value="createBuy" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">I want to buy</label>
                  <Select defaultValue="BTC">
                    <SelectTrigger>
                      <SelectValue placeholder="Select asset" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
                      <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                      <SelectItem value="USDT">Tether (USDT)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">I will pay with</label>
                  <Select defaultValue="USD">
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Price per BTC</label>
                  <Input type="number" placeholder="64,000.00" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Min Amount</label>
                    <Input type="number" placeholder="0.01" />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Max Amount</label>
                    <Input type="number" placeholder="0.5" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Payment Methods (select multiple)</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment methods" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bank">Bank Transfer</SelectItem>
                      <SelectItem value="card">Credit Card</SelectItem>
                      <SelectItem value="paypal">PayPal</SelectItem>
                      <SelectItem value="wise">Wise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Payment Time Limit (minutes)</label>
                  <Input type="number" defaultValue="15" />
                </div>
              </TabsContent>
              
              <TabsContent value="createSell" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">I want to sell</label>
                  <Select defaultValue="BTC">
                    <SelectTrigger>
                      <SelectValue placeholder="Select asset" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
                      <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                      <SelectItem value="USDT">Tether (USDT)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">I will receive</label>
                  <Select defaultValue="USD">
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Price per BTC</label>
                  <Input type="number" placeholder="63,900.00" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Min Amount</label>
                    <Input type="number" placeholder="0.01" />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Max Amount</label>
                    <Input type="number" placeholder="0.5" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Payment Methods (select multiple)</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment methods" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bank">Bank Transfer</SelectItem>
                      <SelectItem value="card">Credit Card</SelectItem>
                      <SelectItem value="paypal">PayPal</SelectItem>
                      <SelectItem value="wise">Wise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Payment Time Limit (minutes)</label>
                  <Input type="number" defaultValue="15" />
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => setIsCreateDialogOpen(false)}>Create Offer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}