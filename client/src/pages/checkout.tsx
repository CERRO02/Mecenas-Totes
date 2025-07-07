import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CreditCard, Shield, Truck, CheckCircle } from 'lucide-react';

export default function Checkout() {
  const { toast } = useToast();
  const { items, totalPrice, clearCart } = useCart();
  const [, setLocation] = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    cardNumber: '',
    expiry: '',
    cvc: '',
    name: '',
    address: '',
    city: '',
    zipCode: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    try {
      // Use demo checkout for testing
      const sessionId = localStorage.getItem('cartSessionId');
      if (!sessionId) {
        throw new Error('Session not found');
      }

      const response = await fetch('/api/checkout/demo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-session-id': sessionId,
        },
        body: JSON.stringify({
          customerEmail: formData.email,
          customerName: formData.name,
          shippingAddress: `${formData.address}, ${formData.city}, ${formData.zipCode}`,
        }),
      });

      if (!response.ok) {
        throw new Error('Checkout failed');
      }

      const result = await response.json();

      toast({
        title: "Order Created!",
        description: "Your demo order has been created successfully.",
      });

      // Clear cart and redirect to order page
      clearCart();
      setLocation(`/order/${result.orderId}`);
    } catch (error) {
      toast({
        title: "Checkout Failed",
        description: "Something went wrong during checkout. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-canvasco-secondary flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-canvasco-primary mb-4">Cart is Empty</h2>
            <p className="text-gray-600 mb-6">Add some items to your cart before checking out.</p>
            <Button asChild>
              <Link href="/products">Continue Shopping</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvasco-secondary py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button variant="ghost" asChild className="mr-4">
            <Link href="/products">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Shop
            </Link>
          </Button>
          <h1 className="font-display text-3xl font-bold text-canvasco-primary">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Payment Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Contact Information */}
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="your@email.com"
                    required
                  />
                </div>

                {/* Demo Mode Notice */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-800 flex items-center mb-2">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Demo Checkout Mode
                  </h3>
                  <p className="text-sm text-blue-700">
                    This is a demo order system for testing purposes. No payment will be processed. 
                    Your order will be created and you can track its status in your profile.
                  </p>
                </div>

                {/* Customer Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-canvasco-primary">Customer Information</h3>
                  
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                </div>

                {/* Billing Address */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-canvasco-primary">Billing Address</h3>
                  
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      type="text"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="123 Main Street"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        type="text"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        placeholder="New York"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="zipCode">ZIP Code</Label>
                      <Input
                        id="zipCode"
                        type="text"
                        value={formData.zipCode}
                        onChange={(e) => handleInputChange('zipCode', e.target.value)}
                        placeholder="10001"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className="w-full bg-canvasco-accent hover:bg-canvasco-accent/90"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating Demo Order...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Create Demo Order - ${totalPrice.toFixed(2)}
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-16 h-16 object-contain rounded-lg bg-gray-50"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-canvasco-primary">{item.product.name}</h4>
                      <p className="text-sm text-gray-600">by {item.product.artist.name}</p>
                      <p className="text-sm text-canvasco-accent">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${(Number(item.product.price) * Number(item.quantity)).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-6" />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-canvasco-accent">Free</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <Shield className="h-4 w-4 mr-2 text-canvasco-accent" />
                  Secure 256-bit SSL encryption
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Truck className="h-4 w-4 mr-2 text-canvasco-accent" />
                  Free shipping on all orders
                </div>
              </div>

              {/* Payment Notice */}
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  <strong>Secure Payment:</strong> You'll be redirected to Stripe's secure payment page to complete your purchase.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}