import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/Button';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { 
  Activity,
  Dumbbell, 
  User, 
  BarChart3, 
  Settings, 
  LogOut,
  Menu,
  X,
  Flame,
  Heart,
  Brain,
  ChefHat,
  Calendar,
  Users,
  ClipboardList,
  ChevronDown,
  Zap,
  Video
} from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter, SheetClose } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils";

export function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Handle logo click with dedicated function
  const handleLogoClick = () => {
    console.log('Logo clicked, auth status:', isAuthenticated);
    if (isAuthenticated) {
      navigate('/home');
    } else {
      navigate('/');
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  // Fetch subscription status
  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      if (isAuthenticated && user) {
        try {
          const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/subscription/details`, {
            withCredentials: true
          });

          if (response.data.success && response.data.data.subscription) {
            const subscription = response.data.data.subscription;
            setIsPremium(subscription.plan === 'PREMIUM' && subscription.active);
          }
        } catch (error) {
          console.error('Error fetching subscription status:', error);
        }
      }
    };

    fetchSubscriptionStatus();
  }, [isAuthenticated, user]);

  // Group navigation items by category
  const workoutNavItems = [
    { path: '/workout-generator', label: 'Workout Builder', icon: <Activity className="w-4 h-4 mr-2" /> },
    { path: '/book-trainer', label: 'Book Trainer', icon: <Calendar className="w-4 h-4 mr-2" /> },
    { path: '/my-bookings', label: 'My Bookings', icon: <Calendar className="w-4 h-4 mr-2" /> }
  ];

  const nutritionNavItems = [
    { path: '/meal-generator', label: 'Meal Plans', icon: <Flame className="w-4 h-4 mr-2" /> },
    { path: '/ai-recipe', label: 'AI Recipe', icon: <ChefHat className="w-4 h-4 mr-2" /> }
  ];

  const aiNavItems = [
    { path: '/ai-assistant', label: 'AI Assistant', icon: <Brain className="w-4 h-4 mr-2" /> },
    // Add test meeting option only in development mode
    { path: '/video-meeting', label: 'Video Meeting', icon: <Video className="w-4 h-4 mr-2" /> }
  ];

  // Role-specific navigation items
  const adminNavItems = [
    { path: '/admin/dashboard', label: 'Admin Dashboard', icon: <Users className="w-4 h-4 mr-2" /> }
  ];

  const trainerNavItems = [
    { path: '/trainer-dashboard', label: 'Trainer Dashboard', icon: <ClipboardList className="w-4 h-4 mr-2" /> }
  ];

  const navItems = [
    { path: '#features', label: 'Features', icon: <Activity className="w-4 h-4 mr-2" /> },
    { path: '#pricing', label: 'Pricing', icon: <BarChart3 className="w-4 h-4 mr-2" /> },
    { path: '#about', label: 'About', icon: <Heart className="w-4 h-4 mr-2" /> },
  ];

  // Check if a nav item is active
  const isActive = (path: string) => {
    if (path.startsWith('#')) {
      return location.pathname === '/' && location.hash === path;
    }
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname === path;
  };

  // Handle profile navigation
  const handleProfileClick = () => {
    navigate("/profile");
    setShowDropdown(false);
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    setShowDropdown(false);
  };
  
  // Handle clicking outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full px-2 md:px-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
      scrolled && "shadow-sm"
    )}>
      <div className="container flex h-14 items-center justify-between">
        {/* Logo */}
        <div className="flex-shrink-0">
          {/* Render different links based on authentication status */}
          {isAuthenticated ? (
            <Link to="/home" className="flex items-center space-x-2">
              <span className="font-bold text-xl">
                BodyMind AI
              </span>
            </Link>
          ) : (
            <Link to="/" className="flex items-center space-x-2">
              <span className="font-bold text-xl">
                BodyMind AI
              </span>
            </Link>
          )}
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex flex-1 justify-center">
          {isAuthenticated ? (
            <NavigationMenu>
              <NavigationMenuList className="gap-6">
                {/* Workout Section */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="flex items-center">
                    <Dumbbell className="w-4 h-4 mr-2" />
                    Workout
                    <ChevronDown className="w-4 h-4 ml-1" />
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="absolute left-1/2 -translate-x-1/2">
                    <div className="grid w-[200px] gap-2 p-2">
                      {workoutNavItems.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          className="flex items-center p-2 rounded-md hover:bg-accent"
                        >
                          {item.icon}
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Nutrition Section */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="flex items-center">
                    <Flame className="w-4 h-4 mr-2" />
                    Nutrition
                    <ChevronDown className="w-4 h-4 ml-1" />
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="absolute left-1/2 -translate-x-1/2">
                    <div className="grid w-[200px] gap-2 p-2">
                      {nutritionNavItems.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          className="flex items-center p-2 rounded-md hover:bg-accent"
                        >
                          {item.icon}
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* AI Tools Section */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="flex items-center">
                    <Brain className="w-4 h-4 mr-2" />
                    AI Tools
                    <ChevronDown className="w-4 h-4 ml-1" />
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="absolute left-1/2 -translate-x-1/2">
                    <div className="grid w-[200px] gap-2 p-2">
                      {aiNavItems.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          className="flex items-center p-2 rounded-md hover:bg-accent"
                        >
                          {item.icon}
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Subscription */}
                <NavigationMenuItem>
                  <Link to="/subscription" className="flex items-center">
                    <Zap className="w-4 h-4 mr-2" />
                    Subscription
                  </Link>
                </NavigationMenuItem>

                {/* Role-specific items */}
                {user?.role === 'ADMIN' && adminNavItems.map((item) => (
                  <NavigationMenuItem key={item.path}>
                    <Link to={item.path} className="flex items-center">
                      {item.icon}
                      {item.label}
                    </Link>
                  </NavigationMenuItem>
                ))}
                {user?.role === 'TRAINER' && trainerNavItems.map((item) => (
                  <NavigationMenuItem key={item.path}>
                    <Link to={item.path} className="flex items-center">
                      {item.icon}
                      {item.label}
                    </Link>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          ) : (
            <NavigationMenu>
              <NavigationMenuList className="gap-6">
                {navItems.map((item) => (
                  <NavigationMenuItem key={item.path}>
                    <Link to={item.path} className="flex items-center">
                      {item.icon}
                      {item.label}
                    </Link>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          )}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle - Hidden on mobile */}
          <div className="hidden md:block">
            <ThemeToggle />
          </div>
          {isAuthenticated ? (
            <div className="relative hidden md:block" ref={dropdownRef}>
              <div className="flex items-center gap-2">
                {isPremium && (
                  <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 flex items-center gap-1">
                    <Zap className="h-3 w-3" />
                    Premium
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
                  </Avatar>
                </Button>
              </div>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-background border">
                  <div className="py-1">
                    <button
                      className="w-full text-left px-4 py-2 text-sm hover:bg-accent"
                      onClick={handleProfileClick}
                    >
                      Profile
                    </button>
                    <button
                      className="w-full text-left px-4 py-2 text-sm hover:bg-accent"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link to="/register">
                <Button>Sign Up</Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="mt-6 flex flex-col gap-4">
                {isAuthenticated ? (
                  <>
                    {/* User Profile Section - Mobile Only */}
                    <div className="md:hidden flex items-center gap-3 p-2 border-b">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user?.avatar} alt={user?.name} />
                        <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          {user?.name}
                          {isPremium && (
                            <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 flex items-center gap-1">
                              <Zap className="h-3 w-3" />
                              Premium
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">{user?.email}</div>
                      </div>
                    </div>

                    {/* Workout Section */}
                    <div className="space-y-2">
                      <div className="flex items-center p-2">
                        <Dumbbell className="w-4 h-4" />
                        <span className="ml-2 font-medium">Workout</span>
                      </div>
                      {workoutNavItems.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          className="flex items-center p-2 pl-6 rounded-md hover:bg-accent"
                        >
                          {item.icon}
                          <span className="ml-2">{item.label}</span>
                        </Link>
                      ))}
                    </div>

                    {/* Nutrition Section */}
                    <div className="space-y-2">
                      <div className="flex items-center p-2">
                        <Flame className="w-4 h-4" />
                        <span className="ml-2 font-medium">Nutrition</span>
                      </div>
                      {nutritionNavItems.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          className="flex items-center p-2 pl-6 rounded-md hover:bg-accent"
                        >
                          {item.icon}
                          <span className="ml-2">{item.label}</span>
                        </Link>
                      ))}
                    </div>

                    {/* AI Tools Section */}
                    <div className="space-y-2">
                      <div className="flex items-center p-2">
                        <Brain className="w-4 h-4" />
                        <span className="ml-2 font-medium">AI Tools</span>
                      </div>
                      {aiNavItems.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          className="flex items-center p-2 pl-6 rounded-md hover:bg-accent"
                        >
                          {item.icon}
                          <span className="ml-2">{item.label}</span>
                        </Link>
                      ))}
                    </div>

                    {/* Subscription */}
                    <Link
                      to="/subscription"
                      className="flex items-center p-2 rounded-md hover:bg-accent"
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      <span className="ml-2">Subscription</span>
                    </Link>

                    {/* Role-specific items */}
                    {user?.role === 'ADMIN' && adminNavItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className="flex items-center p-2 rounded-md hover:bg-accent"
                      >
                        {item.icon}
                        <span className="ml-2">{item.label}</span>
                      </Link>
                    ))}
                    {user?.role === 'TRAINER' && trainerNavItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className="flex items-center p-2 rounded-md hover:bg-accent"
                      >
                        {item.icon}
                        <span className="ml-2">{item.label}</span>
                      </Link>
                    ))}

                    {/* Mobile-only Profile and Logout */}
                    <div className="md:hidden space-y-2 border-t pt-2">
                      <button
                        className="w-full flex items-center p-2 rounded-md hover:bg-accent"
                        onClick={handleProfileClick}
                      >
                        <User className="w-4 h-4" />
                        <span className="ml-2">Profile</span>
                      </button>
                      <button
                        className="w-full flex items-center p-2 rounded-md hover:bg-accent text-destructive"
                        onClick={handleLogout}
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="ml-2">Logout</span>
                      </button>
                    </div>
                  </>
                ) : (
                  navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className="flex items-center p-2 rounded-md hover:bg-accent"
                    >
                      {item.icon}
                      <span className="ml-2">{item.label}</span>
                    </Link>
                  ))
                )}
              </div>
              <SheetFooter className="mt-6">
                {!isAuthenticated && (
                  <div className="flex flex-col gap-2 w-full">
                    <Link to="/login" className="w-full">
                      <Button variant="outline" className="w-full">Login</Button>
                    </Link>
                    <Link to="/register" className="w-full">
                      <Button className="w-full">Sign Up</Button>
                    </Link>
                  </div>
                )}
                {/* Theme Toggle - Mobile Only */}
                <div className="md:hidden w-full pt-4 border-t">
                  <div className="flex items-center justify-between p-2">
                    <span className="text-sm">Theme</span>
                    <ThemeToggle />
                  </div>
                </div>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
