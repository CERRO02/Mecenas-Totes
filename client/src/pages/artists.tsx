import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { 
  MapPin, 
  Palette, 
  Instagram,
  Mail,
  ExternalLink
} from 'lucide-react';
import type { Artist } from '@shared/schema';

export default function Artists() {
  const { data: artists, isLoading } = useQuery<Artist[]>({
    queryKey: ['/api/artists'],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-8"></div>
            <div className="bg-gray-200 rounded-lg h-96"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!artists || artists.length === 0) {
    return (
      <div className="min-h-screen bg-white py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold text-canvasco-neutral">Artist information not available</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-canvasco-neutral mb-4">
            Our Artists
          </h1>
          <p className="text-lg text-canvasco-neutral/80">
            Meet the talented creators behind our sustainable designs
          </p>
        </div>

        {/* Artists Grid */}
        <div className="space-y-8">
          {artists.map((artist) => (
            <div key={artist.id} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
                {/* Photo Section */}
                <div className="relative">
                  <img 
                    src={artist.image} 
                    alt={`Artist ${artist.name}`} 
                    className="w-full h-48 md:h-64 object-cover rounded-lg"
                  />
                  {artist.featured && (
                    <div className="absolute top-2 right-2 bg-canvasco-primary text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Featured
                    </div>
                  )}
                </div>
                
                {/* Information Section */}
                <div className="md:col-span-2 space-y-4">
                  <div>
                    <h2 className="text-2xl font-bold text-canvasco-neutral mb-2">
                      {artist.name}
                    </h2>
                    
                    {/* Artist Details */}
                    <div className="flex flex-wrap gap-4 mb-4">
                      <div className="flex items-center space-x-2 text-canvasco-neutral/70">
                        <MapPin className="h-4 w-4 text-canvasco-accent" />
                        <span className="text-sm">{artist.location}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-canvasco-neutral/70">
                        <Palette className="h-4 w-4 text-canvasco-accent" />
                        <span className="text-sm">{artist.style}</span>
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  <div>
                    <p className="text-canvasco-neutral/80 text-sm leading-relaxed">
                      {artist.bio}
                    </p>
                  </div>

                  {/* Contact & Actions */}
                  <div className="flex flex-wrap gap-3 items-center">
                    {artist.website && (
                      <div className="flex items-center space-x-2 text-canvasco-neutral/70">
                        <Instagram className="h-4 w-4 text-canvasco-accent" />
                        <span className="text-sm">
                          {artist.name === 'Amy Ma' ? '@amy.art617' : 
                           artist.name === 'Emma Xu' ? '@lentil.beans.art' : 
                           artist.name === 'Alexis Zhang' ? '@azhang.artt' :
                           artist.name === 'Kimly Nguyen' ? '@kibblessssssss' :
                           artist.name === 'Angela Wang' ? '@alegnaaa.art' :
                           'Portfolio'}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2 text-canvasco-neutral/70">
                      <Mail className="h-4 w-4 text-canvasco-accent" />
                      <span className="text-sm">
                        {artist.name === 'Amy Ma' ? 'amymaz1hui@gmail.com' : 
                         artist.name === 'Emma Xu' ? 'emmaxu0513@gmail.com' : 
                         artist.name === 'Alexis Zhang' ? 'alexis.zhang2010@gmail.com' :
                         artist.name === 'Kimly Nguyen' ? 'kimlynguyen801@gmail.com' :
                         artist.name === 'Angela Wang' ? 'angelavveivvei@gmail.com' :
                         artist.name === 'Lucas Dai' ? 'lucasldai09@gmail.com' :
                         artist.name === 'Jeffrey Liu' ? 'Contact via Instagram' :
                         'Contact available'}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Button 
                      size="sm"
                      className="bg-canvasco-primary hover:bg-canvasco-primary/90 text-white"
                      asChild
                    >
                      <a href={`/products?artist=${artist.id}`}>
                        View Designs
                      </a>
                    </Button>
                    
                    {artist.website && (
                      <Button 
                        size="sm"
                        variant="outline" 
                        className="border-canvasco-primary text-canvasco-primary hover:bg-canvasco-primary hover:text-white"
                        asChild
                      >
                        <a href={artist.website} target="_blank" rel="noopener noreferrer">
                          <Instagram className="h-3 w-3 mr-1" />
                          Follow
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Supporting Artists Info */}
        <div className="mt-8 bg-gradient-to-r from-canvasco-primary/10 to-canvasco-accent/10 rounded-xl p-6 text-center">
          <h3 className="text-xl font-bold text-canvasco-neutral mb-3">
            Supporting Emerging Artists
          </h3>
          <p className="text-canvasco-neutral/80 max-w-2xl mx-auto">
            Mecenas Totes provides a platform for talented artists to showcase their work while promoting 
            sustainable fashion and meaningful storytelling.
          </p>
        </div>
      </div>
    </div>
  );
}