import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  ArrowUpRight, 
  Percent, 
  Clock, 
  Lock, 
  Coins, 
  CreditCard, 
  Calculator,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Info,
  Star
} from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

// Sample staking products
const stakingProducts = [
  {
    id: 1,
    asset: "BTC",
    name: "Bitcoin",
    apy: 4.5,
    lockPeriod: 30,
    minAmount: 0.01,
    totalStaked: 155.45,
    totalUsers: 8427,
    icon: "₿",
    description: "Stake your Bitcoin and earn rewards with our flexible staking product. Minimum lock period of 30 days.",
  },
  {
    id: 2,
    asset: "ETH",
    name: "Ethereum",
    apy: 5.2,
    lockPeriod: 60,
    minAmount: 0.1,
    totalStaked: 2541.78,
    totalUsers: 12568,
    icon: "Ξ",
    description: "Stake ETH to earn competitive APY with a 60-day lock period. Contribute to the Ethereum network's security.",
  },
  {
    id: 3,
    asset: "SOL",
    name: "Solana",
    apy: 7.8,
    lockPeriod: 30,
    minAmount: 1,
    totalStaked: 35487.65,
    totalUsers: 4587,
    icon: "◎",
    description: "Earn high returns staking Solana with our validator nodes. Quick, efficient, and secure.",
  },
  {
    id: 4,
    asset: "DOT",
    name: "Polkadot",
    apy: 12.5,
    lockPeriod: 90,
    minAmount: 5,
    totalStaked: 245789.38,
    totalUsers: 3945,
    icon: "●",
    description: "Stake Polkadot to support the network and earn high APY with a 90-day lock period.",
  },
  {
    id: 5,
    asset: "ADA",
    name: "Cardano",
    apy: 5.5,
    lockPeriod: 45,
    minAmount: 100,
    totalStaked: 1258974.65,
    totalUsers: 7854,
    icon: "₳",
    description: "Earn Cardano rewards by delegating your ADA to our staking pool. Flexible 45-day lock period.",
  },
  {
    id: 6,
    asset: "ATOM",
    name: "Cosmos",
    apy: 9.8,
    lockPeriod: 60,
    minAmount: 5,
    totalStaked: 158749.23,
    totalUsers: 2874,
    icon: "⚛",
    description: "Stake Cosmos (ATOM) and support the Internet of Blockchains while earning rewards.",
  },
];

// Sample user staking positions
const userStakingPositions = [
  {
    id: 101,
    asset: "ETH",
    name: "Ethereum",
    stakedAmount: 2.5,
    apy: 5.2,
    startDate: "2023-03-15",
    endDate: "2023-05-14",
    earned: 0.0216,
    status: "Active",
    icon: "Ξ",
  },
  {
    id: 102,
    asset: "SOL",
    name: "Solana",
    stakedAmount: 45.8,
    apy: 7.8,
    startDate: "2023-04-02",
    endDate: "2023-05-02",
    earned: 0.298,
    status: "Active",
    icon: "◎",
  },
  {
    id: 103,
    asset: "BTC",
    name: "Bitcoin",
    stakedAmount: 0.15,
    apy: 4.5,
    startDate: "2023-02-28",
    endDate: "2023-03-30",
    earned: 0.00056,
    status: "Completed",
    icon: "₿",
  },
];

// Sample staking history
const stakingHistory = [
  {
    id: 201,
    type: "Stake",
    asset: "ETH",
    amount: 2.5,
    date: "2023-03-15 10:23:45",
    txId: "0x8f7d42e58231aef35df6a7",
  },
  {
    id: 202,
    type: "Stake",
    asset: "SOL",
    amount: 45.8,
    date: "2023-04-02 15:47:32",
    txId: "5vLH9DQfRB3DQfRB3RVDxhqTa",
  },
  {
    id: 203,
    type: "Stake",
    asset: "BTC",
    amount: 0.15,
    date: "2023-02-28 09:12:18",
    txId: "bc1q9h5mzkk5ay74",
  },
  {
    id: 204,
    type: "Unstake",
    asset: "BTC",
    amount: 0.15,
    date: "2023-03-30 11:05:33",
    txId: "bc1q9j7mzkw5tm74",
  },
  {
    id: 205,
    type: "Reward",
    asset: "ETH",
    amount: 0.0108,
    date: "2023-04-15 00:00:00",
    txId: "0x9f8e42a5b2a7c55df6a7",
  },
  {
    id: 206,
    type: "Reward",
    asset: "SOL",
    amount: 0.149,
    date: "2023-04-17 00:00:00",
    txId: "5vLM9DWdSF3PQdRW4GTaxHtP",
  },
];

export default function StakingPage() {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [stakeDialogOpen, setStakeDialogOpen] = useState(false);
  const [calculatorDialogOpen, setCalculatorDialogOpen] = useState(false);
  const [calculatorValues, setCalculatorValues] = useState({
    asset: stakingProducts[0].asset,
    amount: stakingProducts[0].minAmount,
    duration: stakingProducts[0].lockPeriod
  });
  
  const handleCalculatorChange = (field: string, value: any) => {
    setCalculatorValues(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const calculateRewards = () => {
    const product = stakingProducts.find(p => p.asset === calculatorValues.asset);
    if (!product) return 0;
    
    const dailyRate = product.apy / 365 / 100;
    const totalDays = calculatorValues.duration;
    const principal = calculatorValues.amount;
    
    return principal * dailyRate * totalDays;
  };
  
  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col space-y-6">
        {/* Page header */}
        <div className="flex flex-col space-y-2">
          <h1 className="text-2xl font-bold">Staking</h1>
          <p className="text-muted-foreground">
            Stake your crypto assets and earn passive income with competitive APY rates.
          </p>
        </div>
        
        {/* Overview cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Value Staked</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">$4,528.75</div>
              <div className="text-sm text-muted-foreground flex items-center mt-1">
                <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-green-500 font-medium">+5.7%</span>
                <span className="ml-1">since last month</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Rewards Earned</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">$128.45</div>
              <div className="text-sm text-muted-foreground flex items-center mt-1">
                <Percent className="h-4 w-4 mr-1" />
                <span>Avg. APY: 6.8%</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Active Staking Positions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">2</div>
              <div className="text-sm text-muted-foreground flex items-center mt-1">
                <Clock className="h-4 w-4 mr-1" />
                <span>Across 2 assets</span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Main content */}
        <Tabs defaultValue="products" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="products">Staking Products</TabsTrigger>
            <TabsTrigger value="positions">My Positions</TabsTrigger>
            <TabsTrigger value="history">Staking History</TabsTrigger>
          </TabsList>
          
          {/* Staking Products Tab */}
          <TabsContent value="products" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Available Staking Products</h2>
              <Button variant="outline" size="sm" onClick={() => setCalculatorDialogOpen(true)}>
                <Calculator className="h-4 w-4 mr-2" />
                APY Calculator
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stakingProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden hover:border-primary/50 transition-colors">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <span className="text-xl">{product.icon}</span>
                        </div>
                        <div>
                          <CardTitle>{product.name}</CardTitle>
                          <CardDescription>{product.asset}</CardDescription>
                        </div>
                      </div>
                      <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/10">
                        {product.apy}% APY
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pb-2">
                    <div className="text-sm space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Lock Period:</span>
                        <span>{product.lockPeriod} days</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Min. Stake:</span>
                        <span>{product.minAmount} {product.asset}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Staked:</span>
                        <span>{product.totalStaked.toLocaleString()} {product.asset}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Participants:</span>
                        <span>{product.totalUsers.toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <Collapsible className="mt-3">
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm" className="w-full justify-between">
                          <span>Details</span>
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <p className="text-sm text-muted-foreground py-2">
                          {product.description}
                        </p>
                      </CollapsibleContent>
                    </Collapsible>
                  </CardContent>
                  
                  <CardFooter>
                    <Button 
                      className="w-full" 
                      onClick={() => {
                        setSelectedProduct(product);
                        setStakeDialogOpen(true);
                      }}
                    >
                      Stake {product.asset}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          {/* My Positions Tab */}
          <TabsContent value="positions" className="space-y-4">
            {userStakingPositions.filter(p => p.status === "Active").length > 0 ? (
              <div className="space-y-4">
                {userStakingPositions.filter(p => p.status === "Active").map((position) => (
                  <Card key={position.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <span className="text-2xl">{position.icon}</span>
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold">{position.name}</h3>
                            <div className="text-sm text-muted-foreground">
                              {position.stakedAmount} {position.asset} staked
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-x-6 gap-y-2">
                          <div className="flex flex-col">
                            <span className="text-sm text-muted-foreground">APY</span>
                            <span className="font-medium text-green-500">{position.apy}%</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm text-muted-foreground">Start Date</span>
                            <span className="font-medium">{position.startDate}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm text-muted-foreground">End Date</span>
                            <span className="font-medium">{position.endDate}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm text-muted-foreground">Earned So Far</span>
                            <span className="font-medium">{position.earned} {position.asset}</span>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            Add More
                          </Button>
                          <Button variant="destructive" size="sm">
                            Unstake
                          </Button>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Lock Period Progress</span>
                          <span>50%</span>
                        </div>
                        <Progress value={50} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <div className="flex justify-center mb-4">
                    <Lock className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No Active Staking Positions</h3>
                  <p className="text-muted-foreground mb-4">
                    You don't have any active staking positions. Start staking to earn passive income.
                  </p>
                  <Button onClick={() => {
                    const element = document.querySelector('[data-value="products"]') as HTMLElement;
                    if (element) element.click();
                  }}>
                    View Staking Products
                  </Button>
                </CardContent>
              </Card>
            )}
            
            {userStakingPositions.filter(p => p.status === "Completed").length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">Completed Staking</h3>
                <Card>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Asset</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>APY</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Rewards Earned</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {userStakingPositions
                        .filter(p => p.status === "Completed")
                        .map((position) => (
                          <TableRow key={position.id}>
                            <TableCell className="font-medium">{position.name} ({position.asset})</TableCell>
                            <TableCell>{position.stakedAmount} {position.asset}</TableCell>
                            <TableCell>{position.apy}%</TableCell>
                            <TableCell>
                              {position.startDate} to {position.endDate}
                            </TableCell>
                            <TableCell>{position.earned} {position.asset}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </Card>
              </div>
            )}
          </TabsContent>
          
          {/* Staking History Tab */}
          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>
                  Your staking transactions and reward distribution history.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {stakingHistory.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Asset</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="w-[100px]">Transaction ID</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {stakingHistory.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell>
                            <Badge variant={
                              transaction.type === "Stake" ? "default" :
                              transaction.type === "Unstake" ? "destructive" :
                              "outline"
                            }>
                              {transaction.type}
                            </Badge>
                          </TableCell>
                          <TableCell>{transaction.asset}</TableCell>
                          <TableCell>{transaction.amount} {transaction.asset}</TableCell>
                          <TableCell>{transaction.date}</TableCell>
                          <TableCell className="font-mono text-xs truncate max-w-[100px]">
                            {transaction.txId}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-10 text-muted-foreground">
                    No staking history found.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Information cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center">
                <Coins className="mr-2 h-4 w-4 text-primary" />
                <CardTitle className="text-base">How Staking Works</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Staking is a way to earn rewards by locking up your crypto assets to help support the security and operations of a blockchain network.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center">
                <Lock className="mr-2 h-4 w-4 text-primary" />
                <CardTitle className="text-base">Lock Periods</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Different staking products have different lock periods. Generally, longer lock periods offer higher APY rates.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center">
                <CreditCard className="mr-2 h-4 w-4 text-primary" />
                <CardTitle className="text-base">Reward Distribution</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Staking rewards are distributed on a daily basis and can be viewed in your staking history. Some assets may have different distribution schedules.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Stake Dialog */}
      <Dialog open={stakeDialogOpen} onOpenChange={setStakeDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Stake {selectedProduct?.name}</DialogTitle>
            <DialogDescription>
              Enter the amount you want to stake for {selectedProduct?.lockPeriod} days at {selectedProduct?.apy}% APY.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label htmlFor="stake-amount" className="text-sm font-medium">
                Amount to Stake
              </label>
              <Input
                id="stake-amount"
                type="number"
                placeholder={`Min: ${selectedProduct?.minAmount} ${selectedProduct?.asset}`}
                min={selectedProduct?.minAmount}
                step="0.000001"
              />
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">
                  Min: {selectedProduct?.minAmount} {selectedProduct?.asset}
                </span>
                <Button variant="ghost" size="sm" className="h-auto p-0 text-xs text-primary">
                  Max
                </Button>
              </div>
            </div>
            
            <div className="rounded-md border p-4 bg-muted/30 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Lock Period:</span>
                <span>{selectedProduct?.lockPeriod} days</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">APY Rate:</span>
                <span className="text-green-500">{selectedProduct?.apy}%</span>
              </div>
              <Separator />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Est. Daily Reward:</span>
                <span>0.00123 {selectedProduct?.asset}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Est. Total Reward:</span>
                <span>0.0369 {selectedProduct?.asset}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 rounded-md border p-3 bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
              <AlertCircle className="h-4 w-4" />
              <p className="text-xs">
                Your funds will be locked for {selectedProduct?.lockPeriod} days. Early unstaking may result in loss of rewards.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setStakeDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setStakeDialogOpen(false)}>
              Stake Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* APY Calculator Dialog */}
      <Dialog open={calculatorDialogOpen} onOpenChange={setCalculatorDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Staking Rewards Calculator</DialogTitle>
            <DialogDescription>
              Estimate your potential staking rewards based on amount, duration, and APY.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Asset</label>
              <select 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={calculatorValues.asset}
                onChange={(e) => handleCalculatorChange('asset', e.target.value)}
              >
                {stakingProducts.map((product) => (
                  <option key={product.id} value={product.asset}>
                    {product.name} ({product.asset}) - {product.apy}% APY
                  </option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Stake Amount</label>
              <Input
                type="number"
                value={calculatorValues.amount}
                onChange={(e) => handleCalculatorChange('amount', parseFloat(e.target.value))}
                min={0.000001}
                step="0.000001"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Staking Duration (days)</label>
              <Input
                type="number"
                value={calculatorValues.duration}
                onChange={(e) => handleCalculatorChange('duration', parseInt(e.target.value))}
                min={1}
                max={365}
              />
            </div>
            
            <div className="rounded-md border p-4 bg-muted/30 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Asset:</span>
                <span>{calculatorValues.asset}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">APY Rate:</span>
                <span className="text-green-500">
                  {stakingProducts.find(p => p.asset === calculatorValues.asset)?.apy}%
                </span>
              </div>
              <Separator />
              <div className="flex justify-between text-sm font-medium">
                <span>Estimated Reward:</span>
                <span>{calculateRewards().toFixed(8)} {calculatorValues.asset}</span>
              </div>
              <div className="flex justify-between text-sm font-medium">
                <span>Total Value:</span>
                <span>
                  {(calculatorValues.amount + calculateRewards()).toFixed(8)} {calculatorValues.asset}
                </span>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button onClick={() => setCalculatorDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}