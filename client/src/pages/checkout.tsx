import { useState, useEffect } from 'react';
import { useStripe, useElements, PaymentElement, Elements } from '@stripe/react-stripe-js';
import { useMutation } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { stripePromise } from '@/lib/stripe';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CreditCard, Shield, Truck, RotateCcw } from 'lucide-react';

interface CheckoutFormProps {
  clientSecret: string;
  customerEmail: string;
  setCustomerEmail: (email: string) => void;
}

function CheckoutForm({ clientSecret, customerEmail, setCustomerEmail }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const { items, totalPrice, clearCart } = useCart();
  const [, setLocation] = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);

  const confirmOrderMutation = useMutation({
    mutationFn: async ({ paymentIntentId, customerEmail }: { paymentIntentId: string; customerEmail: string }) => {
      const response = await apiRequest('POST', '/api/orders/confirm', {
        paymentIntentId,
        customerEmail,
      });
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: 'Order Confirmed!',
        description: `Thank you for your purchase! Order #${data.orderId}`,
      });
      clearCart();
      setLocation('/');
    },
    onError: (error: any) => {
      toast({
        title: 'Order confirmation failed',
        description: error.message || 'There was an issue confirming your order.',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    if (!customerEmail.trim()) {
      toast({
        title: 'Email required',
        description: 'Please enter your email address.',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin,
          receipt_email: customerEmail,
        },
        redirect: 'if_required',
      });

      if (error) {
        toast({
          title: 'Payment Failed',
          description: error.message,
          variant: 'destructive',
        });
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Confirm the order on our backend
        await confirmOrderMutation.mutateAsync({
          paymentIntentId: paymentIntent.id,
          customerEmail,
        });
      }
    } catch (error: any) {
      toast({
        title: 'Payment Error',
        description: error.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
            Payment Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <PaymentElement 
              options={{
                layout: 'tabs',
              }}
            />
            
            <div className="flex items-center gap-2 text-sm text-canvasco-neutral">
              <Shield className="h-4 w-4" />
              <span>Your payment information is secure and encrypted</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={!stripe || !elements || isProcessing || confirmOrderMutation.isPending}
        className="w-full bg-canvasco-primary hover:bg-canvasco-primary/90 text-white py-4 text-lg font-semibold"
      >
        {isProcessing || confirmOrderMutation.isPending 
          ? 'Processing...' 
          : `Complete Order - $${totalPrice.toFixed(2)}`
        }
      </Button>

      {/* Security & Guarantee */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center text-sm text-canvasco-neutral">
        <div className="flex items-center justify-center gap-2">
          <Shield className="h-4 w-4" />
          <span>Secure Checkout</span>
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

export default function Checkout() {
  const { items, totalPrice, itemCount } = useCart();
  const [, setLocation] = useLocation();
  const [clientSecret, setClientSecret] = useState<string>('');
  const [customerEmail, setCustomerEmail] = useState('');
  const { toast } = useToast();

  // Redirect if cart is empty
  useEffect(() => {
    if (itemCount === 0) {
      toast({
        title: 'Cart is empty',
        description: 'Add some items to your cart before checking out.',
        variant: 'destructive',
      });
      setLocation('/products');
    }
  }, [itemCount, setLocation, toast]);

  // Create payment intent
  useEffect(() => {
    if (totalPrice > 0) {
      apiRequest('POST', '/api/create-payment-intent', { 
        amount: totalPrice,
        currency: 'usd'
      })
        .then((res) => res.json())
        .then((data) => {
          setClientSecret(data.clientSecret);
        })
        .catch((error) => {
          toast({
            title: 'Payment setup failed',
            description: error.message || 'Failed to initialize payment.',
            variant: 'destructive',
          });
        });
    }
  }, [totalPrice, toast]);

  if (itemCount === 0) {
    return null; // Will redirect via useEffect
  }

  if (!clientSecret) {
    return (
      <div className="min-h-screen bg-canvasco-secondary py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-canvasco-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvasco-secondary py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => setLocation('/products')}
            className="text-canvasco-neutral hover:text-canvasco-primary mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Continue Shopping
          </Button>
          
          <h1 className="font-display text-3xl md:text-4xl font-bold text-canvasco-primary">
            Checkout
          </h1>
          <p className="text-canvasco-neutral mt-2">
            Complete your order for {itemCount} item{itemCount !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="lg:order-2">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="font-display text-xl text-canvasco-primary">
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Cart Items */}
                <div className="space-y-4">
                  {items.map((item) => {
                    const price = parseFloat(item.product.salePrice || item.product.price);
                    const itemTotal = price * item.quantity;

                    return (
                      <div key={item.id} className="flex items-center space-x-4">
                        <div className="relative">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <Badge 
                            variant="secondary" 
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs"
                          >
                            {item.quantity}
                          </Badge>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-canvasco-primary truncate">
                            {item.product.name}
                          </h4>
                          <p className="text-sm text-canvasco-accent">
                            by {item.product.artist.name}
                          </p>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-sm text-canvasco-neutral">
                              ${price.toFixed(2)} × {item.quantity}
                            </span>
                            <span className="font-semibold text-canvasco-primary">
                              ${itemTotal.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <Separator />

                {/* Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between text-canvasco-neutral">
                    <span>Subtotal</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-canvasco-neutral">
                    <span>Shipping</span>
                    <span>{totalPrice >= 50 ? 'Free' : '$5.99'}</span>
                  </div>
                  {totalPrice < 50 && (
                    <div className="text-xs text-canvasco-accent">
                      Add ${(50 - totalPrice).toFixed(2)} more for free shipping
                    </div>
                  )}
                  
                  <Separator />
                  
                  <div className="flex justify-between text-lg font-bold text-canvasco-primary">
                    <span>Total</span>
                    <span>${(totalPrice + (totalPrice >= 50 ? 0 : 5.99)).toFixed(2)}</span>
                  </div>
                </div>

                {/* Eco-friendly message */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm">
                  <p className="text-green-800 font-semibold mb-1">🌱 Eco-Friendly Purchase</p>
                  <p className="text-green-700">
                    This order supports sustainable practices and emerging artists.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Checkout Form */}
          <div className="lg:order-1">
            <Elements 
              stripe={stripePromise} 
              options={{ 
                clientSecret,
                appearance: {
                  theme: 'stripe',
                  variables: {
                    colorPrimary: '#2D5E3A',
                    colorBackground: '#ffffff',
                    colorText: '#374151',
                    colorDanger: '#ef4444',
                    fontFamily: 'Inter, sans-serif',
                    borderRadius: '8px',
                  },
                },
              }}
            >
              <CheckoutForm 
                clientSecret={clientSecret}
                customerEmail={customerEmail}
                setCustomerEmail={setCustomerEmail}
              />
            </Elements>
          </div>
        </div>
      </div>
    </div>
  );
}
