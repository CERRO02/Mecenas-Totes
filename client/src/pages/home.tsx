import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ProductCard from '@/components/product-card';
import { ArrowRight, Leaf, Palette, MapPin, ShoppingBag, Star } from 'lucide-react';
import type { ProductWithArtist, Artist } from '@shared/schema';

export default function Home() {
  const { data: featuredProducts = [] } = useQuery<ProductWithArtist[]>({
    queryKey: ['/api/products/featured'],
  });

  const { data: featuredArtist } = useQuery<Artist>({
    queryKey: ['/api/artists/featured/current'],
  });

  const scrollToProducts = () => {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-canvasco-secondary">
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
                  onClick={scrollToProducts}
                  size="lg"
                  className="bg-canvasco-accent hover:bg-canvasco-accent/90 text-white px-8 py-4 text-lg font-semibold transform hover:scale-105 transition-all"
                >
                  Shop Collection
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-2 border-white hover:bg-white hover:text-canvasco-primary text-white px-8 py-4 text-lg font-semibold"
                  asChild
                >
                  <Link href="/artists">Meet Our Artists</Link>
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=800" 
                alt="Eco-friendly tote bag with artistic design" 
                className="rounded-2xl shadow-2xl w-full max-w-md mx-auto transform rotate-3 hover:rotate-0 transition-transform duration-500"
              />
              <div className="absolute -bottom-4 -right-4 bg-canvasco-accent text-white px-4 py-2 rounded-full font-semibold shadow-lg">
                QR Code Inside!
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section id="products" className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-canvasco-primary mb-4">
              Featured Collection
            </h2>
            <p className="text-xl text-canvasco-neutral max-w-2xl mx-auto">
              Each bag tells a story through art while supporting sustainable practices and emerging artists
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Button 
              size="lg"
              className="bg-canvasco-accent hover:bg-canvasco-accent/90 text-white px-8 py-4 text-lg font-semibold"
              asChild
            >
              <Link href="/products">View All Products</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Artist Spotlight Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-canvasco-primary mb-4">
              Weekly Artist Spotlight
            </h2>
            <p className="text-xl text-canvasco-neutral max-w-2xl mx-auto">
              Meet the talented artists behind our beautiful designs and learn their inspiring stories
            </p>
          </div>

          {featuredArtist && (
            <div className="bg-gradient-to-r from-canvasco-primary to-canvasco-accent rounded-3xl overflow-hidden shadow-2xl mb-12">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="p-8 lg:p-12 text-white">
                  <div className="mb-6">
                    <Badge className="bg-white/20 text-white border-white/30">
                      This Week's Featured Artist
                    </Badge>
                  </div>
                  <h3 className="font-display text-3xl md:text-4xl font-bold mb-4">
                    {featuredArtist.name}
                  </h3>
                  <p className="text-lg mb-6 opacity-90">
                    {featuredArtist.bio}
                  </p>
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-5 w-5 text-canvasco-accent" />
                      <span>{featuredArtist.location}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Palette className="h-5 w-5 text-canvasco-accent" />
                      <span>{featuredArtist.style}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <ShoppingBag className="h-5 w-5 text-canvasco-accent" />
                      <span>Multiple Designs Available</span>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button 
                      className="bg-white text-canvasco-primary hover:bg-white/90"
                      asChild
                    >
                      <Link href={`/products?artist=${featuredArtist.id}`}>
                        View Their Bags
                      </Link>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="border-white text-white hover:bg-white hover:text-canvasco-primary"
                      asChild
                    >
                      <Link href="/artists">Read Full Story</Link>
                    </Button>
                  </div>
                </div>
                <div className="relative">
                  <img 
                    src={featuredArtist.image} 
                    alt={`Featured artist ${featuredArtist.name}`} 
                    className="w-full h-full object-cover lg:h-auto lg:min-h-full"
                  />
                  <div className="absolute bottom-4 right-4 bg-white/90 text-canvasco-primary px-4 py-2 rounded-full font-semibold">
                    <span className="flex items-center gap-2">
                      <Star className="h-4 w-4" />
                      Featured Artist
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="text-center">
            <Button 
              size="lg"
              className="bg-canvasco-primary hover:bg-canvasco-primary/90 text-white px-8 py-4 text-lg font-semibold"
              asChild
            >
              <Link href="/artists">View All Featured Artists</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-canvasco-secondary to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-canvasco-primary mb-4">
              Our Mission
            </h2>
            <p className="text-xl text-canvasco-neutral max-w-3xl mx-auto">
              Supporting emerging artists while promoting sustainable fashion through high-quality, eco-friendly tote bags
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <img 
                src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
                alt="Sustainable fashion production workshop" 
                className="rounded-2xl shadow-lg w-full"
              />
            </div>
            <div>
              <h3 className="font-display text-2xl md:text-3xl font-bold text-canvasco-primary mb-6">
                Sustainability Meets Artistry
              </h3>
              <p className="text-lg text-canvasco-neutral mb-6 leading-relaxed">
                Every CanvasCo bag is crafted from 100% organic cotton using eco-friendly dyes and 
                sustainable production methods. We believe beautiful art and environmental responsibility 
                go hand in hand.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="bg-canvasco-primary text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Leaf className="h-8 w-8" />
                  </div>
                  <h4 className="font-semibold text-canvasco-primary mb-2">100% Organic</h4>
                  <p className="text-sm text-canvasco-neutral">Certified organic cotton from sustainable farms</p>
                </div>
                <div className="text-center">
                  <div className="bg-canvasco-accent text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Palette className="h-8 w-8" />
                  </div>
                  <h4 className="font-semibold text-canvasco-primary mb-2">Artist-First</h4>
                  <p className="text-sm text-canvasco-neutral">50% of profits go directly to featured artists</p>
                </div>
              </div>
            </div>
          </div>

          {/* Impact Stats */}
          <Card className="bg-white shadow-xl">
            <CardContent className="p-8 lg:p-12">
              <h3 className="font-display text-2xl md:text-3xl font-bold text-center text-canvasco-primary mb-12">
                Our Impact
              </h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                <div>
                  <div className="text-3xl md:text-4xl font-bold text-canvasco-accent mb-2">150+</div>
                  <div className="text-canvasco-neutral font-semibold">Artists Supported</div>
                </div>
                <div>
                  <div className="text-3xl md:text-4xl font-bold text-canvasco-accent mb-2">12,000+</div>
                  <div className="text-canvasco-neutral font-semibold">Bags Sold</div>
                </div>
                <div>
                  <div className="text-3xl md:text-4xl font-bold text-canvasco-accent mb-2">5.2 tons</div>
                  <div className="text-canvasco-neutral font-semibold">CO₂ Saved</div>
                </div>
                <div>
                  <div className="text-3xl md:text-4xl font-bold text-canvasco-accent mb-2">25</div>
                  <div className="text-canvasco-neutral font-semibold">Countries Reached</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
