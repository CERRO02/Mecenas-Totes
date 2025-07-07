import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Palette, ExternalLink } from 'lucide-react';

export default function Login() {
  const { isAuthenticated, isLoading } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      window.location.href = '/';
    }
  }, [isAuthenticated]);

  // Auto-redirect to Replit auth if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Small delay to show the page briefly before redirecting
      const timer = setTimeout(() => {
        window.location.href = '/api/login';
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-canvasco-light via-white to-canvasco-accent/20">
        <div className="animate-spin w-8 h-8 border-4 border-canvasco-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-canvasco-light via-white to-canvasco-accent/20 py-16">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <img 
              src={new URL("@assets/image_1751684169303.png", import.meta.url).href} 
              alt="Mecenas Totes Logo" 
              className="h-10 w-10 object-contain"
            />
            <span className="font-display font-bold text-2xl text-canvasco-primary">Mecenas Totes</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-canvasco-primary mb-2">
            Welcome Back
          </h1>
          <p className="text-canvasco-neutral">
            Sign in to track your orders and support amazing artists
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center text-canvasco-primary flex items-center justify-center gap-2">
              <Palette className="h-5 w-5" />
              Join Our Community
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <p className="text-canvasco-neutral text-sm">
                Sign in with your Replit account to access your profile, track orders, and be part of our artist community.
              </p>
              
              <Button 
                onClick={() => window.location.href = '/api/login'}
                className="w-full bg-canvasco-primary hover:bg-canvasco-primary/90 text-white font-semibold py-3"
                size="lg"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Sign in with Replit
              </Button>
              
              <p className="text-xs text-canvasco-neutral">
                Redirecting automatically in a few seconds...
              </p>
            </div>

            <div className="border-t pt-6">
              <div className="text-center">
                <p className="text-sm text-canvasco-neutral mb-3">
                  Just browsing? You can explore without an account
                </p>
                <Button 
                  variant="ghost" 
                  onClick={() => window.location.href = '/'}
                  className="text-canvasco-primary hover:text-canvasco-primary/80"
                >
                  Continue as Guest
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <p className="text-xs text-canvasco-neutral">
            By signing in, you agree to support emerging artists and sustainable fashion
          </p>
        </div>
      </div>
    </div>
  );
}