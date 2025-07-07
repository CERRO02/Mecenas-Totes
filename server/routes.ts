import type { Express } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import Stripe from "stripe";
import { storage } from "./storage";
import { insertCartItemSchema, insertNewsletterSubscriberSchema } from "@shared/schema";
import { z } from "zod";
import fs from "fs";
import path from "path";

// Initialize Stripe only if secret key is available
let stripe: Stripe | null = null;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-05-28.basil",
  });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Session middleware for custom auth
  app.use(session({
    secret: process.env.SESSION_SECRET || 'fallback-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true in production with HTTPS
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));

  // Custom authentication routes
  app.post('/api/auth/register', async (req, res) => {
    try {
      const { email, password, firstName, lastName, phone } = req.body;
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Create new user (in production, hash the password)
      const userId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
      
      // Check if this is the admin email or first user
      const allUsers = await storage.getAllUsers();
      const isAdminEmail = email === "cerrochen02@gmail.com";
      const isFirstUser = allUsers.length === 0;
      
      const user = await storage.upsertUser({
        id: userId,
        email,
        firstName,
        lastName,
        phone,
        profileImageUrl: null,
        role: (isAdminEmail || isFirstUser) ? "admin" : "customer"
      });

      // Set session
      (req.session as any).userId = user.id;
      
      res.json({ user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role } });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Registration failed" });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      
      // Find user by email
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // In production, verify password hash here
      // For now, we'll accept any password for demo purposes
      
      // Set session
      (req.session as any).userId = user.id;
      
      res.json({ user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role } });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post('/api/auth/logout', (req, res) => {
    req.session.destroy(() => {
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get('/api/auth/user', async (req, res) => {
    try {
      const userId = (req.session as any)?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      res.json({ id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, phone: user.phone, role: user.role });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Special endpoint to upgrade cerrochen02@gmail.com to admin if account exists
  app.post('/api/admin/upgrade-self', async (req, res) => {
    try {
      const user = await storage.getUserByEmail("cerrochen02@gmail.com");
      if (user) {
        const updatedUser = await storage.updateUserRole(user.id, "admin");
        res.json({ message: "Account upgraded to admin", user: updatedUser });
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error: any) {
      res.status(500).json({ message: "Error upgrading account: " + error.message });
    }
  });

  // User profile routes
  app.patch('/api/user/profile', async (req, res) => {
    try {
      const userId = (req.session as any)?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const updates = req.body;
      // Remove sensitive fields that shouldn't be updated via this endpoint
      delete updates.id;
      delete updates.role;
      delete updates.createdAt;
      delete updates.updatedAt;

      const updatedUser = await storage.updateUser(userId, updates);
      res.json(updatedUser);
    } catch (error: any) {
      res.status(500).json({ message: "Error updating profile: " + error.message });
    }
  });

  app.get('/api/user/orders', async (req, res) => {
    try {
      const userId = (req.session as any)?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const orders = await storage.getUserOrders(userId);
      res.json(orders);
    } catch (error) {
      console.error("Error fetching user orders:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.get('/api/user/orders/:orderId', async (req, res) => {
    try {
      const userId = (req.session as any)?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const orderId = parseInt(req.params.orderId);
      const order = await storage.getOrder(orderId);
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      // Check if this order belongs to the authenticated user
      if (order.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      res.json(order);
    } catch (error) {
      console.error("Error fetching order:", error);
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });
  
  // Image serving API route - using /api prefix to avoid Vite catch-all
  app.get("/api/images/:filename", (req, res) => {
    const filename = decodeURIComponent(req.params.filename);
    const filePath = path.resolve('attached_assets', filename);
    
    // Security check
    if (!filePath.startsWith(path.resolve('attached_assets'))) {
      return res.status(403).send('Forbidden');
    }
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).send('Image not found');
    }
    
    // Set content type
    if (filename.toLowerCase().endsWith('.png')) {
      res.setHeader('Content-Type', 'image/png');
    } else if (filename.toLowerCase().endsWith('.jpg') || filename.toLowerCase().endsWith('.jpeg')) {
      res.setHeader('Content-Type', 'image/jpeg');
    }
    
    res.sendFile(filePath);
  });
  
  // Artists routes
  app.get("/api/artists", async (req, res) => {
    try {
      const artists = await storage.getArtists();
      res.json(artists);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching artists: " + error.message });
    }
  });

  app.get("/api/artists/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const artist = await storage.getArtist(id);
      if (!artist) {
        return res.status(404).json({ message: "Artist not found" });
      }
      res.json(artist);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching artist: " + error.message });
    }
  });

  app.get("/api/artists/featured/current", async (req, res) => {
    try {
      const artist = await storage.getFeaturedArtist();
      if (!artist) {
        return res.status(404).json({ message: "No featured artist found" });
      }
      res.json(artist);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching featured artist: " + error.message });
    }
  });

  // Products routes
  app.get("/api/products", async (req, res) => {
    try {
      const { search, artist } = req.query;
      
      let products;
      if (search) {
        products = await storage.searchProducts(search as string);
      } else if (artist) {
        products = await storage.getProductsByArtist(parseInt(artist as string));
      } else {
        products = await storage.getProducts();
      }
      
      res.json(products);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching products: " + error.message });
    }
  });

  app.get("/api/products/featured", async (req, res) => {
    try {
      const products = await storage.getFeaturedProducts();
      res.json(products);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching featured products: " + error.message });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProduct(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching product: " + error.message });
    }
  });

  // Cart routes
  app.get("/api/cart", async (req, res) => {
    try {
      const sessionId = req.headers["x-session-id"] as string;
      if (!sessionId) {
        return res.status(400).json({ message: "Session ID required" });
      }
      
      const items = await storage.getCartItems(sessionId);
      res.json(items);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching cart: " + error.message });
    }
  });

  app.post("/api/cart", async (req, res) => {
    try {
      const sessionId = req.headers["x-session-id"] as string;
      if (!sessionId) {
        return res.status(400).json({ message: "Session ID required" });
      }

      const cartItemData = insertCartItemSchema.parse({
        ...req.body,
        sessionId
      });

      const item = await storage.addToCart(cartItemData);
      res.json(item);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid cart item data", errors: error.errors });
      }
      res.status(500).json({ message: "Error adding to cart: " + error.message });
    }
  });

  app.patch("/api/cart/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { quantity } = req.body;
      
      if (!quantity || quantity < 1) {
        return res.status(400).json({ message: "Valid quantity required" });
      }

      const item = await storage.updateCartItem(id, quantity);
      res.json(item);
    } catch (error: any) {
      res.status(500).json({ message: "Error updating cart item: " + error.message });
    }
  });

  app.delete("/api/cart/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.removeFromCart(id);
      res.json({ message: "Item removed from cart" });
    } catch (error: any) {
      res.status(500).json({ message: "Error removing from cart: " + error.message });
    }
  });

  // Stripe payment route
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      const { amount, currency = "usd" } = req.body;
      
      if (!amount || amount <= 0) {
        return res.status(400).json({ message: "Valid amount required" });
      }

      if (!stripe) {
        return res.status(503).json({ 
          message: "Payment processing temporarily unavailable. Please contact support.",
          demo: true 
        });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency,
        metadata: {
          sessionId: req.headers["x-session-id"] as string || ""
        }
      });

      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      res.status(500).json({ message: "Error creating payment intent: " + error.message });
    }
  });

  // Demo checkout route (skips payment for testing)
  app.post("/api/checkout/demo", async (req, res) => {
    try {
      const sessionId = req.headers["x-session-id"] as string;
      const { customerEmail, customerName, shippingAddress } = req.body;

      if (!sessionId) {
        return res.status(400).json({ message: "Session ID required" });
      }

      // Get cart items
      const cartItems = await storage.getCartItems(sessionId);
      if (cartItems.length === 0) {
        return res.status(400).json({ message: "Cart is empty" });
      }

      // Calculate total
      const totalAmount = cartItems.reduce((total, item) => {
        const price = parseFloat(item.product.salePrice || item.product.price);
        return total + (price * item.quantity);
      }, 0);

      // Get user ID from session if logged in
      const userId = (req.session as any)?.userId;

      // Create order without payment processing (demo mode)
      const order = await storage.createOrder({
        userId: userId || null,
        customerEmail,
        customerName,
        shippingAddress,
        totalAmount: totalAmount.toFixed(2),
        status: "confirmed", // Start as confirmed since we're skipping payment
        stripePaymentIntentId: `demo_order_${Date.now()}`, // Demo payment ID
      });

      // Add order items
      const orderItems = cartItems.map(item => ({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.product.salePrice || item.product.price
      }));

      await storage.addOrderItems(orderItems);

      // Clear cart
      await storage.clearCart(sessionId);

      // Simulate order processing updates
      setTimeout(() => {
        storage.updateOrderStatus(order.id, "processing", null);
      }, 5000); // After 5 seconds, update to processing

      setTimeout(() => {
        storage.updateOrderStatus(order.id, "shipped", `DEMO${Math.random().toString(36).substr(2, 9).toUpperCase()}`);
      }, 15000); // After 15 seconds, mark as shipped with tracking

      res.json({ 
        success: true,
        orderId: order.id,
        message: "Demo order created successfully!"
      });
    } catch (error: any) {
      res.status(500).json({ message: "Error creating demo order: " + error.message });
    }
  });

  // Order confirmation (for real payments)
  app.post("/api/orders/confirm", async (req, res) => {
    try {
      const sessionId = req.headers["x-session-id"] as string;
      const { paymentIntentId, customerEmail } = req.body;

      if (!sessionId || !paymentIntentId) {
        return res.status(400).json({ message: "Session ID and payment intent ID required" });
      }

      // Get cart items
      const cartItems = await storage.getCartItems(sessionId);
      if (cartItems.length === 0) {
        return res.status(400).json({ message: "Cart is empty" });
      }

      // Calculate total
      const totalAmount = cartItems.reduce((total, item) => {
        const price = parseFloat(item.product.salePrice || item.product.price);
        return total + (price * item.quantity);
      }, 0);

      // Create order
      const order = await storage.createOrder({
        sessionId,
        stripePaymentIntentId: paymentIntentId,
        status: "completed",
        totalAmount: totalAmount.toString(),
        customerEmail
      });

      // Add order items
      const orderItems = cartItems.map(item => ({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.product.salePrice || item.product.price
      }));

      await storage.addOrderItems(orderItems);

      // Clear cart
      await storage.clearCart(sessionId);

      res.json({ orderId: order.id, message: "Order confirmed successfully" });
    } catch (error: any) {
      res.status(500).json({ message: "Error confirming order: " + error.message });
    }
  });

  // Newsletter subscription
  app.post("/api/newsletter/subscribe", async (req, res) => {
    try {
      const subscriberData = insertNewsletterSubscriberSchema.parse(req.body);
      const subscriber = await storage.subscribeToNewsletter(subscriberData);
      res.json({ message: "Successfully subscribed to newsletter", subscriber });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid email data", errors: error.errors });
      }
      res.status(500).json({ message: "Error subscribing to newsletter: " + error.message });
    }
  });

  // Admin middleware
  const isAdmin = async (req: any, res: any, next: any) => {
    const userId = req.session?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const user = await storage.getUser(userId);
      if (!user || (user.role !== "admin" && user.role !== "supervisor")) {
        return res.status(403).json({ message: "Admin access required" });
      }
      next();
    } catch (error) {
      return res.status(500).json({ message: "Error checking admin permissions" });
    }
  };

  // Admin routes
  app.get("/api/admin/orders", isAdmin, async (req, res) => {
    try {
      const orders = await storage.getAllOrders();
      res.json(orders);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching orders: " + error.message });
    }
  });

  app.get("/api/admin/users", isAdmin, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching users: " + error.message });
    }
  });

  app.put("/api/admin/orders/:id", isAdmin, async (req, res) => {
    try {
      const orderId = parseInt(req.params.id);
      const { status, trackingNumber } = req.body;
      
      const order = await storage.updateOrderStatus(orderId, status, trackingNumber);
      res.json(order);
    } catch (error: any) {
      res.status(500).json({ message: "Error updating order: " + error.message });
    }
  });

  app.put("/api/admin/users/:id/role", isAdmin, async (req, res) => {
    try {
      const userId = req.params.id;
      const { role } = req.body;
      
      if (!["customer", "admin", "supervisor"].includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
      }
      
      const user = await storage.updateUserRole(userId, role);
      res.json(user);
    } catch (error: any) {
      res.status(500).json({ message: "Error updating user role: " + error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
