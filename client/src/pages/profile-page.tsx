import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Header } from "@/components/layout/header";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Fingerprint, 
  User, 
  Key, 
  Settings, 
  Bell, 
  Shield, 
  MoreVertical, 
  Lock,
  Smartphone,
  MailCheck,
  LogOut,
  FileCheck
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ProfilePage() {
  const { user, logoutMutation } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");
  
  // Get user initials for avatar
  const getInitials = () => {
    if (!user) return "?";
    
    if (user.fullName) {
      const nameParts = user.fullName.split(" ");
      if (nameParts.length >= 2) {
        return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
      }
      return nameParts[0][0].toUpperCase();
    }
    
    return user.username[0].toUpperCase();
  };
  
  // Handle logout
  const handleLogout = () => {
    logoutMutation.mutate();
  };
  
  // Dummy save function - would be replaced with actual API call
  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your profile settings have been updated",
    });
  };
  
  // Dummy security action
  const handle2FAAction = () => {
    toast({
      title: "2FA Setup",
      description: "Two-factor authentication setup wizard would be shown here",
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="container mx-auto px-4 py-6 pb-20 md:pb-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-64">
            <Card>
              <CardHeader className="px-4 py-6 flex flex-col items-center">
                <Avatar className="h-20 w-20 mb-4">
                  <AvatarImage src={user?.profileImageUrl} alt={user?.username} />
                  <AvatarFallback className="text-lg">{getInitials()}</AvatarFallback>
                </Avatar>
                <CardTitle className="text-xl">{user?.fullName || user?.username}</CardTitle>
                <CardDescription className="break-all">{user?.email}</CardDescription>
                
                <div className="mt-4 w-full">
                  <div className="bg-secondary p-2 rounded-lg flex items-center mb-2">
                    <Shield className="h-5 w-5 mr-2 text-muted-foreground" />
                    <div className="flex-1">
                      <div className="text-sm">KYC Status</div>
                      <div className="text-xs text-muted-foreground capitalize">
                        {user?.kycStatus || "Unverified"}
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Verify</Button>
                  </div>
                  
                  <Button variant="outline" className="w-full" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="p-0">
                <Tabs 
                  orientation="vertical" 
                  className="w-full" 
                  value={activeTab} 
                  onValueChange={setActiveTab}
                >
                  <TabsList className="w-full flex flex-col items-stretch h-auto bg-transparent">
                    <TabsTrigger 
                      value="profile" 
                      className="justify-start px-4 py-3 rounded-none"
                    >
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </TabsTrigger>
                    <TabsTrigger 
                      value="security" 
                      className="justify-start px-4 py-3 rounded-none"
                    >
                      <Key className="h-4 w-4 mr-2" />
                      Security
                    </TabsTrigger>
                    <TabsTrigger 
                      value="identity" 
                      className="justify-start px-4 py-3 rounded-none"
                    >
                      <Fingerprint className="h-4 w-4 mr-2" />
                      Identity Verification
                    </TabsTrigger>
                    <TabsTrigger 
                      value="notifications" 
                      className="justify-start px-4 py-3 rounded-none"
                    >
                      <Bell className="h-4 w-4 mr-2" />
                      Notifications
                    </TabsTrigger>
                    <TabsTrigger 
                      value="settings" 
                      className="justify-start px-4 py-3 rounded-none"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardContent>
            </Card>
          </div>
          
          {/* Main Content */}
          <div className="flex-1">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              {/* Profile Tab */}
              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>
                      Manage your personal details and account information
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input 
                          id="fullName" 
                          placeholder="Enter your full name" 
                          defaultValue={user?.fullName || ""}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input 
                          id="username" 
                          placeholder="Username" 
                          defaultValue={user?.username} 
                          disabled
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <div className="flex space-x-2">
                        <Input 
                          id="email" 
                          type="email" 
                          placeholder="Enter your email" 
                          defaultValue={user?.email} 
                          className="flex-1"
                        />
                        <Button variant="outline">
                          Verify
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Email verification status: {user?.emailVerified ? (
                          <span className="text-success">Verified</span>
                        ) : (
                          <span className="text-destructive">Unverified</span>
                        )}
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="flex space-x-2">
                        <Input 
                          id="phone" 
                          type="tel" 
                          placeholder="Enter your phone number" 
                          defaultValue={user?.phone || ""}
                          className="flex-1"
                        />
                        <Button variant="outline">
                          Verify
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Phone verification status: {user?.phoneVerified ? (
                          <span className="text-success">Verified</span>
                        ) : (
                          <span className="text-destructive">Unverified</span>
                        )}
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Profile Picture</Label>
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={user?.profileImageUrl} alt={user?.username} />
                          <AvatarFallback className="text-lg">{getInitials()}</AvatarFallback>
                        </Avatar>
                        <Button variant="outline">
                          Upload Image
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline">Cancel</Button>
                    <Button onClick={handleSave}>Save Changes</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              {/* Security Tab */}
              <TabsContent value="security">
                <Card>
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>
                      Manage your password and security options
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-6">
                      {/* Password Change */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-base font-medium flex items-center">
                              <Lock className="mr-2 h-4 w-4" />
                              Password
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              Change your account password
                            </p>
                          </div>
                          <Button>Change Password</Button>
                        </div>
                      </div>
                      
                      {/* 2FA Security */}
                      <div className="space-y-2 pt-4 border-t">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-base font-medium flex items-center">
                              <Smartphone className="mr-2 h-4 w-4" />
                              Two-Factor Authentication
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              Add an extra layer of security to your account
                            </p>
                          </div>
                          <Button 
                            variant={user?.twoFactorEnabled ? "outline" : "default"}
                            onClick={handle2FAAction}
                          >
                            {user?.twoFactorEnabled ? "Manage 2FA" : "Enable 2FA"}
                          </Button>
                        </div>
                      </div>
                      
                      {/* Email Verification */}
                      <div className="space-y-2 pt-4 border-t">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-base font-medium flex items-center">
                              <MailCheck className="mr-2 h-4 w-4" />
                              Email Verification
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              Verify your email address for account recovery
                            </p>
                          </div>
                          <Button 
                            variant={user?.emailVerified ? "outline" : "default"}
                            disabled={user?.emailVerified}
                          >
                            {user?.emailVerified ? "Verified" : "Verify Email"}
                          </Button>
                        </div>
                      </div>
                      
                      {/* Active Sessions */}
                      <div className="space-y-2 pt-4 border-t">
                        <h3 className="text-base font-medium">Active Sessions</h3>
                        <div className="bg-secondary rounded-lg p-4">
                          <div className="flex justify-between items-center mb-2">
                            <div>
                              <p className="text-sm font-medium">Current Session</p>
                              <p className="text-xs text-muted-foreground">
                                Web Browser - {navigator.userAgent.split(' ').slice(-1)[0]}
                              </p>
                            </div>
                            <div className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                              Active Now
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            IP Address: 192.168.1.xxx • Last accessed: {new Date().toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Identity Verification Tab */}
              <TabsContent value="identity">
                <Card>
                  <CardHeader>
                    <CardTitle>Identity Verification (KYC)</CardTitle>
                    <CardDescription>
                      Complete identity verification to unlock higher transaction limits
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center">
                          <div className="mr-4 bg-primary/20 p-3 rounded-full">
                            <User className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium">Basic Information</h3>
                            <p className="text-sm text-muted-foreground">
                              Complete your personal details
                            </p>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View</DropdownMenuItem>
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center">
                          <div className="mr-4 bg-primary/20 p-3 rounded-full">
                            <FileCheck className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium">Document Verification</h3>
                            <p className="text-sm text-muted-foreground">
                              Upload your ID documents
                            </p>
                          </div>
                        </div>
                        <Button size="sm">Start</Button>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center">
                          <div className="mr-4 bg-primary/20 p-3 rounded-full">
                            <Fingerprint className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium">Biometric Verification</h3>
                            <p className="text-sm text-muted-foreground">
                              Complete face verification
                            </p>
                          </div>
                        </div>
                        <Button size="sm" disabled>
                          Locked
                        </Button>
                      </div>
                    </div>
                    
                    <div className="mt-6 rounded-lg border p-4">
                      <h3 className="text-sm font-medium mb-2">Verification Status</h3>
                      <div className="flex items-center space-x-3">
                        <div className="w-full bg-secondary rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full"
                            style={{ width: user?.kycStatus === 'unverified' ? "0%" : "33%" }}
                          ></div>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {user?.kycStatus === 'unverified' ? "0%" : "33%"}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Your current verification level: <span className="font-medium capitalize">{user?.kycStatus || "Unverified"}</span>
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Placeholder for other tabs */}
              <TabsContent value="notifications">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Settings</CardTitle>
                    <CardDescription>
                      Manage how you receive notifications and alerts
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-center text-muted-foreground py-8">
                      Notification settings coming soon
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="settings">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                    <CardDescription>
                      Manage your account preferences and settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-center text-muted-foreground py-8">
                      Account settings coming soon
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      <MobileNavigation />
    </div>
  );
}
