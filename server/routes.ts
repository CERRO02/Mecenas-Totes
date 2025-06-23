import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { insertCartItemSchema, insertNewsletterSubscriberSchema } from "@shared/schema";
import { z } from "zod";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

export async function registerRoutes(app: Express): Promise<Server> {
  
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

  // Order confirmation
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

  const httpServer = createServer(app);
  return httpServer;
}
