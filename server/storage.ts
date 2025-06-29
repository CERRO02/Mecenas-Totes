import { 
  artists, 
  products, 
  cartItems, 
  orders, 
  orderItems, 
  newsletterSubscribers,
  type Artist, 
  type Product, 
  type CartItem, 
  type Order, 
  type OrderItem,
  type NewsletterSubscriber,
  type InsertArtist, 
  type InsertProduct, 
  type InsertCartItem, 
  type InsertOrder, 
  type InsertOrderItem,
  type InsertNewsletterSubscriber,
  type ProductWithArtist,
  type CartItemWithProduct,
  type OrderWithItems
} from "@shared/schema";

export interface IStorage {
  // Artists
  getArtists(): Promise<Artist[]>;
  getArtist(id: number): Promise<Artist | undefined>;
  getFeaturedArtist(): Promise<Artist | undefined>;
  createArtist(artist: InsertArtist): Promise<Artist>;

  // Products
  getProducts(): Promise<ProductWithArtist[]>;
  getProduct(id: number): Promise<ProductWithArtist | undefined>;
  getFeaturedProducts(): Promise<ProductWithArtist[]>;
  getProductsByArtist(artistId: number): Promise<ProductWithArtist[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  searchProducts(query: string): Promise<ProductWithArtist[]>;

  // Cart
  getCartItems(sessionId: string): Promise<CartItemWithProduct[]>;
  addToCart(item: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: number, quantity: number): Promise<CartItem>;
  removeFromCart(id: number): Promise<void>;
  clearCart(sessionId: string): Promise<void>;

  // Orders
  createOrder(order: InsertOrder): Promise<Order>;
  getOrder(id: number): Promise<OrderWithItems | undefined>;
  getOrderByPaymentIntent(paymentIntentId: string): Promise<Order | undefined>;
  updateOrderStatus(id: number, status: string): Promise<Order>;
  addOrderItems(items: InsertOrderItem[]): Promise<OrderItem[]>;

  // Newsletter
  subscribeToNewsletter(subscriber: InsertNewsletterSubscriber): Promise<NewsletterSubscriber>;
  getNewsletterSubscribers(): Promise<NewsletterSubscriber[]>;
}

export class MemStorage implements IStorage {
  private artists: Map<number, Artist>;
  private products: Map<number, Product>;
  private cartItems: Map<number, CartItem>;
  private orders: Map<number, Order>;
  private orderItems: Map<number, OrderItem>;
  private newsletterSubscribers: Map<number, NewsletterSubscriber>;
  private currentId: { [key: string]: number };

  constructor() {
    this.artists = new Map();
    this.products = new Map();
    this.cartItems = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    this.newsletterSubscribers = new Map();
    this.currentId = {
      artists: 1,
      products: 1,
      cartItems: 1,
      orders: 1,
      orderItems: 1,
      newsletterSubscribers: 1,
    };
    
    this.seedData();
  }

  private async seedData() {
    // Seed artists
    const artistsData = [
      {
        name: "Amy Ma",
        bio: "Hi, I'm Amy Ma, a rising Junior at Lexington High School. As an artist, I explore themes of nature, climate change, immigration, and technology while blending digital and traditional arts. My art is mostly driven by storytelling and the foreshadowing of our unpredictable future. When I'm not creating, I like to play badminton, swim, and read psychological horror.",
        location: "Lexington, MA",
        style: "Digital & Traditional Arts, Environmental Storytelling",
        website: "https://instagram.com/amy.art617" as string | null,
        featured: true as boolean | null,
        featuredWeek: 52 as number | null,
        image: "/attached_assets/Screenshot%202025-06-25%20at%2011.16.42%E2%80%AFAM_1750864605993.png"
      },
      {
        name: "Emma Xu",
        bio: "I'm Emma Xu, a rising junior at Lexington High School, and I've been making art since I was five. Through my art, I attempt to highlight the intricacies of nature, putting emphasis on color and value in my work. I hope to continue making art in the future to potentially submit pieces for competition, as well as to build a larger portfolio. Outside of art, I enjoy playing guitar, baking, and playing tennis.",
        location: "Lexington, MA",
        style: "Nature Art, Color & Value Focus",
        website: "https://instagram.com/lentil.beans.art",
        featured: false,
        featuredWeek: null,
        image: "/emma-xu.png"
      },
      {
        name: "Alexis Zhang",
        bio: "I'm Alexis Zhang, a multidisciplinary artist born and raised in Massachusetts, currently studying at Belmont High School. My art focuses on the complexity of human nature, exploring novel ways to unravel and express the world through my creative lens. When I'm not experimenting with art mediums, you can find me planning meetings for Belmont's Art Therapy Club, filming erhu content for social media, or reading cognitive science articles online.",
        location: "Belmont, MA",
        style: "Multidisciplinary Art, Human Nature Studies",
        website: "https://instagram.com/azhang.artt",
        featured: false,
        featuredWeek: null,
        image: "/attached_assets/11701750971815_.pic_1750971832933.jpg"
      },
      {
        name: "Kimly Nguyen",
        bio: "My name is Kimly Nguyen, and I am a self-taught digital artist from the class of 2027. I have been drawing using Procreate since 2020, but I have also experimented with various traditional media, including colored pencils, markers, and different paints. I resonated with digital art because it was precise, eclectic, and allowed me to capture stories and people in my style. Outside of art, I play volleyball, crochet, do nail art, and play video games.",
        location: "Massachusetts",
        style: "Digital Art, Traditional Media, Storytelling",
        website: "https://instagram.com/kibblessssssss",
        featured: false,
        featuredWeek: null,
        image: "/attached_assets/WechatIMG1171_1750972005584.jpg"
      },
      {
        name: "Angela Wang",
        bio: "Meet Angela! She's 16 years old and currently a rising junior at Needham High School. She took her first art class when she was 5 years old. Over the years, art has become an outlet for her to not only explore the world, but also to express her culture and identity. She's especially into drawing architecture, objects, and scenery! Art will probably stick with her for life, so her goal is pretty simple: keep getting better. Hopefully in the future, she'll be able to draw like WeChat artist 老张和面包 (check him out—he's really cool)! When she's not drawing, you'll find her on the badminton court, on a piano bench, outside taking pictures, or just hanging out with friends. She also loves to read and has an arguably superior music taste. Feel free to reach out to her anytime!",
        location: "Needham, MA",
        style: "Architecture, Objects & Scenery, Cultural Expression",
        website: "https://instagram.com/alegnaaa.art",
        featured: false,
        featuredWeek: null,
        image: "/attached_assets/image_1751241087527.png"
      }
    ];

    for (const artistData of artistsData) {
      await this.createArtist({
        ...artistData,
        website: artistData.website || null,
        featured: artistData.featured || null,
        featuredWeek: artistData.featuredWeek || null
      });
    }

    // Seed products
    const productsData = [
      {
        name: "Climate Future Tote",
        description: "Amy Ma's powerful environmental storytelling design explores climate change themes through digital art that foreshadows our planet's future.",
        price: "36.99",
        salePrice: null,
        image: "https://images.unsplash.com/photo-1569163139394-de4e4f43e4e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        artistId: 1,
        category: "tote-bag",
        inStock: true,
        featured: true
      },
      {
        name: "Nature's Details Tote",
        description: "Emma Xu's intricate nature art celebrates the delicate details often overlooked in the natural world, with stunning color and value work.",
        price: "34.99",
        salePrice: null,
        image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        artistId: 2,
        category: "tote-bag",
        inStock: true,
        featured: true
      },
      {
        name: "Colorful Petals Tote",
        description: "Emma Xu's vibrant exploration of flower petals and botanical forms, showcasing her mastery of color relationships and natural beauty.",
        price: "32.99",
        salePrice: null,
        image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        artistId: 2,
        category: "tote-bag",
        inStock: true,
        featured: false
      },
      {
        name: "Geometric Harmony Tote",
        description: "Minimalist geometric patterns in earth tones, perfect for the modern eco-conscious consumer.",
        price: "36.99",
        salePrice: "24.99",
        image: "https://pixabay.com/get/g41ea7c2a46d73b9057f46861c6e68590218616ce4cdf3a60a265bf148d40218348c5a7328ec7d679a705438ddfd29c0fccc5a5dc6a1a720fdd5672adfc5f0882_1280.jpg",
        artistId: 4,
        category: "tote-bag",
        inStock: true,
        featured: true
      },
      {
        name: "Urban Expression Tote",
        description: "Bold street art meets sustainable fashion in this powerful design that speaks to urban creativity.",
        price: "38.99",
        salePrice: null,
        image: "https://images.unsplash.com/photo-1540932239986-30128078f3c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=400",
        artistId: 5,
        category: "tote-bag",
        inStock: true,
        featured: true
      },
      {
        name: "Immigration Stories Tote",
        description: "Amy Ma's blend of traditional and digital techniques tells the story of human migration and cultural connection.",
        price: "38.99",
        salePrice: null,
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        artistId: 1,
        category: "tote-bag",
        inStock: true,
        featured: true
      },
      {
        name: "Tech & Nature Harmony Tote",
        description: "Amy explores the intersection of technology and nature in this thought-provoking design about our digital future.",
        price: "34.99",
        salePrice: null,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        artistId: 1,
        category: "tote-bag",
        inStock: true,
        featured: true
      },
      {
        name: "Abstract Waves Tote",
        description: "Flowing abstract patterns inspired by ocean waves and natural movement.",
        price: "35.99",
        salePrice: null,
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&h=500",
        artistId: 2,
        category: "tote-bag",
        inStock: true,
        featured: false
      }
    ];

    for (const productData of productsData) {
      await this.createProduct({
        ...productData,
        salePrice: productData.salePrice || null,
        category: productData.category || null,
        inStock: productData.inStock !== undefined ? productData.inStock : null,
        featured: productData.featured !== undefined ? productData.featured : null
      });
    }
  }

  // Artists
  async getArtists(): Promise<Artist[]> {
    return Array.from(this.artists.values());
  }

  async getArtist(id: number): Promise<Artist | undefined> {
    return this.artists.get(id);
  }

  async getFeaturedArtist(): Promise<Artist | undefined> {
    return Array.from(this.artists.values()).find(artist => artist.featured);
  }

  async createArtist(insertArtist: InsertArtist): Promise<Artist> {
    const id = this.currentId.artists++;
    const artist: Artist = { 
      ...insertArtist,
      id,
      website: insertArtist.website || null,
      featured: insertArtist.featured || null,
      featuredWeek: insertArtist.featuredWeek || null
    };
    this.artists.set(id, artist);
    return artist;
  }

  // Products
  async getProducts(): Promise<ProductWithArtist[]> {
    const products = Array.from(this.products.values());
    return products.map(product => ({
      ...product,
      artist: this.artists.get(product.artistId)!
    }));
  }

  async getProduct(id: number): Promise<ProductWithArtist | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;
    
    const artist = this.artists.get(product.artistId);
    if (!artist) return undefined;
    
    return { ...product, artist };
  }

  async getFeaturedProducts(): Promise<ProductWithArtist[]> {
    const products = Array.from(this.products.values()).filter(p => p.featured);
    return products.map(product => ({
      ...product,
      artist: this.artists.get(product.artistId)!
    }));
  }

  async getProductsByArtist(artistId: number): Promise<ProductWithArtist[]> {
    const products = Array.from(this.products.values()).filter(p => p.artistId === artistId);
    return products.map(product => ({
      ...product,
      artist: this.artists.get(product.artistId)!
    }));
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.currentId.products++;
    const product: Product = { 
      ...insertProduct, 
      id,
      salePrice: insertProduct.salePrice || null,
      category: insertProduct.category || null,
      inStock: insertProduct.inStock !== undefined ? insertProduct.inStock : null,
      featured: insertProduct.featured !== undefined ? insertProduct.featured : null
    };
    this.products.set(id, product);
    return product;
  }

  async searchProducts(query: string): Promise<ProductWithArtist[]> {
    const products = Array.from(this.products.values()).filter(product => 
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase())
    );
    return products.map(product => ({
      ...product,
      artist: this.artists.get(product.artistId)!
    }));
  }

  // Cart
  async getCartItems(sessionId: string): Promise<CartItemWithProduct[]> {
    const items = Array.from(this.cartItems.values()).filter(item => item.sessionId === sessionId);
    return items.map(item => {
      const product = this.products.get(item.productId)!;
      const artist = this.artists.get(product.artistId)!;
      return {
        ...item,
        product: { ...product, artist }
      };
    });
  }

  async addToCart(insertItem: InsertCartItem): Promise<CartItem> {
    // Check if item already exists in cart
    const existingItem = Array.from(this.cartItems.values()).find(
      item => item.sessionId === insertItem.sessionId && item.productId === insertItem.productId
    );

    if (existingItem) {
      // Update quantity
      existingItem.quantity += insertItem.quantity || 1;
      this.cartItems.set(existingItem.id, existingItem);
      return existingItem;
    }

    const id = this.currentId.cartItems++;
    const item: CartItem = { 
      ...insertItem, 
      id,
      quantity: insertItem.quantity || 1,
      createdAt: new Date()
    };
    this.cartItems.set(id, item);
    return item;
  }

  async updateCartItem(id: number, quantity: number): Promise<CartItem> {
    const item = this.cartItems.get(id);
    if (!item) throw new Error("Cart item not found");
    
    item.quantity = quantity;
    this.cartItems.set(id, item);
    return item;
  }

  async removeFromCart(id: number): Promise<void> {
    this.cartItems.delete(id);
  }

  async clearCart(sessionId: string): Promise<void> {
    const itemsToRemove = Array.from(this.cartItems.entries())
      .filter(([_, item]) => item.sessionId === sessionId);
    
    itemsToRemove.forEach(([id, _]) => {
      this.cartItems.delete(id);
    });
  }

  // Orders
  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = this.currentId.orders++;
    const order: Order = { 
      ...insertOrder, 
      id,
      status: insertOrder.status || "pending",
      customerEmail: insertOrder.customerEmail || null,
      createdAt: new Date()
    };
    this.orders.set(id, order);
    return order;
  }

  async getOrder(id: number): Promise<OrderWithItems | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;

    const items = Array.from(this.orderItems.values()).filter(item => item.orderId === id);
    const itemsWithProducts = items.map(item => {
      const product = this.products.get(item.productId)!;
      const artist = this.artists.get(product.artistId)!;
      return {
        ...item,
        product: { ...product, artist }
      };
    });

    return { ...order, items: itemsWithProducts };
  }

  async getOrderByPaymentIntent(paymentIntentId: string): Promise<Order | undefined> {
    return Array.from(this.orders.values()).find(
      order => order.stripePaymentIntentId === paymentIntentId
    );
  }

  async updateOrderStatus(id: number, status: string): Promise<Order> {
    const order = this.orders.get(id);
    if (!order) throw new Error("Order not found");
    
    order.status = status;
    this.orders.set(id, order);
    return order;
  }

  async addOrderItems(items: InsertOrderItem[]): Promise<OrderItem[]> {
    const orderItems: OrderItem[] = [];
    
    for (const insertItem of items) {
      const id = this.currentId.orderItems++;
      const item: OrderItem = { ...insertItem, id };
      this.orderItems.set(id, item);
      orderItems.push(item);
    }
    
    return orderItems;
  }

  // Newsletter
  async subscribeToNewsletter(insertSubscriber: InsertNewsletterSubscriber): Promise<NewsletterSubscriber> {
    // Check if email already exists
    const existingSubscriber = Array.from(this.newsletterSubscribers.values()).find(
      sub => sub.email === insertSubscriber.email
    );

    if (existingSubscriber) {
      // Update subscription status
      existingSubscriber.subscribed = insertSubscriber.subscribed ?? true;
      this.newsletterSubscribers.set(existingSubscriber.id, existingSubscriber);
      return existingSubscriber;
    }

    const id = this.currentId.newsletterSubscribers++;
    const subscriber: NewsletterSubscriber = { 
      ...insertSubscriber, 
      id,
      subscribed: insertSubscriber.subscribed ?? true,
      createdAt: new Date()
    };
    this.newsletterSubscribers.set(id, subscriber);
    return subscriber;
  }

  async getNewsletterSubscribers(): Promise<NewsletterSubscriber[]> {
    return Array.from(this.newsletterSubscribers.values()).filter(sub => sub.subscribed);
  }
}

export const storage = new MemStorage();
