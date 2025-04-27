import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Header } from "@/components/layout/header";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { APP_TAGLINE } from "@/lib/constants";
import { MarketPrice } from "@/lib/types";
import { TradingPair } from "@shared/schema";
import { ArrowUpRight, ChevronRight, Shield, Percent, Zap, Globe, LineChart } from "lucide-react";

export default function HomePage() {
  const { user } = useAuth();
  const [marketData, setMarketData] = useState<MarketPrice[]>([]);

  // Fetch trading pairs and market data
  const { data: tradingPairs } = useQuery<TradingPair[]>({
    queryKey: ['/api/trading-pairs'],
  });

  // Stats removed as requested

  // Process trading pairs data to display market prices
  useEffect(() => {
    if (tradingPairs && tradingPairs.length > 0) {
      const topPairs = tradingPairs.slice(0, 5);
      const mockMarketData: MarketPrice[] = topPairs.map(pair => ({
        symbol: `${pair.baseCurrency}/${pair.quoteCurrency}`,
        lastPrice: `${(Math.random() * 50000).toFixed(2)}`,
        change24h: `${(Math.random() * 10 - 5).toFixed(2)}`,
        high24h: `${(Math.random() * 60000).toFixed(2)}`,
        low24h: `${(Math.random() * 40000).toFixed(2)}`,
        volume24h: `${(Math.random() * 1000000000).toFixed(2)}`,
        baseCurrency: pair.baseCurrency,
        quoteCurrency: pair.quoteCurrency,
        updatedAt: new Date(),
      }));
      setMarketData(mockMarketData);
    }
  }, [tradingPairs]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 relative">
        <div className="container px-4 md:px-6 mx-auto flex flex-col items-center text-center space-y-8">
          <div className="flex flex-col items-center">
            <Logo size="3xl" />
            <p className="text-2xl mt-6 text-muted-foreground">
              {APP_TAGLINE}
            </p>
          </div>
          <div className="space-x-4">
            <Link href="/auth">
              <Button size="lg" className="bg-primary hover:bg-primary/90">Get Started</Button>
            </Link>
            <Link href="/markets">
              <Button size="lg" variant="outline">
                Explore Markets <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      
      {/* Market Overview */}
      <section className="w-full py-12">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Top Markets</h2>
            <Link href="/markets">
              <Button variant="ghost" className="gap-1">
                View All Markets <ArrowUpRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-2">Market</th>
                  <th className="text-right py-3 px-2">Price</th>
                  <th className="text-right py-3 px-2">24h Change</th>
                  <th className="text-right py-3 px-2 hidden md:table-cell">24h Volume</th>
                  <th className="text-right py-3 px-2"></th>
                </tr>
              </thead>
              <tbody>
                {marketData.map((market, i) => (
                  <tr key={i} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-2 font-medium">{market.symbol}</td>
                    <td className="py-3 px-2 text-right font-mono">${market.lastPrice}</td>
                    <td className={`py-3 px-2 text-right ${parseFloat(market.change24h) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {parseFloat(market.change24h) >= 0 ? '+' : ''}{market.change24h}%
                    </td>
                    <td className="py-3 px-2 text-right hidden md:table-cell font-mono">${parseInt(market.volume24h).toLocaleString()}</td>
                    <td className="py-3 px-2 text-right">
                      <Link href={`/exchange?pair=${market.symbol.replace('/', '_')}`}>
                        <Button size="sm">Trade</Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="w-full py-12 bg-muted/30">
        <div className="container px-4 md:px-6 mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Trade With BRIV</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-card border-none shadow-sm">
              <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Security First</h3>
                <p className="text-muted-foreground">
                  Industry-leading security measures to protect your assets with 95% of funds stored in cold wallets.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-none shadow-sm">
              <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Percent className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Low Fees</h3>
                <p className="text-muted-foreground">
                  Competitive trading fees starting from 0.1% with additional discounts when using BRIV tokens.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-none shadow-sm">
              <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Zap className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Lightning Fast</h3>
                <p className="text-muted-foreground">
                  High-performance matching engine capable of handling up to 1,400,000 orders per second.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 bg-primary text-primary-foreground">
        <div className="container px-4 md:px-6 mx-auto flex flex-col items-center text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">Ready to Start Trading?</h2>
          <p className="text-xl max-w-[600px] mx-auto opacity-90">
            Join millions of traders on the world's fastest growing crypto exchange.
          </p>
          <Link href="/auth">
            <Button size="lg" variant="secondary" className="mt-4">
              Create Account
            </Button>
          </Link>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="w-full py-12 bg-card border-t border-border">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">Products</h3>
              <ul className="space-y-2">
                <li><Link href="/exchange"><span className="text-muted-foreground hover:text-foreground">Spot Trading</span></Link></li>
                <li><Link href="/future"><span className="text-muted-foreground hover:text-foreground">Futures</span></Link></li>
                <li><Link href="/margin"><span className="text-muted-foreground hover:text-foreground">Margin</span></Link></li>
                <li><Link href="/staking"><span className="text-muted-foreground hover:text-foreground">Staking</span></Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Services</h3>
              <ul className="space-y-2">
                <li><Link href="/affiliate"><span className="text-muted-foreground hover:text-foreground">Affiliate Program</span></Link></li>
                <li><Link href="/api-docs"><span className="text-muted-foreground hover:text-foreground">API Documentation</span></Link></li>
                <li><Link href="/listing"><span className="text-muted-foreground hover:text-foreground">Listing Application</span></Link></li>
                <li><Link href="/institutional"><span className="text-muted-foreground hover:text-foreground">Institutional Services</span></Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><Link href="/help"><span className="text-muted-foreground hover:text-foreground">Help Center</span></Link></li>
                <li><Link href="/guide"><span className="text-muted-foreground hover:text-foreground">Beginner Guide</span></Link></li>
                <li><Link href="/fees"><span className="text-muted-foreground hover:text-foreground">Fee Schedule</span></Link></li>
                <li><Link href="/bounty"><span className="text-muted-foreground hover:text-foreground">Bug Bounty</span></Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">About</h3>
              <ul className="space-y-2">
                <li><Link href="/about"><span className="text-muted-foreground hover:text-foreground">About Us</span></Link></li>
                <li><Link href="/careers"><span className="text-muted-foreground hover:text-foreground">Careers</span></Link></li>
                <li><Link href="/press"><span className="text-muted-foreground hover:text-foreground">Press</span></Link></li>
                <li><Link href="/privacy"><span className="text-muted-foreground hover:text-foreground">Privacy Policy</span></Link></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-muted-foreground">
              &copy; {new Date().getFullYear()} BRIV Exchange. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}