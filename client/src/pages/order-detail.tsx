import { useEffect } from "react";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Package, MapPin, Calendar, CreditCard, Truck } from "lucide-react";
import { format } from "date-fns";
import { Link } from "wouter";

interface OrderDetail {
  id: number;
  status: string;
  totalAmount: string;
  createdAt: string;
  updatedAt: string;
  customerEmail?: string;
  customerName?: string;
  shippingAddress?: string;
  trackingNumber?: string;
  stripePaymentIntentId: string;
  items: Array<{
    id: number;
    quantity: number;
    price: string;
    product: {
      id: number;
      name: string;
      description: string;
      image: string;
      images: string[];
      artist: {
        name: string;
        location: string;
      };
    };
  }>;
}

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800", 
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800"
};

const statusSteps = [
  { key: "pending", label: "Order Placed", icon: Package },
  { key: "processing", label: "Processing", icon: CreditCard },
  { key: "shipped", label: "Shipped", icon: Truck },
  { key: "delivered", label: "Delivered", icon: MapPin }
];

export default function OrderDetail() {
  const { orderId } = useParams();
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to view your order.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: order, isLoading: orderLoading, error } = useQuery({
    queryKey: [`/api/user/orders/${orderId}`],
    enabled: isAuthenticated && !!orderId,
    retry: (failureCount, error) => {
      if (isUnauthorizedError(error as Error)) {
        toast({
          title: "Session Expired", 
          description: "Please log in again.",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return false;
      }
      return failureCount < 3;
    },
  });

  if (isLoading || orderLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-canvasco-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-canvasco-light via-white to-canvasco-accent/20 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold text-canvasco-primary mb-4">Order Not Found</h1>
          <p className="text-canvasco-neutral mb-8">The order you're looking for doesn't exist or you don't have access to it.</p>
          <Link href="/profile">
            <Button className="bg-canvasco-primary hover:bg-canvasco-primary/90 text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Profile
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  const orderData = order as OrderDetail;
  const currentStatusIndex = statusSteps.findIndex(step => step.key === orderData.status);

  return (
    <div className="min-h-screen bg-gradient-to-br from-canvasco-light via-white to-canvasco-accent/20 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/profile">
            <Button variant="outline" size="sm" className="border-canvasco-primary text-canvasco-primary hover:bg-canvasco-primary hover:text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Profile
            </Button>
          </Link>
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-canvasco-primary">
              Order #{orderData.id}
            </h1>
            <p className="text-canvasco-neutral">
              Placed on {orderData.createdAt ? format(new Date(orderData.createdAt), 'MMMM dd, yyyy') : 'Recently'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-canvasco-primary">
                  <Package className="h-5 w-5" />
                  Order Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-6">
                  <Badge className={statusColors[orderData.status as keyof typeof statusColors] || "bg-gray-100 text-gray-800"}>
                    {orderData.status.charAt(0).toUpperCase() + orderData.status.slice(1)}
                  </Badge>
                  {orderData.trackingNumber && (
                    <div className="flex items-center gap-2 text-sm text-canvasco-neutral">
                      <Truck className="h-4 w-4" />
                      <span>Tracking: {orderData.trackingNumber}</span>
                    </div>
                  )}
                </div>

                {/* Status Timeline */}
                <div className="space-y-4">
                  {statusSteps.map((step, index) => {
                    const isCompleted = index <= currentStatusIndex;
                    const isCurrent = index === currentStatusIndex;
                    const Icon = step.icon;
                    
                    return (
                      <div key={step.key} className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          isCompleted 
                            ? 'bg-canvasco-primary text-white' 
                            : 'bg-gray-200 text-gray-400'
                        }`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <div className={`font-medium ${
                            isCompleted ? 'text-canvasco-primary' : 'text-gray-400'
                          }`}>
                            {step.label}
                          </div>
                          {isCurrent && (
                            <div className="text-sm text-canvasco-neutral">
                              Updated {orderData.updatedAt ? format(new Date(orderData.updatedAt), 'MMM dd, yyyy') : 'Recently'}
                            </div>
                          )}
                        </div>
                        {index < statusSteps.length - 1 && (
                          <div className={`w-px h-8 ml-4 ${
                            isCompleted ? 'bg-canvasco-primary' : 'bg-gray-200'
                          }`} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle className="text-canvasco-primary">Items Ordered</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orderData.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <img 
                        src={item.product.image} 
                        alt={item.product.name}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-canvasco-primary">
                          {item.product.name}
                        </h3>
                        <p className="text-sm text-canvasco-neutral mb-1">
                          by {item.product.artist.name} • {item.product.artist.location}
                        </p>
                        <p className="text-sm text-canvasco-neutral">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-canvasco-primary">
                          ${parseFloat(item.price).toFixed(2)}
                        </div>
                        <div className="text-sm text-canvasco-neutral">
                          ${(parseFloat(item.price) / item.quantity).toFixed(2)} each
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="text-canvasco-primary">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-canvasco-neutral">Subtotal</span>
                  <span className="font-semibold">${parseFloat(orderData.totalAmount).toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-canvasco-neutral">Shipping</span>
                  <span className="font-semibold text-green-600">Free</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between text-lg font-bold text-canvasco-primary">
                    <span>Total</span>
                    <span>${parseFloat(orderData.totalAmount).toFixed(2)}</span>
                  </div>
                </div>

                {orderData.customerEmail && (
                  <div className="pt-4 border-t">
                    <div className="text-sm space-y-2">
                      <div className="flex items-center gap-2 text-canvasco-neutral">
                        <Calendar className="h-4 w-4" />
                        <span>Order Date</span>
                      </div>
                      <div className="text-canvasco-primary">
                        {orderData.createdAt ? format(new Date(orderData.createdAt), 'MMMM dd, yyyy') : 'Recently'}
                      </div>
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t">
                  <Button 
                    variant="outline" 
                    className="w-full border-canvasco-primary text-canvasco-primary hover:bg-canvasco-primary hover:text-white"
                    onClick={() => window.print()}
                  >
                    Print Order Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}