import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Leaf, Palette, Star } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-canvasco-secondary">
      {/* Hero Section */}
      <section className="relative bg-canvasco-primary text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img 
            src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=1080" 
            alt="Sustainable fashion background" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Art Meets <span className="text-canvasco-accent">Sustainability</span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90 leading-relaxed">
                Discover unique eco-friendly tote bags featuring artwork from emerging artists. 
                Every purchase supports both the planet and creative talent.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button 
                  size="lg"
                  className="bg-canvasco-accent hover:bg-canvasco-accent/90 text-white px-8 py-4 text-lg font-semibold transform hover:scale-105 transition-all"
                  asChild
                >
                  <Link href="/products">Shop Collection</Link>
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-2 border-canvasco-accent bg-canvasco-accent hover:bg-canvasco-accent/90 text-canvasco-primary hover:text-white px-8 py-4 text-lg font-semibold"
                  asChild
                >
                  <Link href="/artists">Meet Our Artists</Link>
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Eco-friendly tote bags with artistic designs" 
                className="rounded-3xl shadow-2xl w-full"
              />
              <div className="absolute -bottom-6 -left-6 bg-canvasco-accent text-white p-6 rounded-2xl shadow-xl">
                <div className="text-2xl font-bold">100%</div>
                <div className="text-sm opacity-90">Sustainable</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-canvasco-primary mb-4">
              Why Choose CanvasCo?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              More than just accessories - we're building a sustainable future for fashion and art
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-8 border-canvasco-primary/20 hover:border-canvasco-primary/40 transition-colors">
              <CardContent className="pt-6">
                <Leaf className="h-12 w-12 text-canvasco-accent mx-auto mb-4" />
                <h3 className="font-display text-xl font-semibold mb-3 text-canvasco-primary">
                  Eco-Friendly Materials
                </h3>
                <p className="text-gray-600">
                  Made from 100% organic cotton and recycled materials, reducing environmental impact
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center p-8 border-canvasco-primary/20 hover:border-canvasco-primary/40 transition-colors">
              <CardContent className="pt-6">
                <Palette className="h-12 w-12 text-canvasco-accent mx-auto mb-4" />
                <h3 className="font-display text-xl font-semibold mb-3 text-canvasco-primary">
                  Artist Support
                </h3>
                <p className="text-gray-600">
                  Direct support to emerging artists through fair compensation and exposure
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center p-8 border-canvasco-primary/20 hover:border-canvasco-primary/40 transition-colors">
              <CardContent className="pt-6">
                <Star className="h-12 w-12 text-canvasco-accent mx-auto mb-4" />
                <h3 className="font-display text-xl font-semibold mb-3 text-canvasco-primary">
                  Unique Designs
                </h3>
                <p className="text-gray-600">
                  Limited edition artwork ensuring your bag is as unique as you are
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Call to Action */}
          <div className="text-center mt-16">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-canvasco-accent hover:bg-canvasco-accent/90 text-white px-8 py-4 text-lg font-semibold"
                asChild
              >
                <Link href="/products">Browse Collection</Link>
              </Button>
              <Button 
                variant="outline"
                size="lg"
                className="border-canvasco-primary text-canvasco-primary hover:bg-canvasco-primary hover:text-white px-8 py-4 text-lg font-semibold"
                asChild
              >
                <Link href="/artists">Meet Artists</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-canvasco-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Stay Connected
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Get updates on new artists, exclusive collections, and sustainability initiatives
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-black"
            />
            <Button 
              className="bg-canvasco-accent hover:bg-canvasco-accent/90 text-white px-6 py-3"
            >
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}