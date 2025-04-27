import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/layout/header";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, AreaChart, Area, BarChart, Bar 
} from "recharts";
import { ArrowUpIcon, ArrowDownIcon, RefreshCw, Clock, BarChart4 } from "lucide-react";

// Sample data for the futures chart
const futuresData = [
  {
    timestamp: "00:00",
    price: 63200,
    volume: 125000,
  },
  {
    timestamp: "04:00",
    price: 63400,
    volume: 105000,
  },
  {
    timestamp: "08:00",
    price: 62900,
    volume: 165000,
  },
  {
    timestamp: "12:00",
    price: 64100,
    volume: 195000,
  },
  {
    timestamp: "16:00",
    price: 64300,
    volume: 148000,
  },
  {
    timestamp: "20:00",
    price: 63800,
    volume: 132000,
  },
  {
    timestamp: "24:00",
    price: 63900,
    volume: 118000,
  },
];

// Sample order book data
const askOrders = [
  { price: 64050.50, amount: 2.56, total: 163969.28 },
  { price: 64048.20, amount: 1.78, total: 114005.80 },
  { price: 64045.70, amount: 3.25, total: 208148.53 },
  { price: 64042.30, amount: 0.95, total: 60840.19 },
  { price: 64039.10, amount: 1.45, total: 92856.70 },
];

const bidOrders = [
  { price: 64035.80, amount: 1.89, total: 121027.66 },
  { price: 64032.40, amount: 2.34, total: 149835.82 },
  { price: 64028.90, amount: 1.56, total: 99885.08 },
  { price: 64025.20, amount: 3.45, total: 220886.94 },
  { price: 64020.70, amount: 1.23, total: 78745.46 },
];

// Sample futures positions
const positions = [
  { id: 1, pair: "BTC-USDT", side: "Long", size: "0.5 BTC", leverage: "10x", entryPrice: "63450.75", markPrice: "64050.25", pnl: "2.99%" },
  { id: 2, pair: "ETH-USDT", side: "Short", size: "5 ETH", leverage: "5x", entryPrice: "3145.50", markPrice: "3120.75", pnl: "0.79%" },
];

// Sample recent trades
const recentTrades = [
  { id: 1, time: "12:42:15", pair: "BTC-USDT", price: "64042.50", amount: "0.25", side: "buy" },
  { id: 2, time: "12:42:08", pair: "BTC-USDT", price: "64040.75", amount: "0.14", side: "sell" },
  { id: 3, time: "12:41:55", pair: "BTC-USDT", price: "64043.25", amount: "0.32", side: "buy" },
  { id: 4, time: "12:41:47", pair: "BTC-USDT", price: "64038.50", amount: "0.18", side: "sell" },
  { id: 5, time: "12:41:32", pair: "BTC-USDT", price: "64035.75", amount: "0.45", side: "buy" },
];

export default function FuturesPage() {
  const [orderType, setOrderType] = useState("limit");
  const [leverage, setLeverage] = useState(10);
  const [tradingPair, setTradingPair] = useState("BTC-USDT");
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="container mx-auto p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Left section - Chart and order book */}
          <div className="w-full lg:w-8/12 space-y-4">
            {/* Trading pair selector and chart options */}
            <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
              <div className="flex items-center gap-2">
                <Select value={tradingPair} onValueChange={setTradingPair}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select pair" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BTC-USDT">BTC/USDT</SelectItem>
                    <SelectItem value="ETH-USDT">ETH/USDT</SelectItem>
                    <SelectItem value="SOL-USDT">SOL/USDT</SelectItem>
                    <SelectItem value="XRP-USDT">XRP/USDT</SelectItem>
                  </SelectContent>
                </Select>
                
                <div className="text-2xl font-bold">
                  64,042.50
                  <span className="text-green-500 ml-2 text-sm">
                    +2.34%
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Select defaultValue="15m">
                  <SelectTrigger className="w-[80px]">
                    <SelectValue placeholder="Interval" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5m">5m</SelectItem>
                    <SelectItem value="15m">15m</SelectItem>
                    <SelectItem value="1h">1h</SelectItem>
                    <SelectItem value="4h">4h</SelectItem>
                    <SelectItem value="1d">1d</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button variant="outline" size="icon">
                  <BarChart4 className="h-4 w-4" />
                </Button>
                
                <Button variant="outline" size="icon">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Chart */}
            <Card>
              <CardContent className="p-4">
                <div className="w-full h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={futuresData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="timestamp" />
                      <YAxis domain={['auto', 'auto']} />
                      <CartesianGrid strokeDasharray="3 3" />
                      <Tooltip 
                        formatter={(value: any) => [`$${value}`, 'Price']}
                        labelFormatter={(label) => `Time: ${label}`}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="price" 
                        stroke="#8884d8" 
                        fillOpacity={1} 
                        fill="url(#colorPrice)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Order book and recent trades */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-base font-medium">Order Book</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {/* Asks (Sell orders) */}
                  <div className="px-4">
                    <div className="grid grid-cols-3 text-sm text-muted-foreground py-1">
                      <div>Price (USDT)</div>
                      <div className="text-right">Amount (BTC)</div>
                      <div className="text-right">Total (USDT)</div>
                    </div>
                    
                    {askOrders.map((order, i) => (
                      <div key={i} className="grid grid-cols-3 text-sm py-1 hover:bg-muted/50">
                        <div className="text-red-500">{order.price.toFixed(2)}</div>
                        <div className="text-right">{order.amount.toFixed(4)}</div>
                        <div className="text-right">{order.total.toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Current price indicator */}
                  <div className="border-y border-border py-2 px-4 bg-muted/30">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">64,040.25</span>
                      <span className="text-xs text-muted-foreground">
                        <Clock className="inline-block h-3 w-3 mr-1" />
                        Last updated: 12:43:15
                      </span>
                    </div>
                  </div>
                  
                  {/* Bids (Buy orders) */}
                  <div className="px-4 pb-4">
                    {bidOrders.map((order, i) => (
                      <div key={i} className="grid grid-cols-3 text-sm py-1 hover:bg-muted/50">
                        <div className="text-green-500">{order.price.toFixed(2)}</div>
                        <div className="text-right">{order.amount.toFixed(4)}</div>
                        <div className="text-right">{order.total.toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-base font-medium">Recent Trades</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="px-4">
                    <div className="grid grid-cols-4 text-sm text-muted-foreground py-1">
                      <div>Time</div>
                      <div>Price</div>
                      <div className="text-right">Amount</div>
                      <div className="text-right">Side</div>
                    </div>
                    
                    {recentTrades.map((trade) => (
                      <div key={trade.id} className="grid grid-cols-4 text-sm py-1 hover:bg-muted/50">
                        <div>{trade.time}</div>
                        <div className={trade.side === "buy" ? "text-green-500" : "text-red-500"}>
                          {trade.price}
                        </div>
                        <div className="text-right">{trade.amount}</div>
                        <div className="text-right">
                          <Badge 
                            variant={trade.side === "buy" ? "default" : "destructive"}
                            className="text-[10px] px-1 py-0"
                          >
                            {trade.side === "buy" ? "BUY" : "SELL"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Right section - Trading form and positions */}
          <div className="w-full lg:w-4/12 space-y-4">
            {/* Trading form */}
            <Card>
              <CardHeader className="pb-2">
                <Tabs defaultValue="long" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="long" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
                      Long
                    </TabsTrigger>
                    <TabsTrigger value="short" className="data-[state=active]:bg-red-500 data-[state=active]:text-white">
                      Short
                    </TabsTrigger>
                  </TabsList>
                  
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">Leverage: {leverage}x</span>
                      <span className="text-sm text-muted-foreground">Max 125x</span>
                    </div>
                    <Slider
                      value={[leverage]}
                      min={1}
                      max={125}
                      step={1}
                      onValueChange={(value) => setLeverage(value[0])}
                      className="mb-4"
                    />
                    
                    <div className="flex space-x-2 mb-2">
                      {[5, 10, 25, 50, 100].map((value) => (
                        <Button 
                          key={value}
                          variant={leverage === value ? "default" : "outline"}
                          size="sm"
                          onClick={() => setLeverage(value)}
                          className="flex-1 h-7 text-xs"
                        >
                          {value}x
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <TabsContent value="long" className="space-y-4 mt-4">
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-2">
                        <Button 
                          variant={orderType === "market" ? "default" : "outline"} 
                          onClick={() => setOrderType("market")}
                          className="h-8"
                        >
                          Market
                        </Button>
                        <Button 
                          variant={orderType === "limit" ? "default" : "outline"} 
                          onClick={() => setOrderType("limit")}
                          className="h-8"
                        >
                          Limit
                        </Button>
                        <Button 
                          variant={orderType === "stop" ? "default" : "outline"} 
                          onClick={() => setOrderType("stop")}
                          className="h-8"
                        >
                          Stop
                        </Button>
                      </div>
                      
                      <div className="space-y-2">
                        {orderType !== "market" && (
                          <div>
                            <div className="text-sm mb-1">Price</div>
                            <Input type="number" placeholder="64,040.25" />
                          </div>
                        )}
                        
                        <div>
                          <div className="text-sm mb-1">Amount (BTC)</div>
                          <Input type="number" placeholder="0.01" />
                        </div>
                        
                        {orderType === "stop" && (
                          <div>
                            <div className="text-sm mb-1">Trigger Price</div>
                            <Input type="number" placeholder="64,200.00" />
                          </div>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-4 gap-2 text-xs text-muted-foreground">
                        {["25%", "50%", "75%", "100%"].map((percent) => (
                          <Button 
                            key={percent} 
                            variant="outline" 
                            className="h-7"
                          >
                            {percent}
                          </Button>
                        ))}
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Cost:</span>
                          <span>640.40 USDT</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Margin:</span>
                          <span>64.04 USDT</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Fees:</span>
                          <span>0.64 USDT</span>
                        </div>
                      </div>
                      
                      <Button className="w-full bg-green-500 hover:bg-green-600">
                        Buy / Long
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="short" className="space-y-4 mt-4">
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-2">
                        <Button 
                          variant={orderType === "market" ? "default" : "outline"} 
                          onClick={() => setOrderType("market")}
                          className="h-8"
                        >
                          Market
                        </Button>
                        <Button 
                          variant={orderType === "limit" ? "default" : "outline"} 
                          onClick={() => setOrderType("limit")}
                          className="h-8"
                        >
                          Limit
                        </Button>
                        <Button 
                          variant={orderType === "stop" ? "default" : "outline"} 
                          onClick={() => setOrderType("stop")}
                          className="h-8"
                        >
                          Stop
                        </Button>
                      </div>
                      
                      <div className="space-y-2">
                        {orderType !== "market" && (
                          <div>
                            <div className="text-sm mb-1">Price</div>
                            <Input type="number" placeholder="64,040.25" />
                          </div>
                        )}
                        
                        <div>
                          <div className="text-sm mb-1">Amount (BTC)</div>
                          <Input type="number" placeholder="0.01" />
                        </div>
                        
                        {orderType === "stop" && (
                          <div>
                            <div className="text-sm mb-1">Trigger Price</div>
                            <Input type="number" placeholder="63,800.00" />
                          </div>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-4 gap-2 text-xs text-muted-foreground">
                        {["25%", "50%", "75%", "100%"].map((percent) => (
                          <Button 
                            key={percent} 
                            variant="outline" 
                            className="h-7"
                          >
                            {percent}
                          </Button>
                        ))}
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Cost:</span>
                          <span>640.40 USDT</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Margin:</span>
                          <span>64.04 USDT</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Fees:</span>
                          <span>0.64 USDT</span>
                        </div>
                      </div>
                      
                      <Button className="w-full bg-red-500 hover:bg-red-600">
                        Sell / Short
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardHeader>
            </Card>
            
            {/* Open positions */}
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-base font-medium">Your Positions</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="px-4 pb-4">
                  {positions.map((position) => (
                    <div key={position.id} className="border-b border-border py-4 last:border-0">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center">
                          <span className={`font-semibold ${position.side === "Long" ? "text-green-500" : "text-red-500"}`}>
                            {position.side}
                          </span>
                          <span className="ml-2 text-muted-foreground">{position.pair}</span>
                        </div>
                        <Badge variant={position.side === "Long" ? "default" : "destructive"} className="ml-2">
                          {position.leverage}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <div className="text-muted-foreground mb-1">Size</div>
                          <div>{position.size}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground mb-1">Entry Price</div>
                          <div>{position.entryPrice}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground mb-1">Mark Price</div>
                          <div>{position.markPrice}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground mb-1">PnL</div>
                          <div className={parseFloat(position.pnl) >= 0 ? "text-green-500" : "text-red-500"}>
                            {position.pnl}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2 mt-3">
                        <Button variant="outline" size="sm" className="flex-1 h-7">
                          TP/SL
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1 h-7">
                          Edit
                        </Button>
                        <Button variant="destructive" size="sm" className="flex-1 h-7">
                          Close
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}