import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useLocation } from 'wouter';
import { Minus, Plus, Trash2, ShoppingBag, User } from 'lucide-react';

export default function CartSidebar() {
  const { 
    items, 
    itemCount, 
    totalPrice, 
    updateQuantity, 
    removeFromCart, 
    isCartOpen, 
    setIsCartOpen,
    isLoading 
  } = useCart();
  const [, setLocation] = useLocation();

  const handleCheckout = () => {
    setIsCartOpen(false);
    setLocation('/checkout');
  };

  const handleContinueShopping = () => {
    setIsCartOpen(false);
    setLocation('/products');
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Shopping Cart
            {itemCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {itemCount}
              </Badge>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto py-6">
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-canvasco-primary"></div>
              </div>
            ) : items.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">Your cart is empty</p>
                <Button onClick={handleContinueShopping} variant="outline">
                  Start Shopping
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {items.map((item) => {
                  const price = parseFloat(item.product.salePrice || item.product.price);
                  const itemTotal = price * item.quantity;

                  return (
                    <div key={item.id} className="flex items-center space-x-4">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-canvasco-primary truncate">
                          {item.product.name}
                        </h4>
                        <p className="text-sm text-canvasco-accent">
                          by {item.product.artist.name}
                        </p>
                        
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            
                            <span className="w-8 text-center">{item.quantity}</span>
                            
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          
                          <div className="text-right">
                            <div className="font-bold text-canvasco-primary">
                              ${itemTotal.toFixed(2)}
                            </div>
                            {item.product.salePrice && (
                              <div className="text-xs text-gray-500 line-through">
                                ${(parseFloat(item.product.price) * item.quantity).toFixed(2)}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Cart Footer */}
          {items.length > 0 && (
            <div className="border-t pt-6 space-y-4">
              <div className="flex items-center justify-between text-lg font-semibold">
                <span>Total:</span>
                <span className="text-canvasco-primary">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
              
              <div className="space-y-3">
                <Button
                  onClick={handleCheckout}
                  className="w-full bg-canvasco-primary hover:bg-canvasco-primary/90 text-white font-semibold"
                >
                  Proceed to Checkout
                </Button>
                
                <Button
                  onClick={handleContinueShopping}
                  variant="outline"
                  className="w-full border-canvasco-primary text-canvasco-primary hover:bg-canvasco-primary hover:text-white"
                >
                  Continue Shopping
                </Button>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
