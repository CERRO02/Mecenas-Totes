import { Palette, Heart } from 'lucide-react';

export default function Products() {
  return (
    <div className="min-h-screen bg-white py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Main Message */}
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-canvasco-primary to-canvasco-accent rounded-full flex items-center justify-center">
            <Palette className="h-12 w-12 text-white" />
          </div>
          
          <h1 className="text-3xl font-bold text-canvasco-neutral mb-4">
            No Bags Available Right Now
          </h1>
          
          <p className="text-lg text-canvasco-neutral/70 mb-8 max-w-2xl mx-auto">
            We don't have any tote bags in our collection at this moment. 
            Our artists are working on amazing new designs that will be available soon.
          </p>
        </div>

        {/* Artists Focus */}
        <div className="bg-gradient-to-r from-canvasco-primary/10 to-canvasco-accent/10 rounded-xl p-8 mb-8">
          <div className="flex items-center justify-center mb-4">
            <Heart className="h-6 w-6 text-canvasco-accent mr-2" />
            <h2 className="text-xl font-semibold text-canvasco-neutral">
              Supporting Our Artists
            </h2>
          </div>
          
          <p className="text-canvasco-neutral/80 max-w-xl mx-auto">
            While you wait for new designs, explore our talented artists and learn about 
            their creative journeys. Each future tote bag will directly support these 
            emerging creators.
          </p>
        </div>

        {/* Call to Action */}
        <div className="space-y-4">
          <a 
            href="/artists" 
            className="inline-block bg-canvasco-primary hover:bg-canvasco-primary/90 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Meet Our Artists
          </a>
          
          <p className="text-sm text-canvasco-neutral/60">
            Check back soon for new sustainable tote bag collections
          </p>
        </div>
      </div>
    </div>
  );
}