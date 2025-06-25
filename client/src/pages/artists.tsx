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
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-canvasco-neutral mb-4">
            Meet Our Artist
          </h1>
          <p className="text-xl text-canvasco-neutral/80">
            Discover the creative mind behind our sustainable designs
          </p>
        </div>

        {/* Amy Ma Profile */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Photo Section */}
            <div className="relative">
              <img 
                src={amyMa.image} 
                alt={`Artist ${amyMa.name}`} 
                className="w-full h-full object-cover min-h-[400px] lg:min-h-[600px]"
              />
              <div className="absolute bottom-4 left-4 bg-white/95 text-canvasco-primary px-4 py-2 rounded-full font-semibold shadow-lg">
                Featured Artist
              </div>
            </div>
            
            {/* Information Section */}
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              <h2 className="text-3xl lg:text-4xl font-bold text-canvasco-neutral mb-6">
                {amyMa.name}
              </h2>
              
              {/* Artist Details */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3 text-canvasco-neutral/80">
                  <MapPin className="h-5 w-5 text-canvasco-accent" />
                  <span className="font-medium">{amyMa.location}</span>
                </div>
                <div className="flex items-center space-x-3 text-canvasco-neutral/80">
                  <Palette className="h-5 w-5 text-canvasco-accent" />
                  <span className="font-medium">{amyMa.style}</span>
                </div>
              </div>

              {/* Bio */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-canvasco-neutral mb-4">About Amy</h3>
                <p className="text-canvasco-neutral/80 leading-relaxed text-lg">
                  {amyMa.bio}
                </p>
              </div>

              {/* Contact Information */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-canvasco-neutral mb-4">Connect with Amy</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-canvasco-neutral/80">
                    <Instagram className="h-5 w-5 text-canvasco-accent" />
                    <span className="font-medium">@amy.art617</span>
                  </div>
                  <div className="flex items-center space-x-3 text-canvasco-neutral/80">
                    <Mail className="h-5 w-5 text-canvasco-accent" />
                    <span className="font-medium">amymaz1hui@gmail.com</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <Button 
                  className="w-full bg-canvasco-primary hover:bg-canvasco-primary/90 text-white font-semibold py-3"
                  asChild
                >
                  <a href={`/products?artist=${amyMa.id}`}>
                    View Amy's Tote Bag Designs
                  </a>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full border-canvasco-primary text-canvasco-primary hover:bg-canvasco-primary hover:text-white font-semibold py-3"
                  asChild
                >
                  <a href={amyMa.website} target="_blank" rel="noopener noreferrer">
                    <Instagram className="h-4 w-4 mr-2" />
                    Follow on Instagram
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info Section */}
        <div className="mt-12 bg-gradient-to-r from-canvasco-primary/10 to-canvasco-accent/10 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-canvasco-neutral mb-4">
            Supporting Young Artists
          </h3>
          <p className="text-lg text-canvasco-neutral/80 max-w-2xl mx-auto">
            CanvasCo is proud to partner with emerging artists like Amy Ma, providing a platform 
            to showcase their talent while promoting sustainable fashion and meaningful storytelling.
          </p>
        </div>
      </div>
    </div>
  );
}