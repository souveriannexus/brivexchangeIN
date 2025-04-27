import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Logo } from "@/components/ui/logo";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import {
  Bell,
  Settings,
  Globe,
  Menu,
  User,
  LogOut,
  ChevronDown,
  LayoutDashboard,
  Wallet,
  ClipboardList,
  X
} from "lucide-react";
import { APP_SUBTITLE } from "@/lib/constants";

export function Header() {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const handleLogout = () => {
    logoutMutation.mutate();
    setMobileMenuOpen(false);
  };
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  return (
    <header className="bg-card border-b border-border px-4 py-2 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-6">
          {/* Logo */}
          <Link href={user ? "/exchange" : "/"}>
            <a className="flex items-center">
              <Logo size="lg" />
            </a>
          </Link>
          
          {/* Main Navigation */}
          <nav className="hidden md:flex space-x-5">
            <Link href={user ? "/exchange" : "/"}>
              <a className={location === "/exchange" ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground transition-colors"}>
                Spot Trading
              </a>
            </Link>
            <Link href="/futures">
              <a className={location === "/futures" ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground transition-colors"}>
                Futures
              </a>
            </Link>
            <Link href="/margin">
              <a className={location === "/margin" ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground transition-colors"}>
                Margin
              </a>
            </Link>
            <Link href="/p2p">
              <a className={location === "/p2p" ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground transition-colors"}>
                P2P
              </a>
            </Link>
            <Link href="/markets">
              <a className={location === "/markets" ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground transition-colors"}>
                Markets
              </a>
            </Link>
            <Link href="/staking">
              <a className={location === "/staking" ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground transition-colors"}>
                Staking
              </a>
            </Link>
            <Link href="/launchpad">
              <a className={location === "/launchpad" ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground transition-colors"}>
                Launchpad
              </a>
            </Link>
            <Link href="/support">
              <a className={location === "/support" ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground transition-colors"}>
                Support
              </a>
            </Link>
          </nav>
        </div>
        
        {/* User Tools */}
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <div className="hidden md:flex items-center">
                <span className="text-xs font-mono bg-card px-2 py-1 rounded mr-2">
                  <i className="fa-solid fa-bolt text-warning mr-1"></i>
                  <span>$25,412.54</span>
                </span>
                
                <ThemeToggle />
                
                <Button variant="ghost" size="icon" className="ml-2">
                  <Globe className="h-5 w-5" />
                </Button>
                
                <Button variant="ghost" size="icon" className="ml-2">
                  <Bell className="h-5 w-5" />
                </Button>
                
                <Button variant="ghost" size="icon" className="ml-2">
                  <Settings className="h-5 w-5" />
                </Button>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-1">
                    <User className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline-block">{user.username}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <Link href="/dashboard">
                    <DropdownMenuItem className="cursor-pointer">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/profile">
                    <DropdownMenuItem className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/wallet">
                    <DropdownMenuItem className="cursor-pointer">
                      <Wallet className="mr-2 h-4 w-4" />
                      <span>Wallet</span>
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/orders">
                    <DropdownMenuItem className="cursor-pointer">
                      <ClipboardList className="mr-2 h-4 w-4" />
                      <span>Orders</span>
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/settings">
                    <DropdownMenuItem className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center space-x-3">
              <Link href="/auth">
                <Button variant="outline" className="hidden md:flex">
                  Log In
                </Button>
              </Link>
              <Link href="/auth">
                <Button>Register</Button>
              </Link>
            </div>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={toggleMobileMenu}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border py-4 px-4 mt-2 bg-card">
          <nav className="flex flex-col space-y-4">
            <Link href={user ? "/exchange" : "/"} onClick={() => setMobileMenuOpen(false)}>
              <a className={location === "/exchange" ? "text-foreground font-medium" : "text-muted-foreground"}>
                Spot Trading
              </a>
            </Link>
            <Link href="/futures" onClick={() => setMobileMenuOpen(false)}>
              <a className={location === "/futures" ? "text-foreground font-medium" : "text-muted-foreground"}>
                Futures
              </a>
            </Link>
            <Link href="/margin" onClick={() => setMobileMenuOpen(false)}>
              <a className={location === "/margin" ? "text-foreground font-medium" : "text-muted-foreground"}>
                Margin
              </a>
            </Link>
            <Link href="/p2p" onClick={() => setMobileMenuOpen(false)}>
              <a className={location === "/p2p" ? "text-foreground font-medium" : "text-muted-foreground"}>
                P2P
              </a>
            </Link>
            <Link href="/markets" onClick={() => setMobileMenuOpen(false)}>
              <a className={location === "/markets" ? "text-foreground font-medium" : "text-muted-foreground"}>
                Markets
              </a>
            </Link>
            <Link href="/staking" onClick={() => setMobileMenuOpen(false)}>
              <a className={location === "/staking" ? "text-foreground font-medium" : "text-muted-foreground"}>
                Staking
              </a>
            </Link>
            <Link href="/launchpad" onClick={() => setMobileMenuOpen(false)}>
              <a className={location === "/launchpad" ? "text-foreground font-medium" : "text-muted-foreground"}>
                Launchpad
              </a>
            </Link>
            <Link href="/support" onClick={() => setMobileMenuOpen(false)}>
              <a className={location === "/support" ? "text-foreground font-medium" : "text-muted-foreground"}>
                Support
              </a>
            </Link>
            
            {user && (
              <>
                <div className="border-t border-border pt-4 mt-2">
                  <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                    <a className="flex items-center text-muted-foreground">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </a>
                  </Link>
                </div>
                <Link href="/wallet" onClick={() => setMobileMenuOpen(false)}>
                  <a className="flex items-center text-muted-foreground">
                    <Wallet className="mr-2 h-4 w-4" />
                    <span>Wallet</span>
                  </a>
                </Link>
                <Link href="/profile" onClick={() => setMobileMenuOpen(false)}>
                  <a className="flex items-center text-muted-foreground">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </a>
                </Link>
                <Link href="/settings" onClick={() => setMobileMenuOpen(false)}>
                  <a className="flex items-center text-muted-foreground">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </a>
                </Link>
                <button 
                  className="flex items-center text-muted-foreground"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
