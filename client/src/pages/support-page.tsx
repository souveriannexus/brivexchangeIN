import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  Search, 
  ChevronRight, 
  HelpCircle, 
  MessageSquare,
  FileQuestion,
  Send,
  Wallet,
  ShieldCheck,
  ArrowRightLeft,
  Clock,
  UserCircle2,
  ExternalLink,
  Check,
  LifeBuoy
} from "lucide-react";

// FAQ items organized by category
const faqItems = {
  account: [
    {
      question: "How do I create an account?",
      answer: "To create an account, click on the 'Register' button in the top-right corner of the homepage. Fill in the required information, including your email address, username, and password. Once submitted, you'll receive a verification email to activate your account."
    },
    {
      question: "How do I reset my password?",
      answer: "To reset your password, click on the 'Log In' button and then select 'Forgot Password'. Enter the email address associated with your account, and we'll send you instructions on how to reset your password. For security reasons, password reset links expire after 24 hours."
    },
    {
      question: "How do I enable two-factor authentication (2FA)?",
      answer: "Two-factor authentication adds an extra layer of security to your account. To enable 2FA, log in to your account, go to 'Settings', then 'Security'. Select 'Enable 2FA' and follow the instructions to set up using an authenticator app like Google Authenticator or Authy."
    },
    {
      question: "How can I change my email address?",
      answer: "To change your email address, go to 'Settings' > 'Account', then click 'Change Email'. You'll need to verify both your current and new email addresses to complete this process. Note that this may temporarily lock withdrawals for 24 hours as a security measure."
    },
  ],
  trading: [
    {
      question: "What order types are available?",
      answer: "Briv Exchange offers several order types to suit different trading strategies: Market orders (execute immediately at the best available price), Limit orders (execute at a specified price or better), Stop orders (become market orders when a specified price is reached), and Stop-Limit orders (become limit orders when a specified price is reached)."
    },
    {
      question: "How are trading fees calculated?",
      answer: "Trading fees are calculated based on your 30-day trading volume and whether you're a maker or taker. Maker fees start at 0.1% and taker fees at 0.1%. Holding BRIV tokens can reduce your fees by up to 25%. Visit our fee schedule page for a complete breakdown of fee tiers."
    },
    {
      question: "What is the minimum trade amount?",
      answer: "The minimum trade amount varies by trading pair. For most pairs, it's approximately $10 equivalent, but some pairs may have higher minimums. The exact minimum is displayed on the trading page for each pair when placing an order."
    },
    {
      question: "How do I check my order history?",
      answer: "To view your order history, go to the 'Exchange' page and look for the 'Order History' tab below the trading chart. You can also access a comprehensive history from your profile page by selecting 'Orders' from the dropdown menu."
    },
  ],
  wallet: [
    {
      question: "How do I deposit crypto?",
      answer: "To deposit crypto, navigate to the 'Wallet' page and select the cryptocurrency you wish to deposit. Click 'Deposit' and you'll see your deposit address. Send your funds to this address. Make sure to double-check the address and only send the specified cryptocurrency to avoid loss of funds."
    },
    {
      question: "How long do deposits take?",
      answer: "Deposit times vary depending on the cryptocurrency network congestion and the number of confirmations required. Bitcoin deposits typically require 3 confirmations, Ethereum and ERC-20 tokens require 12 confirmations. Most deposits complete within 10-60 minutes, but can take longer during high network congestion."
    },
    {
      question: "How do I withdraw crypto?",
      answer: "To withdraw crypto, go to the 'Wallet' page, select the cryptocurrency you wish to withdraw, and click 'Withdraw'. Enter the destination address and amount. For security, you'll need to confirm the withdrawal via email and 2FA (if enabled). New accounts may have withdrawal limits for the first 24 hours."
    },
    {
      question: "Why is my withdrawal pending?",
      answer: "Withdrawals may be pending for several reasons: waiting for manual approval (for large amounts), security checks, or blockchain network congestion. Most withdrawals are processed automatically within minutes, but some may take up to 24 hours. If a withdrawal remains pending for over 24 hours, please contact support."
    },
  ],
  security: [
    {
      question: "How does Briv Exchange secure my funds?",
      answer: "Briv Exchange employs multiple security measures to protect your funds: 95% of user funds are stored in cold wallets disconnected from the internet, we use multi-signature technology for hot wallets, implement real-time monitoring systems, conduct regular security audits, and offer user security features like 2FA, email confirmations, and IP whitelisting."
    },
    {
      question: "What should I do if I suspect unauthorized access?",
      answer: "If you suspect unauthorized access to your account, immediately: 1) Change your password, 2) Enable 2FA if not already active, 3) Check your account activity logs for suspicious actions, 4) Contact our support team via the 'Submit Ticket' option. We recommend also changing passwords on your email accounts and running anti-virus software on your devices."
    },
    {
      question: "Is my personal information secure?",
      answer: "Yes, we take data protection seriously. Your personal information is encrypted both in transit and at rest. We comply with global data protection regulations and only collect information necessary to provide our services. We never sell your personal data to third parties, and our staff access is restricted on a need-to-know basis."
    },
    {
      question: "How can I secure my account?",
      answer: "To maximize your account security: Enable two-factor authentication (2FA), use a strong unique password, set up withdrawal address whitelisting, regularly check your account activity, keep your email secure, be aware of phishing attempts, and use a dedicated device for trading. We also recommend setting up anti-phishing codes in your security settings."
    },
  ],
};

// Support ticket categories
const ticketCategories = [
  { id: "deposit", name: "Deposit Issues", icon: <ArrowRightLeft className="h-4 w-4 mr-2" /> },
  { id: "withdrawal", name: "Withdrawal Problems", icon: <Wallet className="h-4 w-4 mr-2" /> },
  { id: "account", name: "Account Access", icon: <UserCircle2 className="h-4 w-4 mr-2" /> },
  { id: "trading", name: "Trading Issues", icon: <ArrowRightLeft className="h-4 w-4 mr-2" /> },
  { id: "security", name: "Security Concerns", icon: <ShieldCheck className="h-4 w-4 mr-2" /> },
  { id: "other", name: "Other", icon: <HelpCircle className="h-4 w-4 mr-2" /> },
];

// Sample active tickets
const activeTickets = [
  { 
    id: "T-123456", 
    subject: "Delayed Withdrawal", 
    category: "withdrawal", 
    status: "In Progress", 
    created: "2023-04-25T14:30:00Z",
    lastUpdated: "2023-04-26T09:15:00Z"
  },
];

// Getting started guides
const gettingStartedGuides = [
  {
    title: "Account Setup Guide",
    description: "Learn how to create and secure your Briv Exchange account",
    icon: <UserCircle2 className="h-6 w-6" />,
    link: "/guides/account-setup"
  },
  {
    title: "Deposit & Withdrawal Guide",
    description: "How to deposit and withdraw cryptocurrencies",
    icon: <Wallet className="h-6 w-6" />,
    link: "/guides/deposits-withdrawals"
  },
  {
    title: "Trading Basics",
    description: "Learn the fundamentals of cryptocurrency trading",
    icon: <ArrowRightLeft className="h-6 w-6" />,
    link: "/guides/trading-basics"
  },
  {
    title: "Security Best Practices",
    description: "Protect your account and funds with these security tips",
    icon: <ShieldCheck className="h-6 w-6" />,
    link: "/guides/security"
  },
  {
    title: "Understanding Order Types",
    description: "Learn about different order types and when to use them",
    icon: <FileQuestion className="h-6 w-6" />,
    link: "/guides/order-types"
  },
  {
    title: "Getting Started with Staking",
    description: "Earn passive income by staking your crypto assets",
    icon: <Clock className="h-6 w-6" />,
    link: "/guides/staking"
  },
];

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFaqCategory, setSelectedFaqCategory] = useState("account");
  const [ticketFormOpen, setTicketFormOpen] = useState(false);
  const [ticketData, setTicketData] = useState({
    category: "",
    subject: "",
    description: "",
    email: "",
  });
  const { toast } = useToast();
  
  const handleTicketSubmit = () => {
    // In a real implementation, this would send the ticket data to a backend API
    console.log("Submitting ticket:", ticketData);
    toast({
      title: "Support Ticket Created",
      description: "Your ticket has been submitted successfully. We'll respond within 24 hours.",
      duration: 5000,
    });
    setTicketFormOpen(false);
    setTicketData({
      category: "",
      subject: "",
      description: "",
      email: "",
    });
  };
  
  const handleTicketDataChange = (field: string, value: string) => {
    setTicketData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Filter FAQ items based on search query
  const filteredFaqs = searchQuery 
    ? Object.values(faqItems).flat().filter(item => 
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : faqItems[selectedFaqCategory as keyof typeof faqItems];
  
  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col space-y-6">
        {/* Page header */}
        <div className="flex flex-col space-y-2">
          <h1 className="text-2xl font-bold">Help Center</h1>
          <p className="text-muted-foreground">
            Find answers to common questions or get in touch with our support team.
          </p>
        </div>
        
        {/* Search bar */}
        <div className="relative max-w-3xl mx-auto w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search for answers..."
            className="pl-10 py-6 text-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {/* Quick links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer">
            <CardContent className="p-6 flex items-center space-x-4">
              <MessageSquare className="h-8 w-8" />
              <div>
                <CardTitle className="text-xl mb-1">Contact Support</CardTitle>
                <CardDescription className="text-primary-foreground/70">
                  Create a support ticket
                </CardDescription>
              </div>
              <ChevronRight className="h-6 w-6 ml-auto" />
            </CardContent>
          </Card>
          
          <Card className="bg-card hover:bg-card/90 transition-colors border cursor-pointer" onClick={() => document.getElementById('faq-section')?.scrollIntoView({ behavior: 'smooth' })}>
            <CardContent className="p-6 flex items-center space-x-4">
              <HelpCircle className="h-8 w-8" />
              <div>
                <CardTitle className="text-xl mb-1">FAQ</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Browse frequently asked questions
                </CardDescription>
              </div>
              <ChevronRight className="h-6 w-6 ml-auto" />
            </CardContent>
          </Card>
          
          <Card className="bg-card hover:bg-card/90 transition-colors border cursor-pointer" onClick={() => document.getElementById('guides-section')?.scrollIntoView({ behavior: 'smooth' })}>
            <CardContent className="p-6 flex items-center space-x-4">
              <FileQuestion className="h-8 w-8" />
              <div>
                <CardTitle className="text-xl mb-1">Guides</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Learn how to use Briv Exchange
                </CardDescription>
              </div>
              <ChevronRight className="h-6 w-6 ml-auto" />
            </CardContent>
          </Card>
        </div>
        
        {/* Main content */}
        <Tabs defaultValue="faq" className="w-full mt-6">
          <TabsList className="grid w-full max-w-md grid-cols-3 mb-8">
            <TabsTrigger value="faq">FAQ</TabsTrigger>
            <TabsTrigger value="tickets">My Tickets</TabsTrigger>
            <TabsTrigger value="guides">Guides</TabsTrigger>
          </TabsList>
          
          {/* FAQ Tab */}
          <TabsContent value="faq" className="space-y-6" id="faq-section">
            {!searchQuery && (
              <div className="flex flex-wrap gap-2 mb-4">
                <Button 
                  variant={selectedFaqCategory === "account" ? "default" : "outline"} 
                  onClick={() => setSelectedFaqCategory("account")}
                >
                  Account
                </Button>
                <Button 
                  variant={selectedFaqCategory === "trading" ? "default" : "outline"} 
                  onClick={() => setSelectedFaqCategory("trading")}
                >
                  Trading
                </Button>
                <Button 
                  variant={selectedFaqCategory === "wallet" ? "default" : "outline"} 
                  onClick={() => setSelectedFaqCategory("wallet")}
                >
                  Deposits & Withdrawals
                </Button>
                <Button 
                  variant={selectedFaqCategory === "security" ? "default" : "outline"} 
                  onClick={() => setSelectedFaqCategory("security")}
                >
                  Security
                </Button>
              </div>
            )}
            
            {searchQuery && (
              <div className="mb-6">
                <h2 className="text-lg font-medium mb-2">Search Results for "{searchQuery}"</h2>
                <p className="text-muted-foreground">
                  Found {filteredFaqs.length} results
                </p>
              </div>
            )}
            
            <Card>
              <CardContent className="p-6">
                <Accordion type="single" collapsible className="w-full">
                  {filteredFaqs.map((item, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left py-4">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="py-2 text-muted-foreground">
                          {item.answer}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
                
                {filteredFaqs.length === 0 && (
                  <div className="text-center py-8">
                    <HelpCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No results found</h3>
                    <p className="text-muted-foreground mb-6">
                      We couldn't find any answers matching your search. Try a different query or create a support ticket.
                    </p>
                    <Button onClick={() => setTicketFormOpen(true)}>
                      Create Support Ticket
                    </Button>
                  </div>
                )}
              </CardContent>
              <CardFooter className="border-t p-6 bg-muted/30">
                <div className="w-full text-center">
                  <p className="text-muted-foreground mb-2">
                    Couldn't find what you're looking for?
                  </p>
                  <Button onClick={() => setTicketFormOpen(true)}>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Contact Support
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* My Tickets Tab */}
          <TabsContent value="tickets" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">My Support Tickets</h2>
              <Button onClick={() => setTicketFormOpen(true)}>
                <MessageSquare className="h-4 w-4 mr-2" />
                New Ticket
              </Button>
            </div>
            
            {activeTickets.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>Active Tickets</CardTitle>
                </CardHeader>
                <CardContent>
                  {activeTickets.map((ticket) => (
                    <div key={ticket.id} className="border rounded-md p-4 hover:bg-muted/30 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium">{ticket.subject}</h3>
                          <div className="text-sm text-muted-foreground">
                            Ticket ID: {ticket.id}
                          </div>
                        </div>
                        <Badge variant={
                          ticket.status === "Open" ? "default" : 
                          ticket.status === "In Progress" ? "secondary" :
                          "outline"
                        }>
                          {ticket.status}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center text-sm text-muted-foreground">
                        <span className="mr-4">
                          <Clock className="h-3 w-3 inline mr-1" />
                          Created: {new Date(ticket.created).toLocaleString()}
                        </span>
                        <span>
                          <Clock className="h-3 w-3 inline mr-1" />
                          Updated: {new Date(ticket.lastUpdated).toLocaleString()}
                        </span>
                      </div>
                      
                      <div className="mt-3">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Active Tickets</h3>
                  <p className="text-muted-foreground mb-6">
                    You don't have any open support tickets. Need help? Create a new ticket.
                  </p>
                  <Button onClick={() => setTicketFormOpen(true)}>
                    Create Support Ticket
                  </Button>
                </CardContent>
              </Card>
            )}
            
            <Card>
              <CardHeader>
                <CardTitle>Support Hours</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium mb-1">Standard Support</h3>
                    <p className="text-muted-foreground text-sm">
                      Monday - Friday: 9:00 AM - 5:00 PM UTC
                    </p>
                    <p className="text-muted-foreground text-sm">
                      Response time: Within 24 hours
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-1">Emergency Support</h3>
                    <p className="text-muted-foreground text-sm">
                      24/7 for account security issues
                    </p>
                    <p className="text-muted-foreground text-sm">
                      Response time: Within 2 hours
                    </p>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-medium mb-2">Priority Support</h3>
                  <p className="text-muted-foreground text-sm mb-3">
                    Users holding 5000+ BRIV tokens receive priority support with faster response times.
                  </p>
                  <Button variant="outline" size="sm">
                    Learn More About VIP Support
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Guides Tab */}
          <TabsContent value="guides" className="space-y-6" id="guides-section">
            <h2 className="text-xl font-bold">Getting Started Guides</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {gettingStartedGuides.map((guide, index) => (
                <Card key={index} className="hover:border-primary/50 transition-colors cursor-pointer">
                  <CardHeader>
                    <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center text-primary mb-4">
                      {guide.icon}
                    </div>
                    <CardTitle>{guide.title}</CardTitle>
                    <CardDescription>{guide.description}</CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      Read Guide
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
            
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Video Tutorials</CardTitle>
                <CardDescription>
                  Learn visually with our step-by-step video guides
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-md p-4 hover:bg-muted/30 transition-colors">
                    <div className="aspect-video bg-muted rounded-md flex items-center justify-center mb-3">
                      <PlayIcon />
                    </div>
                    <h3 className="font-medium mb-1">Getting Started with Briv Exchange</h3>
                    <p className="text-sm text-muted-foreground">
                      A complete beginner's guide to navigating the platform
                    </p>
                  </div>
                  
                  <div className="border rounded-md p-4 hover:bg-muted/30 transition-colors">
                    <div className="aspect-video bg-muted rounded-md flex items-center justify-center mb-3">
                      <PlayIcon />
                    </div>
                    <h3 className="font-medium mb-1">How to Trade Cryptocurrencies</h3>
                    <p className="text-sm text-muted-foreground">
                      Learn the basics of placing and managing orders
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View All Video Tutorials
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Contact information */}
        <Card className="mt-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <MessageSquare className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h3 className="font-medium text-lg mb-1">Email Support</h3>
                <p className="text-muted-foreground mb-2">
                  Our team is available via email 24/7
                </p>
                <Button variant="outline" size="sm" onClick={() => setTicketFormOpen(true)}>
                  Create Ticket
                </Button>
              </div>
              
              <div className="text-center">
                <LifeBuoy className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h3 className="font-medium text-lg mb-1">Live Chat</h3>
                <p className="text-muted-foreground mb-2">
                  Available Monday-Friday, 9AM-5PM UTC
                </p>
                <Button variant="outline" size="sm">
                  Start Chat
                </Button>
              </div>
              
              <div className="text-center">
                <HelpCircle className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h3 className="font-medium text-lg mb-1">Help Center</h3>
                <p className="text-muted-foreground mb-2">
                  Browse our comprehensive knowledge base
                </p>
                <Button variant="outline" size="sm">
                  Visit Knowledge Base
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Support Ticket Dialog */}
      <Dialog open={ticketFormOpen} onOpenChange={setTicketFormOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Create Support Ticket</DialogTitle>
            <DialogDescription>
              Fill out the form below and our support team will assist you as soon as possible.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="category" className="text-right text-sm font-medium">
                Category
              </label>
              <select
                id="category"
                value={ticketData.category}
                onChange={(e) => handleTicketDataChange("category", e.target.value)}
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="" disabled>Select category</option>
                {ticketCategories.map((category) => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="subject" className="text-right text-sm font-medium">
                Subject
              </label>
              <Input
                id="subject"
                value={ticketData.subject}
                onChange={(e) => handleTicketDataChange("subject", e.target.value)}
                placeholder="Brief description of your issue"
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-start gap-4">
              <label htmlFor="description" className="text-right text-sm font-medium pt-2">
                Description
              </label>
              <Textarea
                id="description"
                value={ticketData.description}
                onChange={(e) => handleTicketDataChange("description", e.target.value)}
                placeholder="Please provide as much detail as possible about your issue"
                className="col-span-3 min-h-[120px]"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="email" className="text-right text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={ticketData.email}
                onChange={(e) => handleTicketDataChange("email", e.target.value)}
                placeholder="Your contact email"
                className="col-span-3"
              />
            </div>
            
            <div className="col-span-full mt-2">
              <div className="rounded-md bg-primary/10 p-3 text-sm text-primary flex items-start">
                <Check className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Response Time Expectation</p>
                  <p className="mt-1">
                    We aim to respond to all inquiries within 24 hours. For urgent security issues, please select the "Security Concerns" category for faster assistance.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setTicketFormOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" onClick={handleTicketSubmit}
              disabled={!ticketData.category || !ticketData.subject || !ticketData.description || !ticketData.email}
            >
              <Send className="mr-2 h-4 w-4" />
              Submit Ticket
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Play icon component for video thumbnails
function PlayIcon() {
  return (
    <div className="w-16 h-16 rounded-full bg-primary/80 flex items-center justify-center cursor-pointer hover:bg-primary transition-colors">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 5V19L19 12L8 5Z" fill="white" />
      </svg>
    </div>
  );
}