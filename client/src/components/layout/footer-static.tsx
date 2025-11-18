import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Instagram, Facebook, Twitter, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <>
      {/* CTA Section */}
      <section className="py-16 bg-canvasco-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Mail className="mx-auto h-12 w-12 text-canvasco-accent mb-6" />
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Interested in Our Tote Bags?</h2>
          <p className="text-xl mb-8 opacity-90">
            Contact us via Instagram or email to learn more about our artist-designed collections
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              className="bg-canvasco-accent hover:bg-canvasco-accent/90 text-white font-semibold"
              asChild
            >
              <a href="https://www.instagram.com/mecenas.totes/" target="_blank" rel="noopener noreferrer">
                <Instagram className="h-4 w-4 mr-2" />
                Follow on Instagram
              </a>
            </Button>
            <Button
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-canvasco-primary font-semibold"
              asChild
            >
              <a href="mailto:cerrochen02@gmail.com">
                <Mail className="h-4 w-4 mr-2" />
                Email Us
              </a>
            </Button>
          </div>
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
                <Button variant="ghost" size="icon" className="text-gray-300 hover:text-canvasco-accent" asChild>
                  <a href="https://www.instagram.com/mecenas.totes/" target="_blank" rel="noopener noreferrer">
                    <Instagram className="h-5 w-5" />
                  </a>
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
                  <Link href="/products" className="text-gray-300 hover:text-white transition-colors">
                    Available Now
                  </Link>
                </li>
                <li>
                  <Link href="/products" className="text-gray-300 hover:text-white transition-colors">
                    Coming Soon
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
                  <a href="mailto:cerrochen02@gmail.com" className="text-gray-300 hover:text-white transition-colors">
                    Apply to Feature
                  </a>
                </li>
                <li>
                  <Link href="/artists" className="text-gray-300 hover:text-white transition-colors">
                    Artist Stories
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-display font-semibold text-lg mb-4">Contact</h4>
              <ul className="space-y-2">
                <li>
                  <a href="mailto:cerrochen02@gmail.com" className="text-gray-300 hover:text-white transition-colors">
                    Email Us
                  </a>
                </li>
                <li>
                  <a href="https://www.instagram.com/mecenas.totes/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                    Instagram
                  </a>
                </li>
                <li>
                  <span className="text-gray-300">
                    Sustainability Info
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Mecenas Totes. Supporting emerging artists through sustainable fashion.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
