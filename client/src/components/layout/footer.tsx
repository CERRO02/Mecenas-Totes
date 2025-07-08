import { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Palette, Mail, Instagram, Facebook, Twitter } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const { toast } = useToast();

  const subscribeToNewsletter = useMutation({
    mutationFn: async (email: string) => {
      const response = await apiRequest('POST', '/api/newsletter/subscribe', { email });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Successfully subscribed!',
        description: 'Thank you for subscribing to our newsletter.',
      });
      setEmail('');
    },
    onError: (error: any) => {
      toast({
        title: 'Subscription failed',
        description: error.message || 'Failed to subscribe to newsletter',
        variant: 'destructive',
      });
    },
  });

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    subscribeToNewsletter.mutate(email);
  };

  return (
    <>
      {/* Newsletter Section */}
      <section className="py-16 bg-canvasco-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Mail className="mx-auto h-12 w-12 text-canvasco-accent mb-6" />
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Stay in the Loop</h2>
          <p className="text-xl mb-8 opacity-90">
            Get updates on new artists, exclusive collections, and sustainability stories
          </p>
          
          <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/70 focus:bg-white/20"
                required
              />
              <Button
                type="submit"
                disabled={subscribeToNewsletter.isPending}
                className="bg-canvasco-accent hover:bg-canvasco-accent/90 text-white font-semibold"
              >
                {subscribeToNewsletter.isPending ? 'Subscribing...' : 'Subscribe'}
              </Button>
            </div>
          </form>
          
          <p className="text-sm opacity-75 mt-4">
            No spam, just beautiful art and positive impact stories
          </p>
        </div>
      </section>

      {/* Main Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Company Info */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <img 
                  src={new URL("@assets/image_1751684169303.png", import.meta.url).href} 
                  alt="Mecenas Totes Logo" 
                  className="h-8 w-8 object-contain"
                />
                <span className="font-logo font-bold text-xl">Mecenas Totes</span>
              </div>
              <p className="text-gray-300 mb-4">
                Connecting art, sustainability, and community through beautiful eco-friendly tote bags.
              </p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="icon" className="text-gray-300 hover:text-canvasco-accent">
                  <Instagram className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-gray-300 hover:text-canvasco-accent">
                  <Facebook className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-gray-300 hover:text-canvasco-accent">
                  <Twitter className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-display font-semibold text-lg mb-4">Shop</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/products" className="text-gray-300 hover:text-white transition-colors">
                    All Products
                  </Link>
                </li>
                <li>
                  <Link href="/products?featured=true" className="text-gray-300 hover:text-white transition-colors">
                    Featured Items
                  </Link>
                </li>
                <li>
                  <Link href="/products?sale=true" className="text-gray-300 hover:text-white transition-colors">
                    Sale Items
                  </Link>
                </li>
              </ul>
            </div>

            {/* Artists */}
            <div>
              <h4 className="font-display font-semibold text-lg mb-4">Artists</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/artists" className="text-gray-300 hover:text-white transition-colors">
                    Featured Artists
                  </Link>
                </li>
                <li>
                  <Link href="/artists#apply" className="text-gray-300 hover:text-white transition-colors">
                    Apply to Feature
                  </Link>
                </li>
                <li>
                  <Link href="/artists#stories" className="text-gray-300 hover:text-white transition-colors">
                    Artist Stories
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-display font-semibold text-lg mb-4">Support</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#contact" className="text-gray-300 hover:text-white transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#shipping" className="text-gray-300 hover:text-white transition-colors">
                    Shipping Info
                  </a>
                </li>
                <li>
                  <a href="#returns" className="text-gray-300 hover:text-white transition-colors">
                    Returns
                  </a>
                </li>
                <li>
                  <a href="#sustainability" className="text-gray-300 hover:text-white transition-colors">
                    Sustainability
                  </a>
                </li>
              </ul>
            </div>
          </div>


        </div>
      </footer>
    </>
  );
}
