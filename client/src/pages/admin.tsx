import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Package, Users, DollarSign, TrendingUp, Eye, Edit } from 'lucide-react';
import type { OrderWithItems, User } from '@shared/schema';

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  processing: "bg-orange-100 text-orange-800", 
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800"
};

export default function AdminDashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedOrder, setSelectedOrder] = useState<OrderWithItems | null>(null);
  const [editingOrder, setEditingOrder] = useState<number | null>(null);
  const [orderStatus, setOrderStatus] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');

  // Check if user is admin
  if (!isLoading && (!isAuthenticated || (user?.role !== 'admin' && user?.role !== 'supervisor'))) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-canvasco-primary mb-2">Access Denied</h2>
              <p className="text-canvasco-neutral">You need admin permissions to access this page.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Fetch admin data
  const { data: orders = [], isLoading: ordersLoading } = useQuery<OrderWithItems[]>({
    queryKey: ['/api/admin/orders'],
    enabled: isAuthenticated && (user?.role === 'admin' || user?.role === 'supervisor'),
  });

  const { data: users = [], isLoading: usersLoading } = useQuery<User[]>({
    queryKey: ['/api/admin/users'],
    enabled: isAuthenticated && (user?.role === 'admin' || user?.role === 'supervisor'),
  });

  // Update order mutation
  const updateOrderMutation = useMutation({
    mutationFn: async ({ orderId, status, trackingNumber }: { orderId: number; status: string; trackingNumber?: string }) => {
      return apiRequest('PUT', `/api/admin/orders/${orderId}`, { status, trackingNumber });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/orders'] });
      setEditingOrder(null);
      toast({ title: "Order Updated", description: "Order status has been updated successfully." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update order.", variant: "destructive" });
    },
  });

  const handleUpdateOrder = (orderId: number) => {
    updateOrderMutation.mutate({ orderId, status: orderStatus, trackingNumber });
  };

  // Calculate stats
  const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.totalAmount), 0);
  const pendingOrders = orders.filter(order => order.status === 'pending' || order.status === 'confirmed').length;
  const shippedOrders = orders.filter(order => order.status === 'shipped' || order.status === 'delivered').length;

  if (isLoading || ordersLoading || usersLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-canvasco-cream p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-canvasco-primary mb-2">Admin Dashboard</h1>
          <p className="text-canvasco-neutral">Manage your Mecenas Totes business</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orders.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingOrders}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="orders" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="orders">Orders Management</TabsTrigger>
            <TabsTrigger value="users">Users Management</TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>All Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold">Order #{order.id}</h3>
                          <p className="text-sm text-canvasco-neutral">
                            {order.customerName} ({order.customerEmail})
                          </p>
                          <p className="text-sm text-canvasco-neutral">${order.totalAmount}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={statusColors[order.status as keyof typeof statusColors]}>
                            {order.status}
                          </Badge>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              setEditingOrder(order.id);
                              setOrderStatus(order.status);
                              setTrackingNumber(order.trackingNumber || '');
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {editingOrder === order.id && (
                        <div className="border-t pt-4 space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="status">Order Status</Label>
                              <Select value={orderStatus} onValueChange={setOrderStatus}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">Pending</SelectItem>
                                  <SelectItem value="confirmed">Confirmed</SelectItem>
                                  <SelectItem value="processing">Processing</SelectItem>
                                  <SelectItem value="shipped">Shipped</SelectItem>
                                  <SelectItem value="delivered">Delivered</SelectItem>
                                  <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="tracking">Tracking Number</Label>
                              <Input
                                id="tracking"
                                value={trackingNumber}
                                onChange={(e) => setTrackingNumber(e.target.value)}
                                placeholder="Enter tracking number"
                              />
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button onClick={() => handleUpdateOrder(order.id)}>
                              Update Order
                            </Button>
                            <Button variant="outline" onClick={() => setEditingOrder(null)}>
                              Cancel
                            </Button>
                          </div>
                        </div>
                      )}

                      <div className="mt-4">
                        <h4 className="font-medium mb-2">Items:</h4>
                        {order.items.map((item) => (
                          <div key={item.id} className="text-sm text-canvasco-neutral">
                            {item.product.name} × {item.quantity} - ${item.price}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((user) => (
                    <div key={user.id} className="flex justify-between items-center border rounded-lg p-4">
                      <div>
                        <h3 className="font-semibold">{user.firstName} {user.lastName}</h3>
                        <p className="text-sm text-canvasco-neutral">{user.email}</p>
                        <Badge variant="outline">{user.role}</Badge>
                      </div>
                      <div className="text-sm text-canvasco-neutral">
                        Joined {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}