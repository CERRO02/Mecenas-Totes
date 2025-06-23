import { pgTable, text, serial, integer, boolean, decimal, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const artists = pgTable("artists", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  bio: text("bio").notNull(),
  location: text("location").notNull(),
  style: text("style").notNull(),
  website: text("website"),
  featured: boolean("featured").default(false),
  featuredWeek: integer("featured_week"),
  image: text("image").notNull(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  salePrice: decimal("sale_price", { precision: 10, scale: 2 }),
  image: text("image").notNull(),
  artistId: integer("artist_id").references(() => artists.id).notNull(),
  category: text("category").default("tote-bag"),
  inStock: boolean("in_stock").default(true),
  featured: boolean("featured").default(false),
});

export const cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  productId: integer("product_id").references(() => products.id).notNull(),
  quantity: integer("quantity").notNull().default(1),
  createdAt: timestamp("created_at").defaultNow(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  stripePaymentIntentId: text("stripe_payment_intent_id").notNull(),
  status: text("status").notNull().default("pending"),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  customerEmail: text("customer_email"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id).notNull(),
  productId: integer("product_id").references(() => products.id).notNull(),
  quantity: integer("quantity").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
});

export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  subscribed: boolean("subscribed").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertArtistSchema = createInsertSchema(artists).omit({ id: true });
export const insertProductSchema = createInsertSchema(products).omit({ id: true });
export const insertCartItemSchema = createInsertSchema(cartItems).omit({ id: true, createdAt: true });
export const insertOrderSchema = createInsertSchema(orders).omit({ id: true, createdAt: true });
export const insertOrderItemSchema = createInsertSchema(orderItems).omit({ id: true });
export const insertNewsletterSubscriberSchema = createInsertSchema(newsletterSubscribers).omit({ id: true, createdAt: true });

// Types
export type Artist = typeof artists.$inferSelect;
export type Product = typeof products.$inferSelect;
export type CartItem = typeof cartItems.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type OrderItem = typeof orderItems.$inferSelect;
export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect;

export type InsertArtist = z.infer<typeof insertArtistSchema>;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type InsertCartItem = z.infer<typeof insertCartItemSchema>;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;
export type InsertNewsletterSubscriber = z.infer<typeof insertNewsletterSubscriberSchema>;

// Extended types for frontend
export type ProductWithArtist = Product & { artist: Artist };
export type CartItemWithProduct = CartItem & { product: ProductWithArtist };
export type OrderWithItems = Order & { items: (OrderItem & { product: ProductWithArtist })[] };
