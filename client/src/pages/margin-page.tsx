import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { 
  ArrowUpRight, ArrowDownRight, ArrowLeft, ArrowRight, 
  Info, Percent, DollarSign, BarChart3 
} from "lucide-react";

// Sample data for the price chart
const priceData = [
  { time: "04:00", price: 63150 },
  { time: "08:00", price: 63350 },
  { time: "12:00", price: 63850 },
  { time: "16:00", price: 63550 },
  { time: "20:00", price: 64050 },
  { time: "00:00", price: 64150 },
  { time: "04:00", price: 64350 },
];

// Sample margin positions
const positions = [
  { 
    id: 1, 
    pair: "BTC/USDT", 
    type: "Isolated", 
    side: "Long", 
    amount: "0.12", 
    leverage: "3x", 
    entryPrice: "63,250.50", 
    markPrice: "64,040.75", 
    liquidationPrice: "59,850.25", 
    margin: "2,530.02", 
    pnl: "+2.83%" 
  },
  { 
    id: 2, 
    pair: "ETH/USDT", 
    type: "Cross", 
    side: "Short", 
    amount: "2.5", 
    leverage: "5x", 
    entryPrice: "3,185.25", 
    markPrice: "3,125.50", 
    liquidationPrice: "3,345.80", 
    margin: "1,592.63", 
    pnl: "+1.87%" 
  },
];

// Sample trading pairs
const pairs = [
  { id: 1, name: "BTC/USDT", price: "64,040.75", change24h: "+2.34%" },
  { id: 2, name: "ETH/USDT", price: "3,125.50", change24h: "+1.65%" },
  { id: 3, name: "SOL/USDT", price: "124.85", change24h: "+5.78%" },
  { id: 4, name: "XRP/USDT", price: "0.5648", change24h: "-0.98%" },
  { id: 5, name: "ADA/USDT", price: "0.4532", change24h: "+2.21%" },
  { id: 6, name: "DOT/USDT", price: "7.2450", change24h: "+3.47%" },
];

// Sample order history
const orders = [
  { id: 1, pair: "BTC/USDT", type: "Market", side: "Buy", amount: "0.08", price: "63,850.25", total: "5,108.02", filled: "100%", date: "2023-04-26 14:32:15" },
  { id: 2, pair: "ETH/USDT", type: "Limit", side: "Sell", amount: "1.75", price: "3,190.50", total: "5,583.38", filled: "100%", date: "2023-04-26 11:15:42" },
  { id: 3, pair: "BTC/USDT", type: "Limit", side: "Buy", amount: "0.12", price: "63,250.50", total: "7,590.06", filled: "100%", date: "2023-04-25 22:47:33" },
];

export default function MarginPage() {
  const [orderType, setOrderType] = useState("limit");
  const [leverage, setLeverage] = useState(3);
  const [marginType, setMarginType] = useState("isolated");
  const [activePair, setActivePair] = useState("BTC/USDT");
  
  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col space-y-6">
        {/* Page header */}
        <div className="flex flex-col space-y-2">
          <h1 className="text-2xl font-bold">Margin Trading</h1>
          <p className="text-muted-foreground">
            Trade with up to 10x leverage with isolated or cross margin.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left sidebar - Trading pairs */}
          <Card className="lg:col-span-1">
            <CardHeader className="pb-3">
              <CardTitle>Trading Pairs</CardTitle>
              <div className="relative mt-2">
                <Input placeholder="Search pairs..." className="pl-8" />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="border-b border-border">
                <div className="grid grid-cols-3 px-4 py-2 text-sm text-muted-foreground">
                  <div>Pair</div>
                  <div className="text-right">Price</div>
                  <div className="text-right">24h Change</div>
                </div>
              </div>
              <div className="max-h-[400px] overflow-auto">
                {pairs.map((pair) => (
                  <div 
                    key={pair.id}
                    className={`grid grid-cols-3 px-4 py-3 cursor-pointer hover:bg-muted/40 text-sm transition-colors ${activePair === pair.name ? 'bg-muted/70' : ''}`}
                    onClick={() => setActivePair(pair.name)}
                  >
                    <div className="font-medium">{pair.name}</div>
                    <div className="text-right">{pair.price}</div>
                    <div className={`text-right ${pair.change24h.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                      {pair.change24h}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Middle section - Chart and trading form */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-0">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-2xl">{activePair}</CardTitle>
                  <div className="mt-1 flex items-center">
                    <span className="text-lg mr-2">64,040.75</span>
                    <span className="text-green-500 text-sm flex items-center">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      2.34%
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Select defaultValue="1d">
                    <SelectTrigger className="w-[70px] h-8">
                      <SelectValue placeholder="Interval" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1h">1h</SelectItem>
                      <SelectItem value="4h">4h</SelectItem>
                      <SelectItem value="1d">1d</SelectItem>
                      <SelectItem value="1w">1w</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm">
                    <BarChart3 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Chart */}
              <div className="w-full h-[300px] mt-3">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={priceData}
                    margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                  >
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="time" />
                    <YAxis domain={['auto', 'auto']} />
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="price" 
                      stroke="#22c55e" 
                      fillOpacity={1} 
                      fill="url(#colorPrice)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              
              {/* Trading form */}
              <div className="mt-4 border-t border-border pt-4">
                <Tabs defaultValue="buy">
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="buy" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
                      Buy
                    </TabsTrigger>
                    <TabsTrigger value="sell" className="data-[state=active]:bg-red-500 data-[state=active]:text-white">
                      Sell
                    </TabsTrigger>
                  </TabsList>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-sm mb-1 block">Margin Type</label>
                      <Select value={marginType} onValueChange={setMarginType}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="isolated">Isolated Margin</SelectItem>
                          <SelectItem value="cross">Cross Margin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm mb-1 block">Leverage ({leverage}x)</label>
                      <div className="flex items-center space-x-2">
                        <Slider
                          value={[leverage]}
                          min={1}
                          max={10}
                          step={1}
                          onValueChange={(val) => setLeverage(val[0])}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <Button 
                      variant={orderType === "market" ? "default" : "outline"} 
                      onClick={() => setOrderType("market")}
                      size="sm"
                    >
                      Market
                    </Button>
                    <Button 
                      variant={orderType === "limit" ? "default" : "outline"} 
                      onClick={() => setOrderType("limit")}
                      size="sm"
                    >
                      Limit
                    </Button>
                    <Button 
                      variant={orderType === "stop" ? "default" : "outline"} 
                      onClick={() => setOrderType("stop")}
                      size="sm"
                    >
                      Stop-Limit
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    {orderType !== "market" && (
                      <div>
                        <label className="text-sm mb-1 block">Price</label>
                        <Input placeholder="64,040.75" />
                      </div>
                    )}
                    
                    <div>
                      <label className="text-sm mb-1 block">Amount</label>
                      <Input placeholder="0.01 BTC" />
                    </div>
                    
                    {orderType === "stop" && (
                      <div>
                        <label className="text-sm mb-1 block">Trigger Price</label>
                        <Input placeholder="64,200.00" />
                      </div>
                    )}
                    
                    <div className="grid grid-cols-4 gap-2">
                      {["25%", "50%", "75%", "100%"].map((percent) => (
                        <Button key={percent} variant="outline" size="sm">
                          {percent}
                        </Button>
                      ))}
                    </div>
                    
                    <TabsContent value="buy" className="space-y-4 mt-4 p-0">
                      <div className="text-sm space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total Cost:</span>
                          <span>~640.41 USDT</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Required Margin:</span>
                          <span>~213.47 USDT</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Fees:</span>
                          <span>~0.64 USDT</span>
                        </div>
                      </div>
                      
                      <Button className="w-full bg-green-500 hover:bg-green-600">
                        Buy {activePair.split('/')[0]}
                      </Button>
                    </TabsContent>
                    
                    <TabsContent value="sell" className="space-y-4 mt-4 p-0">
                      <div className="text-sm space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total Value:</span>
                          <span>~640.41 USDT</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Required Margin:</span>
                          <span>~213.47 USDT</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Fees:</span>
                          <span>~0.64 USDT</span>
                        </div>
                      </div>
                      
                      <Button className="w-full bg-red-500 hover:bg-red-600">
                        Sell {activePair.split('/')[0]}
                      </Button>
                    </TabsContent>
                  </div>
                </Tabs>
              </div>
            </CardContent>
          </Card>
          
          {/* Right sidebar - Positions & Orders */}
          <Card className="lg:col-span-1">
            <Tabs defaultValue="positions">
              <CardHeader className="pb-0">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="positions">Positions</TabsTrigger>
                  <TabsTrigger value="orders">Orders</TabsTrigger>
                </TabsList>
              </CardHeader>
              <CardContent className="p-3">
                <TabsContent value="positions" className="p-0 mt-2">
                  {positions.length > 0 ? (
                    <div className="space-y-3">
                      {positions.map((position) => (
                        <div key={position.id} className="border border-border rounded-md p-3 hover:bg-muted/30 transition-colors">
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center">
                              <Badge variant={position.side === "Long" ? "default" : "destructive"} className="mr-2">
                                {position.side}
                              </Badge>
                              <span className="font-medium">{position.pair}</span>
                            </div>
                            <Badge variant="outline">{position.type}</Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-1 text-xs">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Size:</span>
                              <span>{position.amount}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Leverage:</span>
                              <span>{position.leverage}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Entry:</span>
                              <span>{position.entryPrice}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Mark:</span>
                              <span>{position.markPrice}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Liq. Price:</span>
                              <span>{position.liquidationPrice}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">PnL:</span>
                              <span className={position.pnl.startsWith('+') ? 'text-green-500' : 'text-red-500'}>
                                {position.pnl}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex gap-2 mt-3">
                            <Button variant="outline" size="sm" className="flex-1 h-7 text-xs">
                              Add Margin
                            </Button>
                            <Button variant="destructive" size="sm" className="flex-1 h-7 text-xs">
                              Close
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 text-muted-foreground">
                      No open positions
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="orders" className="p-0 mt-2">
                  {orders.length > 0 ? (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Pair</TableHead>
                            <TableHead>Side</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {orders.map((order) => (
                            <TableRow key={order.id}>
                              <TableCell className="py-2">{order.pair}</TableCell>
                              <TableCell className={`py-2 ${order.side === 'Buy' ? 'text-green-500' : 'text-red-500'}`}>
                                {order.side}
                              </TableCell>
                              <TableCell className="py-2">{order.price}</TableCell>
                              <TableCell className="text-right py-2">{order.amount}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-10 text-muted-foreground">
                      No order history
                    </div>
                  )}
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>
        </div>
        
        {/* Trading information section */}
        <Card>
          <CardHeader className="py-4">
            <CardTitle>Margin Trading Information</CardTitle>
            <CardDescription>
              Important information about margin trading with Briv Exchange.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Liquidation Risk</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Margin trading involves risk of liquidation. If your position's losses approach your margin amount, the position may be liquidated.
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Percent className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Margin Requirements</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Different assets require different minimum margin requirements. Higher leverage requires more margin to be maintained.
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Isolated vs Cross Margin</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Isolated margin limits your risk to the amount allocated to a specific position. Cross margin shares your entire margin balance across all positions.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}