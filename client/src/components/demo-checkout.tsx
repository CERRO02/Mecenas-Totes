import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useCart } from '@/hooks/use-cart';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CreditCard, Shield, Truck, RotateCcw, Info } from 'lucide-react';

interface DemoCheckoutProps {
  customerEmail: string;
  setCustomerEmail: (email: string) => void;
}

export function DemoCheckout({ customerEmail, setCustomerEmail }: DemoCheckoutProps) {
  const { toast } = useToast();
  const { totalPrice, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');

  // Pre-populate user data if authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      setCustomerEmail(user.email);
      setCardName(`${user.firstName} ${user.lastName}`);
    }
  }, [isAuthenticated, user, setCustomerEmail]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerEmail.trim()) {
      toast({
        title: 'Email required',
        description: 'Please enter your email address.',
        variant: 'destructive',
      });
      return;
    }

    if (!cardNumber || !expiryDate || !cvv || !cardName) {
      toast({
        title: 'Payment details required',
        description: 'Please fill in all payment fields.',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      toast({
        title: 'Demo Order Completed!',
        description: 'This is a demo - no real payment was processed.',
      });
      clearCart();
      setLocation('/');
      setIsProcessing(false);
    }, 2000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Demo Mode Alert */}
      <Alert className="border-blue-200 bg-blue-50">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <strong>Demo Mode:</strong> This is a demonstration checkout. No real payment will be processed. 
          You can use any fake credit card details to test the experience.
        </AlertDescription>
      </Alert>

      {/* Customer Information */}
      <Card>
        <CardHeader>
          <CardTitle className="font-display text-xl text-canvasco-primary">
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-canvasco-neutral">
                Email Address *
              </Label>
              <Input
                id="email"
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="mt-1"
              />
              <p className="text-sm text-canvasco-neutral mt-1">
                We'll send your order confirmation to this email.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Information */}
      <Card>
        <CardHeader>
          <CardTitle className="font-display text-xl text-canvasco-primary flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Information (Demo)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="cardName" className="text-canvasco-neutral">
                Cardholder Name *
              </Label>
              <Input
                id="cardName"
                type="text"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                placeholder="John Doe"
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="cardNumber" className="text-canvasco-neutral">
                Card Number *
              </Label>
              <Input
                id="cardNumber"
                type="text"
                value={cardNumber}
                onChange={(e) => {
                  const value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
                  const formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
                  if (formattedValue.length <= 19) setCardNumber(formattedValue);
                }}
                placeholder="1234 5678 9012 3456"
                required
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiryDate" className="text-canvasco-neutral">
                  Expiry Date *
                </Label>
                <Input
                  id="expiryDate"
                  type="text"
                  value={expiryDate}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    const formattedValue = value.replace(/(\d{2})(\d)/, '$1/$2');
                    if (formattedValue.length <= 5) setExpiryDate(formattedValue);
                  }}
                  placeholder="MM/YY"
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="cvv" className="text-canvasco-neutral">
                  CVV *
                </Label>
                <Input
                  id="cvv"
                  type="text"
                  value={cvv}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    if (value.length <= 4) setCvv(value);
                  }}
                  placeholder="123"
                  required
                  className="mt-1"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-canvasco-neutral">
              <Shield className="h-4 w-4" />
              <span>This is a demo - no real payment will be processed</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isProcessing}
        className="w-full bg-canvasco-primary hover:bg-canvasco-primary/90 text-white py-4 text-lg font-semibold"
      >
        {isProcessing 
          ? 'Processing Demo Order...' 
          : `Complete Demo Order - $${totalPrice.toFixed(2)}`
        }
      </Button>

      {/* Security & Guarantee */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center text-sm text-canvasco-neutral">
        <div className="flex items-center justify-center gap-2">
          <Shield className="h-4 w-4" />
          <span>Demo Checkout</span>
        </div>
        <div className="flex items-center justify-center gap-2">
          <Truck className="h-4 w-4" />
          <span>Free Shipping $50+</span>
        </div>
        <div className="flex items-center justify-center gap-2">
          <RotateCcw className="h-4 w-4" />
          <span>30-Day Returns</span>
        </div>
      </div>
    </form>
  );
}