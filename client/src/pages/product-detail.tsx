import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  QrCode, 
  Truck, 
  RotateCcw, 
  Shield, 
  Leaf, 
  Palette,
  MapPin,
  ExternalLink
} from 'lucide-react';
import type { ProductWithArtist } from '@shared/schema';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const { data: product, isLoading, error } = useQuery<ProductWithArtist>({
    queryKey: ['/api/products', id],
    queryFn: async () => {
      const response = await fetch(`/api/products/${id}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Product not found');
        }
        throw new Error('Failed to fetch product');
      }
      return response.json();
    },
    enabled: !!id,
  });

  const handleAddToCart = async () => {
    if (!product) return;
    
    try {
      await addToCart(product.id);
      toast({
        title: 'Added to cart!',
        description: `${product.name} has been added to your cart.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add item to cart. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-canvasco-secondary py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-32 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="h-96 bg-gray-200 rounded-2xl"></div>
              <div className="space-y-6">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-12 bg-gray-200 rounded w-32"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-canvasco-secondary py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold text-canvasco-primary mb-4">
              {error?.message || 'Product not found'}
            </h1>
            <Button asChild>
              <Link href="/products">Back to Products</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const currentPrice = parseFloat(product.salePrice || product.price);
  const originalPrice = product.salePrice ? parseFloat(product.price) : null;
  const isOnSale = !!product.salePrice;
  const savings = originalPrice ? originalPrice - currentPrice : 0;

  return (
    <div className="min-h-screen bg-canvasco-secondary py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="text-canvasco-neutral hover:text-canvasco-primary">
            <Link href="/products">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Products
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="relative">
            {/* Main Image */}
            <div className="aspect-square bg-white rounded-2xl shadow-lg overflow-hidden mb-4">
              <img
                src={product.images && product.images.length > 0 ? product.images[selectedImageIndex] : product.image}
                alt={product.name}
                className="w-full h-full object-contain bg-gray-50"
              />
            </div>
            
            {/* Thumbnail Gallery - Show only if multiple images */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 justify-center">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      index === selectedImageIndex 
                        ? 'border-canvasco-primary shadow-md' 
                        : 'border-gray-200 hover:border-canvasco-accent'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} view ${index + 1}`}
                      className="w-full h-full object-contain bg-gray-50"
                    />
                  </button>
                ))}
              </div>
            )}
            
            {/* Badges */}
            <div className="absolute top-4 right-4 flex flex-col gap-2">
              {product.featured && (
                <Badge className="bg-canvasco-primary text-white">
                  Featured
                </Badge>
              )}
              {isOnSale && (
                <Badge variant="destructive">
                  Sale
                </Badge>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Artist Info */}
            <div className="flex items-center gap-3">
              <img
                src={product.artist.image ?? undefined}
                alt={product.artist.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className="text-canvasco-accent font-semibold">
                  by {product.artist.name}
                </p>
                <div className="flex items-center gap-2 text-sm text-canvasco-neutral">
                  <MapPin className="h-3 w-3" />
                  {product.artist.location}
                </div>
              </div>
            </div>

            {/* Product Title */}
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-canvasco-primary mb-2">
                {product.name}
              </h1>
              <div className="flex items-center gap-2">
                <QrCode className="h-5 w-5 text-canvasco-neutral" />
                <span className="text-canvasco-neutral">Includes QR code to artist's portfolio</span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4">
              <span className="text-4xl font-bold text-canvasco-primary">
                ${currentPrice.toFixed(2)}
              </span>
              {originalPrice && (
                <div className="flex flex-col">
                  <span className="text-xl text-canvasco-neutral line-through">
                    ${originalPrice.toFixed(2)}
                  </span>
                  <span className="text-sm text-green-600 font-semibold">
                    Save ${savings.toFixed(2)}
                  </span>
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold text-canvasco-primary mb-2">Description</h3>
              <p className="text-canvasco-neutral leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Artist Style */}
            <div className="flex items-center gap-2 text-canvasco-neutral">
              <Palette className="h-4 w-4" />
              <span>Style: {product.artist.style}</span>
            </div>

            {/* Add to Cart or Coming Soon */}
            <div className="flex flex-col sm:flex-row gap-4">
              {product.availability === "available" ? (
                <Button
                  onClick={handleAddToCart}
                  size="lg"
                  className="flex-1 bg-canvasco-primary hover:bg-canvasco-primary/90 text-white font-semibold"
                >
                  Add to Cart - ${currentPrice.toFixed(2)}
                </Button>
              ) : (
                <Button
                  size="lg"
                  disabled
                  className="flex-1 bg-gray-400 text-white font-semibold cursor-not-allowed"
                >
                  Coming Soon
                </Button>
              )}
              <Button
                variant="outline"
                size="lg"
                className="border-canvasco-primary text-canvasco-primary hover:bg-canvasco-primary hover:text-white"
                asChild
              >
                <Link href={`/artists`}>
                  View Artist Profile
                </Link>
              </Button>
            </div>

            {/* Product Features */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-canvasco-primary mb-4">Product Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Leaf className="h-5 w-5 text-green-600" />
                    <span className="text-sm">100% Organic Cotton</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <QrCode className="h-5 w-5 text-canvasco-accent" />
                    <span className="text-sm">QR Code to Artist</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-blue-600" />
                    <span className="text-sm">Eco-Friendly Dyes</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Palette className="h-5 w-5 text-purple-600" />
                    <span className="text-sm">Original Artwork</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipping & Returns */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-canvasco-primary mb-4">Shipping & Returns</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Truck className="h-5 w-5 text-canvasco-accent" />
                    <span className="text-sm">Free shipping on orders over $50</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <RotateCcw className="h-5 w-5 text-canvasco-accent" />
                    <span className="text-sm">30-day returns accepted</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-canvasco-accent" />
                    <span className="text-sm">Satisfaction guaranteed</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Artist Bio Section */}
        <Separator className="my-12" />
        
        <Card className="bg-white">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1">
                <img
                  src={product.artist.image ?? undefined}
                  alt={product.artist.name}
                  className="w-full aspect-square object-cover rounded-2xl"
                />
              </div>
              <div className="md:col-span-2 space-y-4">
                <div>
                  <h3 className="font-display text-2xl font-bold text-canvasco-primary mb-2">
                    About {product.artist.name}
                  </h3>
                  <div className="flex items-center gap-2 text-canvasco-neutral mb-4">
                    <MapPin className="h-4 w-4" />
                    {product.artist.location}
                  </div>
                </div>
                
                <p className="text-canvasco-neutral leading-relaxed">
                  {product.artist.bio}
                </p>
                
                <div className="flex items-center gap-2 text-canvasco-accent">
                  <Palette className="h-4 w-4" />
                  <span className="font-semibold">Style: {product.artist.style}</span>
                </div>
                
                {product.artist.website && (
                  <Button variant="outline" asChild>
                    <a href={product.artist.website} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Visit Artist's Website
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
