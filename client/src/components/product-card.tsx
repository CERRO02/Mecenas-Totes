import { Link } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/hooks/use-cart';
import { Eye, QrCode } from 'lucide-react';
import type { ProductWithArtist } from '@shared/schema';

interface ProductCardProps {
  product: ProductWithArtist;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product.id);
  };

  const currentPrice = parseFloat(product.salePrice || product.price);
  const originalPrice = product.salePrice ? parseFloat(product.price) : null;
  const isOnSale = !!product.salePrice;

  return (
    <Card className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
      <div className="relative">
        <Link href={`/products/${product.id}`}>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-64 object-contain bg-gray-50 group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
        
        {/* Badges */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          {product.featured && (
            <Badge className="bg-canvasco-primary text-white">
              New
            </Badge>
          )}
          {isOnSale && (
            <Badge variant="destructive">
              Sale
            </Badge>
          )}
        </div>

        {/* Quick View Button */}
        <Link href={`/products/${product.id}`}>
          <Button
            variant="ghost"
            size="icon"
            className="absolute inset-0 bg-black/0 group-hover:bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-none h-full w-full"
          >
            <Eye className="h-6 w-6 text-white" />
          </Button>
        </Link>
      </div>

      <CardContent className="p-6">
        <div className="flex items-center mb-2">
          <span className="text-sm text-canvasco-accent font-semibold">
            {product.artist.name}
          </span>
          <QrCode className="h-4 w-4 text-canvasco-neutral ml-2" />
        </div>
        
        <Link href={`/products/${product.id}`} className="group">
          <h3 className="font-display text-lg font-semibold text-canvasco-primary mb-2 group-hover:text-canvasco-accent transition-colors">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-canvasco-neutral text-sm mb-4 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xl text-canvasco-primary">
              ${currentPrice.toFixed(2)}
            </span>
            {originalPrice && (
              <span className="text-canvasco-neutral line-through text-sm">
                ${originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          
          <Button
            onClick={handleAddToCart}
            className="bg-canvasco-primary hover:bg-canvasco-primary/90 text-white font-semibold"
          >
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
