import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ProductCard from '@/components/product-card';
import { Search, Filter, X } from 'lucide-react';
import type { ProductWithArtist, Artist } from '@shared/schema';

export default function Products() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.split('?')[1] || '');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedArtist, setSelectedArtist] = useState(searchParams.get('artist') || '');
  const [sortBy, setSortBy] = useState('name');

  const { data: products = [], isLoading } = useQuery<ProductWithArtist[]>({
    queryKey: ['/api/products', searchQuery, selectedArtist],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (selectedArtist) params.append('artist', selectedArtist);
      
      const response = await fetch(`/api/products?${params}`);
      if (!response.ok) throw new Error('Failed to fetch products');
      return response.json();
    },
  });

  const { data: artists = [] } = useQuery<Artist[]>({
    queryKey: ['/api/artists'],
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The query will automatically update due to the searchQuery dependency
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedArtist('');
    setSortBy('name');
  };

  // Sort products
  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return parseFloat(a.salePrice || a.price) - parseFloat(b.salePrice || b.price);
      case 'price-high':
        return parseFloat(b.salePrice || b.price) - parseFloat(a.salePrice || a.price);
      case 'artist':
        return a.artist.name.localeCompare(b.artist.name);
      default:
        return a.name.localeCompare(b.name);
    }
  });

  return (
    <div className="min-h-screen bg-canvasco-secondary py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-canvasco-primary mb-4">
            Our Collection
          </h1>
          <p className="text-xl text-canvasco-neutral">
            Discover eco-friendly tote bags featuring artwork from talented emerging artists
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-canvasco-neutral h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </form>

            {/* Artist Filter */}
            <Select value={selectedArtist} onValueChange={setSelectedArtist}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by artist" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Artists</SelectItem>
                {artists.map((artist) => (
                  <SelectItem key={artist.id} value={artist.id.toString()}>
                    {artist.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="artist">Artist</SelectItem>
              </SelectContent>
            </Select>

            {/* Clear Filters */}
            {(searchQuery || selectedArtist || sortBy !== 'name') && (
              <Button
                variant="outline"
                onClick={clearFilters}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Clear
              </Button>
            )}
          </div>

          {/* Active Filters */}
          <div className="flex flex-wrap gap-2">
            {searchQuery && (
              <span className="bg-canvasco-primary/10 text-canvasco-primary px-3 py-1 rounded-full text-sm">
                Search: "{searchQuery}"
              </span>
            )}
            {selectedArtist && (
              <span className="bg-canvasco-accent/10 text-canvasco-accent px-3 py-1 rounded-full text-sm">
                Artist: {artists.find(a => a.id.toString() === selectedArtist)?.name}
              </span>
            )}
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                <div className="h-64 bg-gray-200"></div>
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-6 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                    <div className="h-10 bg-gray-200 rounded w-24"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : sortedProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-canvasco-neutral text-xl mb-4">
              {searchQuery || selectedArtist ? 'No products found matching your criteria' : 'No products available'}
            </div>
            {(searchQuery || selectedArtist) && (
              <Button onClick={clearFilters} variant="outline">
                Clear filters
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <p className="text-canvasco-neutral">
                Showing {sortedProducts.length} product{sortedProducts.length !== 1 ? 's' : ''}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
