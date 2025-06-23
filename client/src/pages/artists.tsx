import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Star, 
  MapPin, 
  Palette, 
  ShoppingBag, 
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import type { Artist } from '@shared/schema';

export default function Artists() {
  const { data: artists = [], isLoading } = useQuery<Artist[]>({
    queryKey: ['/api/artists'],
  });

  const { data: featuredArtist } = useQuery<Artist>({
    queryKey: ['/api/artists/featured/current'],
  });

  const previousArtists = artists.filter(artist => !artist.featured);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-canvasco-secondary py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-200 rounded w-64 mb-8"></div>
            <div className="h-96 bg-gray-200 rounded-3xl mb-12"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded-2xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvasco-secondary py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-canvasco-primary mb-4">
            Weekly Artist Spotlight
          </h1>
          <p className="text-xl text-canvasco-neutral max-w-2xl mx-auto">
            Meet the talented artists behind our beautiful designs and learn their inspiring stories
          </p>
        </div>

        {/* Featured Artist */}
        {featuredArtist && (
          <div className="bg-gradient-to-r from-canvasco-primary to-canvasco-accent rounded-3xl overflow-hidden shadow-2xl mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-8 lg:p-12 text-white">
                <div className="mb-6">
                  <Badge className="bg-white/20 text-white border-white/30">
                    This Week's Featured Artist
                  </Badge>
                </div>
                
                <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                  {featuredArtist.name}
                </h2>
                
                <p className="text-lg mb-6 opacity-90 leading-relaxed">
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
                  
                  {featuredArtist.website && (
                    <Button 
                      variant="outline" 
                      className="border-white text-white hover:bg-white hover:text-canvasco-primary"
                      asChild
                    >
                      <a href={featuredArtist.website} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Visit Website
                      </a>
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="relative">
                <img 
                  src={featuredArtist.image} 
                  alt={`Featured artist ${featuredArtist.name}`} 
                  className="w-full h-full object-cover lg:h-auto lg:min-h-full"
                />
                <div className="absolute bottom-4 right-4 bg-white/90 text-canvasco-primary px-4 py-2 rounded-full font-semibold">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    Featured Artist
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Previous Artists Grid */}
        {previousArtists.length > 0 && (
          <div className="mb-12">
            <h2 className="font-display text-2xl font-bold text-canvasco-primary mb-8 text-center">
              Previous Featured Artists
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {previousArtists.map((artist) => (
                <Card 
                  key={artist.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="relative">
                    <img 
                      src={artist.image} 
                      alt={`Artist ${artist.name}`} 
                      className="w-full h-48 object-cover"
                    />
                    {artist.featuredWeek && (
                      <div className="absolute bottom-4 left-4 bg-white/90 text-canvasco-primary px-3 py-1 rounded-full text-sm font-semibold">
                        Week {artist.featuredWeek}
                      </div>
                    )}
                  </div>
                  
                  <CardContent className="p-6">
                    <h3 className="font-display text-xl font-semibold text-canvasco-primary mb-2">
                      {artist.name}
                    </h3>
                    
                    <div className="flex items-center gap-2 text-canvasco-neutral mb-3">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{artist.location}</span>
                    </div>
                    
                    <p className="text-canvasco-neutral text-sm mb-4 line-clamp-3">
                      {artist.bio}
                    </p>
                    
                    <div className="flex items-center gap-2 text-canvasco-accent mb-4">
                      <Palette className="h-4 w-4" />
                      <span className="text-sm font-semibold">{artist.style}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-canvasco-primary hover:bg-canvasco-primary hover:text-white"
                        asChild
                      >
                        <Link href={`/products?artist=${artist.id}`}>
                          View Bags
                        </Link>
                      </Button>
                      
                      {artist.website && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-canvasco-accent hover:text-canvasco-primary"
                          asChild
                        >
                          <a href={artist.website} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center bg-white rounded-3xl p-8 lg:p-12 shadow-lg">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-canvasco-primary mb-4">
            Want to be Featured?
          </h2>
          <p className="text-canvasco-neutral mb-8 max-w-2xl mx-auto">
            We're always looking for talented emerging artists to feature. If you create original artwork 
            and are passionate about sustainability, we'd love to hear from you.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-canvasco-primary hover:bg-canvasco-primary/90 text-white"
            >
              Apply to be Featured
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="border-canvasco-primary text-canvasco-primary hover:bg-canvasco-primary hover:text-white"
              asChild
            >
              <Link href="/products">
                Shop All Designs
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
