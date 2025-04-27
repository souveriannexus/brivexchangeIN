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
  Calendar, 
  Clock, 
  DollarSign, 
  ExternalLink, 
  Globe, 
  Github, 
  Twitter, 
  Rocket,
  FileText,
  Users,
  BarChart,
  AlertTriangle
} from "lucide-react";

// Sample token sales
const tokenSales = [
  {
    id: 1,
    name: "DecentraChain",
    symbol: "DCH",
    logo: "🔗",
    status: "Live",
    description: "A next-generation Layer 1 blockchain with revolutionary consensus algorithm and smart contract capabilities.",
    totalRaise: 5000000,
    currentRaise: 3750000,
    tokenPrice: 0.075,
    startDate: "2023-04-15",
    endDate: "2023-05-15",
    website: "https://decentrachain.io",
    whitepaper: "https://decentrachain.io/whitepaper.pdf",
    github: "https://github.com/decentrachain",
    twitter: "https://twitter.com/decentrachain",
    category: "Infrastructure",
    tags: ["Layer 1", "Smart Contracts", "Web3"],
    minInvestment: 100,
    maxInvestment: 25000,
    totalSupply: 1000000000,
    totalForSale: 100000000,
    acceptedCurrency: "USDT",
    vestingSchedule: "10% at TGE, 15% after 1 month, then 15% quarterly",
    team: [
      { name: "John Smith", role: "CEO & Founder", linkedin: "#" },
      { name: "Alice Johnson", role: "CTO", linkedin: "#" },
      { name: "Bob Williams", role: "Blockchain Lead", linkedin: "#" },
    ],
  },
  {
    id: 2,
    name: "MetaverseX",
    symbol: "MVX",
    logo: "🌐",
    status: "Upcoming",
    description: "A decentralized metaverse platform enabling users to create, own, and monetize virtual experiences and assets.",
    totalRaise: 8000000,
    currentRaise: 0,
    tokenPrice: 0.12,
    startDate: "2023-05-20",
    endDate: "2023-06-20",
    website: "https://metaversex.io",
    whitepaper: "https://metaversex.io/whitepaper.pdf",
    github: "https://github.com/metaversex",
    twitter: "https://twitter.com/metaversex",
    category: "Metaverse",
    tags: ["Gaming", "NFT", "Virtual Reality"],
    minInvestment: 200,
    maxInvestment: 50000,
    totalSupply: 500000000,
    totalForSale: 75000000,
    acceptedCurrency: "USDT",
    vestingSchedule: "5% at TGE, then 5% monthly for 19 months",
    team: [
      { name: "Sarah Lee", role: "CEO", linkedin: "#" },
      { name: "Michael Chen", role: "CTO", linkedin: "#" },
      { name: "Emma Davis", role: "CMO", linkedin: "#" },
    ],
  },
  {
    id: 3,
    name: "DeFiYield",
    symbol: "DFY",
    logo: "💰",
    status: "Upcoming",
    description: "An innovative DeFi protocol offering yield farming, lending, and synthetic assets with cross-chain capabilities.",
    totalRaise: 3500000,
    currentRaise: 0,
    tokenPrice: 0.04,
    startDate: "2023-06-01",
    endDate: "2023-06-30",
    website: "https://defiyield.finance",
    whitepaper: "https://defiyield.finance/whitepaper.pdf",
    github: "https://github.com/defiyield",
    twitter: "https://twitter.com/defiyield",
    category: "DeFi",
    tags: ["Yield Farming", "Lending", "Cross-chain"],
    minInvestment: 50,
    maxInvestment: 10000,
    totalSupply: 200000000,
    totalForSale: 40000000,
    acceptedCurrency: "USDT",
    vestingSchedule: "15% at TGE, then 17% quarterly",
    team: [
      { name: "Daniel Brown", role: "Founder", linkedin: "#" },
      { name: "Jennifer Wong", role: "Lead Developer", linkedin: "#" },
      { name: "Thomas Garcia", role: "Financial Strategist", linkedin: "#" },
    ],
  },
  {
    id: 4,
    name: "AI Chain",
    symbol: "AIC",
    logo: "🧠",
    status: "Completed",
    description: "A blockchain-based AI computation network that allows developers to build, train and deploy AI models in a decentralized manner.",
    totalRaise: 7000000,
    currentRaise: 7000000,
    tokenPrice: 0.085,
    startDate: "2023-03-01",
    endDate: "2023-04-01",
    website: "https://aichain.network",
    whitepaper: "https://aichain.network/whitepaper.pdf",
    github: "https://github.com/aichain",
    twitter: "https://twitter.com/aichain",
    category: "AI",
    tags: ["Artificial Intelligence", "Computation", "Data"],
    minInvestment: 150,
    maxInvestment: 30000,
    totalSupply: 750000000,
    totalForSale: 112500000,
    acceptedCurrency: "USDT",
    vestingSchedule: "10% at TGE, then 15% quarterly",
    team: [
      { name: "Richard Lee", role: "CEO", linkedin: "#" },
      { name: "Sophia Kim", role: "AI Research Lead", linkedin: "#" },
      { name: "David Zhao", role: "Blockchain Architect", linkedin: "#" },
    ],
  },
  {
    id: 5,
    name: "ZkPrivacy",
    symbol: "ZKP",
    logo: "🔒",
    status: "Live",
    description: "A privacy-focused Layer 2 scaling solution using zero-knowledge proofs to enable private and scalable transactions.",
    totalRaise: 4500000,
    currentRaise: 2800000,
    tokenPrice: 0.06,
    startDate: "2023-04-10",
    endDate: "2023-05-25",
    website: "https://zkprivacy.tech",
    whitepaper: "https://zkprivacy.tech/whitepaper.pdf",
    github: "https://github.com/zkprivacy",
    twitter: "https://twitter.com/zkprivacy",
    category: "Privacy",
    tags: ["Layer 2", "Zero Knowledge", "Scaling"],
    minInvestment: 75,
    maxInvestment: 15000,
    totalSupply: 300000000,
    totalForSale: 60000000,
    acceptedCurrency: "USDT",
    vestingSchedule: "8% at TGE, then 23% quarterly",
    team: [
      { name: "Alex Roberts", role: "Founder & Lead Researcher", linkedin: "#" },
      { name: "Julia Chen", role: "Protocol Engineer", linkedin: "#" },
      { name: "Mark Thompson", role: "Cryptography Expert", linkedin: "#" },
    ],
  },
];

// Sample user investments
const userInvestments = [
  {
    id: 101,
    projectName: "AI Chain",
    projectSymbol: "AIC",
    investmentAmount: 2500,
    tokenAmount: 29411.76,
    investmentDate: "2023-03-15",
    status: "Completed",
    vestingProgress: 10,
    tokensReleased: 2941.18,
    tokensLocked: 26470.58,
    nextRelease: "2023-07-15",
  },
];

export default function LaunchpadPage() {
  const [selectedSale, setSelectedSale] = useState<any>(null);
  const [investDialogOpen, setInvestDialogOpen] = useState(false);
  const [investmentAmount, setInvestmentAmount] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<string>("all");
  
  const filteredSales = tokenSales.filter(sale => {
    if (activeTab === "all") return true;
    return sale.status.toLowerCase() === activeTab.toLowerCase();
  });
  
  const calculateTokens = (amount: number) => {
    if (!selectedSale) return 0;
    return amount / selectedSale.tokenPrice;
  };
  
  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col space-y-6">
        {/* Page header */}
        <div className="flex flex-col space-y-2">
          <h1 className="text-2xl font-bold">Launchpad</h1>
          <p className="text-muted-foreground">
            Discover and participate in token sales for promising blockchain projects.
          </p>
        </div>
        
        {/* Stats overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{tokenSales.length}</div>
              <div className="text-sm text-muted-foreground flex items-center mt-1">
                <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-green-500 font-medium">+2</span>
                <span className="ml-1">this month</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Raised</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">$13.55M</div>
              <div className="text-sm text-muted-foreground flex items-center mt-1">
                <BarChart className="h-4 w-4 mr-1" />
                <span>Across all projects</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Your Investments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">$2,500</div>
              <div className="text-sm text-muted-foreground flex items-center mt-1">
                <Users className="h-4 w-4 mr-1" />
                <span>In 1 project</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Next Launch</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">May 20</div>
              <div className="text-sm text-muted-foreground flex items-center mt-1">
                <Calendar className="h-4 w-4 mr-1" />
                <span>MetaverseX (MVX)</span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Main content */}
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-4">
            <TabsTrigger value="all">All Projects</TabsTrigger>
            <TabsTrigger value="live">Live</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSales.map((sale) => (
              <Card key={sale.id} className="overflow-hidden hover:border-primary/50 transition-colors">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary text-xl">
                        {sale.logo}
                      </div>
                      <div>
                        <CardTitle>{sale.name}</CardTitle>
                        <CardDescription>{sale.symbol}</CardDescription>
                      </div>
                    </div>
                    <Badge
                      className={
                        sale.status === "Live"
                          ? "bg-green-500/10 text-green-500 border-green-500/20"
                          : sale.status === "Upcoming"
                          ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                          : "bg-gray-500/10 text-gray-500 border-gray-500/20"
                      }
                    >
                      {sale.status}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="pb-2">
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {sale.description}
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Progress</span>
                        <span>{Math.round((sale.currentRaise / sale.totalRaise) * 100)}%</span>
                      </div>
                      <Progress 
                        value={(sale.currentRaise / sale.totalRaise) * 100} 
                        className="h-2"
                      />
                      <div className="flex justify-between text-xs mt-1">
                        <span>{sale.currentRaise.toLocaleString()} USDT</span>
                        <span>{sale.totalRaise.toLocaleString()} USDT</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Token Price</div>
                        <div className="font-medium">${sale.tokenPrice}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Sale Ends</div>
                        <div className="font-medium">{sale.endDate}</div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 text-muted-foreground">
                      {sale.tags.map((tag, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="pt-4 flex justify-between">
                  <Button variant="outline" size="sm" className="text-xs"
                    onClick={() => {
                      setSelectedSale(sale);
                      const element = document.getElementById(`project-details-${sale.id}`);
                      if (element) element.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    View Details
                  </Button>
                  
                  {sale.status === "Live" ? (
                    <Button size="sm" className="text-xs"
                      onClick={() => {
                        setSelectedSale(sale);
                        setInvestmentAmount(sale.minInvestment);
                        setInvestDialogOpen(true);
                      }}
                    >
                      Participate
                    </Button>
                  ) : sale.status === "Upcoming" ? (
                    <Button size="sm" className="text-xs" variant="outline" disabled>
                      Coming Soon
                    </Button>
                  ) : (
                    <Button size="sm" className="text-xs" variant="outline" disabled>
                      Sale Ended
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
          
          {/* Project details sections */}
          {filteredSales.map((sale) => (
            <div key={sale.id} id={`project-details-${sale.id}`} className="mt-10 pb-10 border-b border-border">
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary text-2xl">
                  {sale.logo}
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{sale.name} ({sale.symbol})</h2>
                  <div className="flex items-center space-x-3 mt-1">
                    <Badge
                      className={
                        sale.status === "Live"
                          ? "bg-green-500/10 text-green-500 border-green-500/20"
                          : sale.status === "Upcoming"
                          ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                          : "bg-gray-500/10 text-gray-500 border-gray-500/20"
                      }
                    >
                      {sale.status}
                    </Badge>
                    <span className="text-sm text-muted-foreground">{sale.category}</span>
                    <div className="flex space-x-2">
                      <a href={sale.website} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                        <Globe className="h-4 w-4" />
                      </a>
                      <a href={sale.whitepaper} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                        <FileText className="h-4 w-4" />
                      </a>
                      <a href={sale.github} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                        <Github className="h-4 w-4" />
                      </a>
                      <a href={sale.twitter} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                        <Twitter className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                </div>
                
                {sale.status === "Live" && (
                  <div className="ml-auto">
                    <Button 
                      onClick={() => {
                        setSelectedSale(sale);
                        setInvestmentAmount(sale.minInvestment);
                        setInvestDialogOpen(true);
                      }}
                    >
                      Participate Now
                    </Button>
                  </div>
                )}
              </div>
              
              {/* Project progress */}
              <Card className="mb-6">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">Fundraising Goal</div>
                      <div className="text-xl font-bold">${sale.totalRaise.toLocaleString()}</div>
                      <div className="text-sm">{(sale.totalForSale).toLocaleString()} {sale.symbol}</div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">Token Price</div>
                      <div className="text-xl font-bold">${sale.tokenPrice}</div>
                      <div className="text-sm">Payment in {sale.acceptedCurrency}</div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">Sale Period</div>
                      <div className="text-xl font-bold">{sale.startDate}</div>
                      <div className="text-sm">to {sale.endDate}</div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">Participants</div>
                      <div className="text-xl font-bold">
                        {Math.floor(sale.currentRaise / ((sale.minInvestment + sale.maxInvestment) / 2))}
                      </div>
                      <div className="text-sm">Investors</div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Raised: ${sale.currentRaise.toLocaleString()} of ${sale.totalRaise.toLocaleString()}</span>
                      <span>{Math.round((sale.currentRaise / sale.totalRaise) * 100)}%</span>
                    </div>
                    <Progress 
                      value={(sale.currentRaise / sale.totalRaise) * 100} 
                      className="h-2"
                    />
                  </div>
                </CardContent>
              </Card>
              
              {/* Project details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Project Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        {sale.description}
                      </p>
                      
                      <div className="mt-4 flex flex-wrap gap-2">
                        {sale.tags.map((tag, i) => (
                          <Badge key={i} variant="outline">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Team</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {sale.team.map((member, i) => (
                          <div key={i} className="flex flex-col items-center text-center p-3 rounded-lg bg-muted/30">
                            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center text-xl mb-2">
                              {member.name.charAt(0)}
                            </div>
                            <div className="font-medium">{member.name}</div>
                            <div className="text-sm text-muted-foreground">{member.role}</div>
                            <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-primary text-sm mt-1">
                              LinkedIn
                            </a>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Token Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Symbol</span>
                          <span className="font-medium">{sale.symbol}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total Supply</span>
                          <span className="font-medium">{sale.totalSupply.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">For Sale</span>
                          <span className="font-medium">
                            {sale.totalForSale.toLocaleString()} ({(sale.totalForSale / sale.totalSupply * 100).toFixed(1)}%)
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Price</span>
                          <span className="font-medium">${sale.tokenPrice}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Min. Investment</span>
                          <span className="font-medium">${sale.minInvestment}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Max. Investment</span>
                          <span className="font-medium">${sale.maxInvestment}</span>
                        </div>
                        <Separator />
                        <div>
                          <div className="text-muted-foreground mb-1">Vesting Schedule</div>
                          <div className="text-sm">{sale.vestingSchedule}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Important Links</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <a href={sale.website} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between text-sm hover:underline">
                          <div className="flex items-center">
                            <Globe className="h-4 w-4 mr-2" />
                            <span>Website</span>
                          </div>
                          <ExternalLink className="h-4 w-4" />
                        </a>
                        <a href={sale.whitepaper} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between text-sm hover:underline">
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 mr-2" />
                            <span>Whitepaper</span>
                          </div>
                          <ExternalLink className="h-4 w-4" />
                        </a>
                        <a href={sale.github} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between text-sm hover:underline">
                          <div className="flex items-center">
                            <Github className="h-4 w-4 mr-2" />
                            <span>GitHub</span>
                          </div>
                          <ExternalLink className="h-4 w-4" />
                        </a>
                        <a href={sale.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between text-sm hover:underline">
                          <div className="flex items-center">
                            <Twitter className="h-4 w-4 mr-2" />
                            <span>Twitter</span>
                          </div>
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          ))}
        </Tabs>
        
        {/* Investment portfolio */}
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Your Portfolio</h2>
          
          {userInvestments.length > 0 ? (
            <div className="space-y-4">
              {userInvestments.map((investment) => (
                <Card key={investment.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <Rocket className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">{investment.projectName}</h3>
                          <div className="text-sm text-muted-foreground">
                            {investment.tokenAmount.toLocaleString()} {investment.projectSymbol} tokens
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-x-6 gap-y-2">
                        <div className="flex flex-col">
                          <span className="text-sm text-muted-foreground">Investment</span>
                          <span className="font-medium">${investment.investmentAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm text-muted-foreground">Date</span>
                          <span className="font-medium">{investment.investmentDate}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm text-muted-foreground">Status</span>
                          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                            {investment.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Vesting Progress</span>
                        <span>{investment.vestingProgress}%</span>
                      </div>
                      <Progress value={investment.vestingProgress} className="h-2" />
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-sm">
                        <div className="bg-muted/30 p-3 rounded-md">
                          <div className="text-muted-foreground mb-1">Tokens Released</div>
                          <div className="font-medium">{investment.tokensReleased.toLocaleString()} {investment.projectSymbol}</div>
                        </div>
                        <div className="bg-muted/30 p-3 rounded-md">
                          <div className="text-muted-foreground mb-1">Tokens Locked</div>
                          <div className="font-medium">{investment.tokensLocked.toLocaleString()} {investment.projectSymbol}</div>
                        </div>
                        <div className="bg-muted/30 p-3 rounded-md">
                          <div className="text-muted-foreground mb-1">Next Release</div>
                          <div className="font-medium">{investment.nextRelease}</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <div className="flex justify-center mb-4">
                  <Rocket className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">No Investments Yet</h3>
                <p className="text-muted-foreground mb-4">
                  You haven't participated in any token sales. Browse our launchpad to discover promising projects.
                </p>
                <Button onClick={() => {
                  const element = document.querySelector('[data-value="all"]') as HTMLElement;
                  if (element) element.click();
                }}>
                  View Available Projects
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      {/* Invest Dialog */}
      <Dialog open={investDialogOpen} onOpenChange={setInvestDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Participate in {selectedSale?.name}</DialogTitle>
            <DialogDescription>
              Enter the amount you want to invest in {selectedSale?.symbol} tokens.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label htmlFor="investment-amount" className="text-sm font-medium">
                Investment Amount ({selectedSale?.acceptedCurrency})
              </label>
              <Input
                id="investment-amount"
                type="number"
                value={investmentAmount}
                onChange={(e) => setInvestmentAmount(parseFloat(e.target.value))}
                min={selectedSale?.minInvestment}
                max={selectedSale?.maxInvestment}
              />
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">
                  Min: ${selectedSale?.minInvestment} | Max: ${selectedSale?.maxInvestment}
                </span>
                <Button variant="ghost" size="sm" className="h-auto p-0 text-xs text-primary">
                  Max
                </Button>
              </div>
            </div>
            
            <div className="rounded-md border p-4 bg-muted/30 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Token Price:</span>
                <span>${selectedSale?.tokenPrice}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">You will receive:</span>
                <span className="font-medium">
                  {calculateTokens(investmentAmount).toLocaleString()} {selectedSale?.symbol}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Vesting:</span>
                <span>{selectedSale?.vestingSchedule}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 rounded-md border p-3 bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
              <AlertTriangle className="h-4 w-4" />
              <p className="text-xs">
                Token sales involve risks. Please read the whitepaper and do your own research before investing.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setInvestDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setInvestDialogOpen(false)}>
              Confirm Investment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}