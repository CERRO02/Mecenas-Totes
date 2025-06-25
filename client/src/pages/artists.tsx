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
  const { data: amyMa, isLoading } = useQuery<Artist>({
    queryKey: ['/api/artists/featured/current'],
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

  if (!amyMa) {
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

        {/* Amy Ma Profile - Compact */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
            {/* Photo Section */}
            <div className="relative">
              <img 
                src={amyMa.image} 
                alt={`Artist ${amyMa.name}`} 
                className="w-full h-48 md:h-64 object-cover rounded-lg"
              />
              <div className="absolute top-2 right-2 bg-canvasco-primary text-white px-3 py-1 rounded-full text-sm font-semibold">
                Featured
              </div>
            </div>
            
            {/* Information Section */}
            <div className="md:col-span-2 space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-canvasco-neutral mb-2">
                  {amyMa.name}
                </h2>
                
                {/* Artist Details */}
                <div className="flex flex-wrap gap-4 mb-4">
                  <div className="flex items-center space-x-2 text-canvasco-neutral/70">
                    <MapPin className="h-4 w-4 text-canvasco-accent" />
                    <span className="text-sm">{amyMa.location}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-canvasco-neutral/70">
                    <Palette className="h-4 w-4 text-canvasco-accent" />
                    <span className="text-sm">{amyMa.style}</span>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div>
                <p className="text-canvasco-neutral/80 text-sm leading-relaxed line-clamp-4">
                  {amyMa.bio}
                </p>
              </div>

              {/* Contact & Actions */}
              <div className="flex flex-wrap gap-3 items-center">
                <div className="flex items-center space-x-2 text-canvasco-neutral/70">
                  <Instagram className="h-4 w-4 text-canvasco-accent" />
                  <span className="text-sm">@amy.art617</span>
                </div>
                <div className="flex items-center space-x-2 text-canvasco-neutral/70">
                  <Mail className="h-4 w-4 text-canvasco-accent" />
                  <span className="text-sm">amymaz1hui@gmail.com</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button 
                  size="sm"
                  className="bg-canvasco-primary hover:bg-canvasco-primary/90 text-white"
                  asChild
                >
                  <a href={`/products?artist=${amyMa.id}`}>
                    View Designs
                  </a>
                </Button>
                
                <Button 
                  size="sm"
                  variant="outline" 
                  className="border-canvasco-primary text-canvasco-primary hover:bg-canvasco-primary hover:text-white"
                  asChild
                >
                  <a href={amyMa.website} target="_blank" rel="noopener noreferrer">
                    <Instagram className="h-3 w-3 mr-1" />
                    Follow
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Artists Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-canvasco-neutral mb-6">More Artists Coming Soon</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Placeholder for future artists */}
            <div className="bg-gray-50 rounded-xl p-6 text-center border-2 border-dashed border-gray-200">
              <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <p className="text-gray-500 font-medium">Next Artist</p>
              <p className="text-gray-400 text-sm">Coming Soon</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 text-center border-2 border-dashed border-gray-200">
              <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <p className="text-gray-500 font-medium">Next Artist</p>
              <p className="text-gray-400 text-sm">Coming Soon</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 text-center border-2 border-dashed border-gray-200">
              <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <p className="text-gray-500 font-medium">Next Artist</p>
              <p className="text-gray-400 text-sm">Coming Soon</p>
            </div>
          </div>
        </div>

        {/* Supporting Artists Info */}
        <div className="mt-8 bg-gradient-to-r from-canvasco-primary/10 to-canvasco-accent/10 rounded-xl p-6 text-center">
          <h3 className="text-xl font-bold text-canvasco-neutral mb-3">
            Supporting Emerging Artists
          </h3>
          <p className="text-canvasco-neutral/80 max-w-2xl mx-auto">
            CanvasCo provides a platform for talented artists to showcase their work while promoting 
            sustainable fashion and meaningful storytelling.
          </p>
        </div>
      </div>
    </div>
  );
}