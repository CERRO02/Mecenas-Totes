import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import type { CartItemWithProduct } from '@shared/schema';

interface CartContextType {
  items: CartItemWithProduct[];
  isLoading: boolean;
  itemCount: number;
  totalPrice: number;
  addToCart: (productId: number, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

function getSessionId() {
  let sessionId = localStorage.getItem('cart-session-id');
  if (!sessionId) {
    sessionId = 'session-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('cart-session-id', sessionId);
  }
  return sessionId;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const sessionId = getSessionId();

  const { data: items = [], isLoading } = useQuery<CartItemWithProduct[]>({
    queryKey: ['/api/cart'],
    queryFn: async () => {
      const response = await fetch('/api/cart', {
        headers: {
          'X-Session-ID': sessionId,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch cart');
      }
      return response.json();
    },
  });

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = items.reduce((total, item) => {
    const price = parseFloat(item.product.salePrice || item.product.price);
    return total + (price * item.quantity);
  }, 0);

  const addToCartMutation = useMutation({
    mutationFn: async ({ productId, quantity = 1 }: { productId: number; quantity?: number }) => {
      const response = await apiRequest('POST', '/api/cart', {
        productId,
        quantity,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
      toast({
        title: 'Added to cart',
        description: 'Item has been added to your cart.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add item to cart',
        variant: 'destructive',
      });
    },
  });

  const updateQuantityMutation = useMutation({
    mutationFn: async ({ itemId, quantity }: { itemId: number; quantity: number }) => {
      const response = await apiRequest('PATCH', `/api/cart/${itemId}`, {
        quantity,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update cart',
        variant: 'destructive',
      });
    },
  });

  const removeFromCartMutation = useMutation({
    mutationFn: async (itemId: number) => {
      const response = await apiRequest('DELETE', `/api/cart/${itemId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
      toast({
        title: 'Removed from cart',
        description: 'Item has been removed from your cart.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to remove item',
        variant: 'destructive',
      });
    },
  });

  const addToCart = async (productId: number, quantity = 1) => {
    // Add headers for session ID
    const originalFetch = window.fetch;
    window.fetch = (url, options = {}) => {
      return originalFetch(url, {
        ...options,
        headers: {
          ...options.headers,
          'X-Session-ID': sessionId,
        },
      });
    };

    try {
      await addToCartMutation.mutateAsync({ productId, quantity });
    } finally {
      window.fetch = originalFetch;
    }
  };

  const updateQuantity = async (itemId: number, quantity: number) => {
    const originalFetch = window.fetch;
    window.fetch = (url, options = {}) => {
      return originalFetch(url, {
        ...options,
        headers: {
          ...options.headers,
          'X-Session-ID': sessionId,
        },
      });
    };

    try {
      await updateQuantityMutation.mutateAsync({ itemId, quantity });
    } finally {
      window.fetch = originalFetch;
    }
  };

  const removeFromCart = async (itemId: number) => {
    const originalFetch = window.fetch;
    window.fetch = (url, options = {}) => {
      return originalFetch(url, {
        ...options,
        headers: {
          ...options.headers,
          'X-Session-ID': sessionId,
        },
      });
    };

    try {
      await removeFromCartMutation.mutateAsync(itemId);
    } finally {
      window.fetch = originalFetch;
    }
  };

  const clearCart = async () => {
    // Silent clear for checkout completion - no toast messages
    const originalFetch = window.fetch;
    window.fetch = (url, options = {}) => {
      return originalFetch(url, {
        ...options,
        headers: {
          ...options.headers,
          'X-Session-ID': sessionId,
        },
      });
    };

    try {
      // Remove all items silently
      for (const item of items) {
        await apiRequest('DELETE', `/api/cart/${item.id}`);
      }
      // Invalidate cache to refresh the cart
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
    } finally {
      window.fetch = originalFetch;
    }
  };

  // Setup session ID header for all requests
  useEffect(() => {
    const originalFetch = window.fetch;
    window.fetch = (url, options = {}) => {
      // Only add session ID for cart-related requests
      if (typeof url === 'string' && url.includes('/api/cart')) {
        return originalFetch(url, {
          ...options,
          headers: {
            ...options.headers,
            'X-Session-ID': sessionId,
          },
        });
      }
      return originalFetch(url, options);
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, [sessionId]);

  const value: CartContextType = {
    items,
    isLoading,
    itemCount,
    totalPrice,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    isCartOpen,
    setIsCartOpen,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}
