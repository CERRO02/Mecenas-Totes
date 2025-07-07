import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useCart } from '@/hooks/use-cart';
import { useAuth } from '@/hooks/useAuth';
import { Palette, Menu, ShoppingBag, User, LogOut } from 'lucide-react';

export default function Header() {
  const [location] = useLocation();
  const { itemCount, setIsCartOpen } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/' && location === '/') return true;
    return location.startsWith(path) && path !== '/';
  };

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/artists', label: 'Artists' },
    { path: '/products', label: 'Shop' },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-[100]">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <img 
              src={new URL("@assets/image_1751684169303.png", import.meta.url).href} 
              alt="Mecenas Totes Logo" 
              className="h-8 w-8 object-contain"
            />
            <span className="font-logo font-bold text-xl text-canvasco-primary">Mecenas Totes</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`transition-colors cursor-pointer select-none relative z-10 px-2 py-1 ${
                  isActive(item.path)
                    ? 'text-canvasco-primary font-medium'
                    : 'text-canvasco-neutral hover:text-canvasco-primary'
                }`}
                style={{ pointerEvents: 'auto' }}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Cart, User Menu and Mobile Menu */}
          <div className="flex items-center space-x-4">
            {/* Cart Button */}
            <Button
              variant="ghost"
              size="icon"
              className="relative p-2 text-canvasco-neutral hover:text-canvasco-primary transition-colors"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingBag className="h-6 w-6" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-canvasco-accent text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Button>

            {/* User Menu */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 text-canvasco-neutral hover:text-canvasco-primary">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={user?.profileImageUrl || ""} alt={user?.firstName || "User"} />
                      <AvatarFallback className="bg-canvasco-primary text-white text-xs">
                        {user?.firstName?.[0] || user?.email?.[0]?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden md:inline">
                      {user?.firstName || user?.email?.split('@')[0] || "Profile"}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <User className="h-4 w-4 mr-2" />
                      Profile & Orders
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => window.location.href = "/api/logout"}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" onClick={() => window.location.href = "/api/login"}>
                Login
              </Button>
            )}

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-4 mt-8">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      href={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block px-4 py-2 text-lg transition-colors ${
                        isActive(item.path)
                          ? 'text-canvasco-primary font-medium'
                          : 'text-canvasco-neutral hover:text-canvasco-primary hover:bg-gray-50'
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  );
}
