import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useCart } from '@/hooks/use-cart';
import { Palette, Menu, ShoppingBag } from 'lucide-react';

export default function Header() {
  const [location] = useLocation();
  const { itemCount, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/' && location === '/') return true;
    return location.startsWith(path) && path !== '/';
  };

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/products', label: 'Shop' },
    { path: '/artists', label: 'Artists' },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <Palette className="text-canvasco-primary text-2xl" />
            <span className="font-display font-bold text-xl text-canvasco-primary">CanvasCo</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`transition-colors ${
                  isActive(item.path)
                    ? 'text-canvasco-primary font-medium'
                    : 'text-canvasco-neutral hover:text-canvasco-primary'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Cart and Mobile Menu */}
          <div className="flex items-center space-x-4">
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
