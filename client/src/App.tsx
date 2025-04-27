import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "./hooks/use-theme";
import { AuthProvider } from "./hooks/use-auth";
import { WebSocketProvider } from "./hooks/use-websocket";

import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import HomePage from "@/pages/home-page";
import ExchangePage from "@/pages/exchange-page";
import WalletPage from "@/pages/wallet-page";
import MarketsPage from "@/pages/markets-page";
import ProfilePage from "@/pages/profile-page";
import FuturesPage from "@/pages/futures-page";
import MarginPage from "@/pages/margin-page";
import P2PPage from "@/pages/p2p-page";
import StakingPage from "@/pages/staking-page";
import LaunchpadPage from "@/pages/launchpad-page";
import SupportPage from "@/pages/support-page";
import { ProtectedRoute } from "./lib/protected-route";

// User account pages
const DashboardPage = () => <div className="container mx-auto py-12"><h1 className="text-3xl font-bold mb-8">User Dashboard</h1><div className="grid grid-cols-1 md:grid-cols-3 gap-6"><div className="bg-card p-6 rounded-lg border"><h2 className="text-xl font-medium mb-4">Account Overview</h2><div className="space-y-4"><div><p className="text-muted-foreground mb-1">Total Balance</p><p className="text-2xl font-bold">$42,568.75</p></div><div><p className="text-muted-foreground mb-1">24h Change</p><p className="text-green-500">+$1,245.32 (2.9%)</p></div></div></div><div className="bg-card p-6 rounded-lg border"><h2 className="text-xl font-medium mb-4">Recent Activity</h2><div className="space-y-3"><div className="border-b pb-2"><p className="font-medium">BTC Deposit</p><p className="text-sm text-muted-foreground">0.15 BTC • 2 hours ago</p></div><div className="border-b pb-2"><p className="font-medium">ETH/USDT Trade</p><p className="text-sm text-muted-foreground">Bought 2.5 ETH • 5 hours ago</p></div></div></div><div className="bg-card p-6 rounded-lg border"><h2 className="text-xl font-medium mb-4">Security Status</h2><div className="space-y-2"><div className="flex justify-between items-center"><span>Two-Factor Auth</span><span className="text-green-500">Enabled</span></div><div className="flex justify-between items-center"><span>Email Verification</span><span className="text-green-500">Verified</span></div><div className="flex justify-between items-center"><span>Last Login</span><span>2 hours ago</span></div></div></div></div></div>;
const OrdersPage = () => <div className="container mx-auto py-12"><h1 className="text-3xl font-bold mb-8">Your Orders</h1><div className="bg-card p-6 rounded-lg border mb-6"><div className="overflow-x-auto"><table className="w-full border-collapse"><thead><tr className="border-b border-border"><th className="text-left py-3 px-2">Pair</th><th className="text-left py-3 px-2">Type</th><th className="text-right py-3 px-2">Price</th><th className="text-right py-3 px-2">Amount</th><th className="text-right py-3 px-2">Filled</th><th className="text-right py-3 px-2">Status</th><th className="text-right py-3 px-2">Date</th></tr></thead><tbody><tr className="border-b border-border"><td className="py-3 px-2">BTC/USDT</td><td className="py-3 px-2 text-green-500">Buy</td><td className="py-3 px-2 text-right">$64,250.75</td><td className="py-3 px-2 text-right">0.15 BTC</td><td className="py-3 px-2 text-right">100%</td><td className="py-3 px-2 text-right text-green-500">Completed</td><td className="py-3 px-2 text-right">2023-04-26 14:32</td></tr><tr className="border-b border-border"><td className="py-3 px-2">ETH/USDT</td><td className="py-3 px-2 text-red-500">Sell</td><td className="py-3 px-2 text-right">$3,150.25</td><td className="py-3 px-2 text-right">2.5 ETH</td><td className="py-3 px-2 text-right">100%</td><td className="py-3 px-2 text-right text-green-500">Completed</td><td className="py-3 px-2 text-right">2023-04-26 11:15</td></tr></tbody></table></div></div></div>;
const SettingsPage = () => <div className="container mx-auto py-12"><h1 className="text-3xl font-bold mb-8">Account Settings</h1><div className="grid grid-cols-1 md:grid-cols-3 gap-8"><div className="md:col-span-1"><div className="bg-card p-6 rounded-lg border"><div className="space-y-4"><button className="w-full text-left py-2 px-3 bg-primary/10 text-primary rounded-md">Profile Settings</button><button className="w-full text-left py-2 px-3 hover:bg-muted/50 rounded-md">Security</button><button className="w-full text-left py-2 px-3 hover:bg-muted/50 rounded-md">Preferences</button><button className="w-full text-left py-2 px-3 hover:bg-muted/50 rounded-md">API Access</button><button className="w-full text-left py-2 px-3 hover:bg-muted/50 rounded-md">Notifications</button></div></div></div><div className="md:col-span-2"><div className="bg-card p-6 rounded-lg border"><h2 className="text-xl font-medium mb-6">Profile Settings</h2><div className="grid grid-cols-1 gap-4"><div><label className="block text-sm font-medium mb-1">Username</label><input type="text" className="w-full p-2 rounded-md border bg-background" value="qwert" /></div><div><label className="block text-sm font-medium mb-1">Email</label><input type="email" className="w-full p-2 rounded-md border bg-background" value="souverainnexus@gmail.com" /></div><div><label className="block text-sm font-medium mb-1">Time Zone</label><select className="w-full p-2 rounded-md border bg-background"><option>UTC (Coordinated Universal Time)</option><option>EST (Eastern Standard Time)</option><option>PST (Pacific Standard Time)</option></select></div><div><label className="block text-sm font-medium mb-1">Display Currency</label><select className="w-full p-2 rounded-md border bg-background"><option>USD</option><option>EUR</option><option>GBP</option><option>BTC</option></select></div><div className="mt-4"><button className="bg-primary text-primary-foreground px-4 py-2 rounded-md">Save Changes</button></div></div></div></div></div></div>;

function Router() {
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/" component={HomePage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/markets" component={MarketsPage} />
      <Route path="/support" component={SupportPage} />
      
      {/* Trading routes - protected */}
      <ProtectedRoute path="/exchange" component={ExchangePage} />
      <ProtectedRoute path="/futures" component={FuturesPage} />
      <ProtectedRoute path="/margin" component={MarginPage} />
      <ProtectedRoute path="/p2p" component={P2PPage} />
      <ProtectedRoute path="/staking" component={StakingPage} />
      <ProtectedRoute path="/launchpad" component={LaunchpadPage} />
      
      {/* User account routes - protected */}
      <ProtectedRoute path="/dashboard" component={DashboardPage} />
      <ProtectedRoute path="/wallet" component={WalletPage} />
      <ProtectedRoute path="/profile" component={ProfilePage} />
      <ProtectedRoute path="/orders" component={OrdersPage} />
      <ProtectedRoute path="/settings" component={SettingsPage} />
      
      {/* 404 fallback */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark">
        <AuthProvider>
          <WebSocketProvider>
            <TooltipProvider>
              <Toaster />
              <Router />
            </TooltipProvider>
          </WebSocketProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
