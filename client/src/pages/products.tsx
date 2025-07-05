import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ExternalLink, User, ShoppingBag } from "lucide-react";
import ProductCard from "@/components/product-card";
import { Button } from "@/components/ui/button";
import type { ProductWithArtist } from "@shared/schema";

export default function Products() {
  const { data: products, isLoading } = useQuery<ProductWithArtist[]>({
    queryKey: ["/api/products"],
  });



  if (isLoading) {
    return (
      <div className="min-h-screen bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="animate-spin w-8 h-8 border-4 border-canvasco-primary border-t-transparent rounded-full mx-auto" />
            <p className="mt-4 text-canvasco-neutral/70">Loading our beautiful tote bag collection...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-canvasco-primary/10 to-canvasco-accent/10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-canvasco-primary to-canvasco-accent rounded-full flex items-center justify-center">
            <ShoppingBag className="h-10 w-10 text-white" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-canvasco-neutral mb-6">
            Artist-Designed Tote Bags
          </h1>
          
          <p className="text-xl text-canvasco-neutral/70 mb-8 max-w-3xl mx-auto">
            Discover unique, eco-friendly tote bags featuring original artwork from emerging artists. 
            Every purchase directly supports creative talent and sustainable fashion.
          </p>

          <Link href="/artists">
            <Button variant="outline" className="mr-4">
              <User className="h-4 w-4 mr-2" />
              Meet Our Artists
            </Button>
          </Link>
        </div>
      </div>



      {/* Available Now - Products for Sale */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-canvasco-neutral mb-4">Available Now</h2>
            <p className="text-canvasco-neutral/70 max-w-2xl mx-auto">
              Purchase these beautiful artist-designed tote bags for $14.99 each
            </p>
          </div>
          
          {products && products.filter(p => p.availability === "available").length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.filter(p => p.availability === "available").map((product) => (
                <div key={product.id} className="group">
                  <ProductCard product={product} />
                  
                  {/* Artist Link */}
                  <div className="mt-3 text-center">
                    <Link href="/artists">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-canvasco-primary hover:text-canvasco-accent"
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        View {product.artist.name}'s Profile
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-canvasco-neutral/70">No products available for purchase at the moment.</p>
            </div>
          )}
        </div>
      </div>

      {/* Coming Soon - Products Not for Sale */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-canvasco-neutral mb-4">Coming Soon</h2>
            <p className="text-canvasco-neutral/70 max-w-2xl mx-auto">
              Beautiful designs in development - stay tuned for their release
            </p>
          </div>
          
          {products && products.filter(p => p.availability === "coming-soon").length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.filter(p => p.availability === "coming-soon").map((product) => (
                <div key={product.id} className="group relative">
                  <ProductCard product={product} showAddToCart={false} />
                  
                  {/* Coming Soon Overlay */}
                  <div className="absolute inset-0 bg-black/20 rounded-xl flex items-center justify-center pointer-events-none">
                    <div className="bg-white/90 px-4 py-2 rounded-lg shadow-lg">
                      <p className="text-canvasco-neutral font-semibold">Coming Soon</p>
                    </div>
                  </div>
                  
                  {/* Artist Link */}
                  <div className="mt-3 text-center">
                    <Link href="/artists">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-canvasco-primary hover:text-canvasco-accent"
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        View {product.artist.name}'s Profile
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      {/* Artist Support Section */}
      <div className="bg-canvasco-neutral text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Supporting Emerging Artists</h2>
          <p className="text-xl mb-8 opacity-90">
            Every tote bag purchase directly supports the artist who created the design. 
            We believe in empowering creative talent through sustainable fashion.
          </p>
          
          <Link href="/artists">
            <Button variant="secondary" size="lg">
              Discover Our Artists
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}