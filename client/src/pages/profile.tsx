import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Package, User, MapPin, Calendar, CreditCard, Eye } from "lucide-react";
import { format } from "date-fns";
import { Link } from "wouter";

interface Order {
  id: number;
  status: string;
  totalAmount: string;
  createdAt: string;
  trackingNumber?: string;
  items: Array<{
    id: number;
    quantity: number;
    price: string;
    product: {
      id: number;
      name: string;
      image: string;
      artist: {
        name: string;
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

export default function Profile() {
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading } = useAuth();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to view your profile.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ["/api/user/orders"],
    enabled: isAuthenticated,
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-canvasco-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-canvasco-light via-white to-canvasco-accent/20 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-canvasco-primary mb-4">
            My Profile
          </h1>
          <p className="text-xl text-canvasco-neutral max-w-2xl mx-auto">
            Manage your account and track your orders
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={user.profileImageUrl || ""} alt={user.firstName || "User"} />
                    <AvatarFallback className="bg-canvasco-primary text-white text-2xl">
                      {user.firstName?.[0] || user.email?.[0]?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle className="text-canvasco-primary">
                  {user.firstName && user.lastName 
                    ? `${user.firstName} ${user.lastName}`
                    : user.email
                  }
                </CardTitle>
                {user.email && (
                  <p className="text-canvasco-neutral">{user.email}</p>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 text-sm text-canvasco-neutral">
                  <User className="h-4 w-4" />
                  <span>Member since {format(new Date(user.createdAt), 'MMMM yyyy')}</span>
                </div>
                <div className="pt-4 border-t">
                  <Button 
                    variant="outline" 
                    className="w-full border-canvasco-primary text-canvasco-primary hover:bg-canvasco-primary hover:text-white"
                    onClick={() => window.location.href = "/api/logout"}
                  >
                    Log Out
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Orders Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-canvasco-primary">
                  <Package className="h-5 w-5" />
                  Order History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {ordersLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin w-6 h-6 border-4 border-canvasco-primary border-t-transparent rounded-full" />
                  </div>
                ) : orders && orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.map((order: Order) => (
                      <div key={order.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <span className="font-semibold text-canvasco-primary">
                              Order #{order.id}
                            </span>
                            <Badge className={statusColors[order.status as keyof typeof statusColors] || "bg-gray-100 text-gray-800"}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </Badge>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-canvasco-primary">
                              ${parseFloat(order.totalAmount).toFixed(2)}
                            </div>
                            <div className="text-sm text-canvasco-neutral">
                              {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                            </div>
                          </div>
                        </div>

                        {order.trackingNumber && (
                          <div className="flex items-center gap-2 mb-3 text-sm text-canvasco-neutral">
                            <MapPin className="h-4 w-4" />
                            <span>Tracking: {order.trackingNumber}</span>
                          </div>
                        )}

                        <div className="space-y-2">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex items-center gap-3">
                              <img 
                                src={item.product.image} 
                                alt={item.product.name}
                                className="w-12 h-12 object-cover rounded"
                              />
                              <div className="flex-1">
                                <div className="font-medium text-sm">
                                  {item.product.name}
                                </div>
                                <div className="text-xs text-canvasco-neutral">
                                  by {item.product.artist.name} • Qty: {item.quantity}
                                </div>
                              </div>
                              <div className="text-sm font-medium">
                                ${parseFloat(item.price).toFixed(2)}
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="mt-3 pt-3 border-t flex justify-end">
                          <Link href={`/order/${order.id}`}>
                            <Button size="sm" variant="outline" className="text-canvasco-primary border-canvasco-primary hover:bg-canvasco-primary hover:text-white">
                              <Eye className="h-4 w-4 mr-1" />
                              View Details
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-canvasco-neutral mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-canvasco-primary mb-2">
                      No Orders Yet
                    </h3>
                    <p className="text-canvasco-neutral mb-4">
                      Start shopping for beautiful tote bags from our talented artists!
                    </p>
                    <Link href="/products">
                      <Button className="bg-canvasco-primary hover:bg-canvasco-primary/90 text-white">
                        Browse Products
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}