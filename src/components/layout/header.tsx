import * as React from "react";
// Replaced Button usages with raw buttons to avoid variant typing issues
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Search, Settings, User, LogOut, Smartphone, Shield, Moon, Sun } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { SignedIn, SignedOut, UserButton, SignInButton, SignUpButton } from "@clerk/clerk-react";

export const Header: React.FC = () => {
  const [theme, setTheme] = React.useState<'light' | 'dark'>(() => {
    const saved = typeof window !== 'undefined' ? (localStorage.getItem('theme') as 'light' | 'dark' | null) : null;
    return saved || 'dark';
  });
  const { logout } = useAuth();
  const navigate = useNavigate();

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    try { localStorage.setItem('theme', newTheme); } catch {}
  };

  React.useEffect(() => {
    // Ensure root class reflects current theme on mount
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 animate-slide-up">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">
              <span className="text-primary-foreground font-bold text-sm">Q</span>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent transition-all duration-300 group-hover:scale-105">
                QEADS
              </h1>
              <p className="text-xs text-muted-foreground transition-colors duration-300 group-hover:text-foreground">Quantum-Enhanced Anomaly Detection</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 transition-all duration-300 group-focus-within:text-primary group-focus-within:scale-110" />
              <Input 
                placeholder="Search transactions, merchants..." 
                className="pl-10 bg-muted/30 border-border/50 transition-all duration-300 focus:bg-background focus:shadow-lg focus:shadow-primary/10 focus:scale-105"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="h-9 w-9 p-0 inline-flex items-center justify-center rounded-md transition-all duration-300 hover:scale-110 hover:bg-primary/10 hover:rotate-12"
            >
              {theme === 'light' ? (
                <Moon className="w-4 h-4 transition-transform duration-300" />
              ) : (
                <Sun className="w-4 h-4 transition-transform duration-300" />
              )}
            </button>

            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button type="button" className="h-9 w-9 p-0 inline-flex items-center justify-center rounded-md relative group transition-all duration-300 hover:scale-110 hover:bg-danger/10">
                  <Bell className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12" />
                  <Badge 
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-danger animate-pulse"
                  >
                    3
                  </Badge>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="space-y-2 p-2">
                  <div className="p-3 rounded-lg bg-warning-light border border-warning/20">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-warning rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Anomaly Detected</p>
                        <p className="text-xs text-muted-foreground">Amazon purchase ₹15,999 exceeds normal pattern</p>
                        <p className="text-xs text-muted-foreground mt-1">2 minutes ago</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-success-light border border-success/20">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-success rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Green Goal Achieved</p>
                        <p className="text-xs text-muted-foreground">You've reduced carbon footprint by 15%</p>
                        <p className="text-xs text-muted-foreground mt-1">1 hour ago</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/30">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Monthly Report Ready</p>
                        <p className="text-xs text-muted-foreground">Your February spending analysis is available</p>
                        <p className="text-xs text-muted-foreground mt-1">3 hours ago</p>
                      </div>
                    </div>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="justify-center">
                  View All Notifications
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Settings */}
            <button type="button" className="h-9 w-9 p-0 inline-flex items-center justify-center rounded-md transition-all duration-300 hover:scale-110 hover:bg-accent/50 hover:rotate-45">
              <Settings className="w-4 h-4" />
            </button>

            {/* User Menu / Clerk */}
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            <SignedOut>
              <div className="flex items-center gap-2">
                <SignInButton>
                  <button type="button" className="px-3 h-9 inline-flex items-center justify-center rounded-md hover:bg-accent">
                    Sign in
                  </button>
                </SignInButton>
                <SignUpButton>
                  <button type="button" className="px-3 h-9 inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90">
                    Sign up
                  </button>
                </SignUpButton>
              </div>
            </SignedOut>
          </div>
        </div>
      </div>
    </header>
  );
};