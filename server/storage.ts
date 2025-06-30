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
        bio: "Amy Ma is a rising Junior at Lexington High School. As an artist, she explores themes of nature, climate change, immigration, and technology while blending digital and traditional arts. Her art is mostly driven by storytelling and the foreshadowing of our unpredictable future. When she's not creating, she likes to play badminton, swim, and read psychological horror.",
        location: "Lexington, MA",
        style: "Digital & Traditional Arts, Environmental Storytelling",
        website: "https://instagram.com/amy.art617" as string | null,
        featured: true as boolean | null,
        featuredWeek: 52 as number | null,
        image: "/attached_assets/Screenshot%202025-06-25%20at%2011.16.42%E2%80%AFAM_1750864605993.png"
      },
      {
        name: "Emma Xu",
        bio: "Emma Xu is a rising junior at Lexington High School, and she's been making art since she was five. Through her art, she attempts to highlight the intricacies of nature, putting emphasis on color and value in her work. She hopes to continue making art in the future to potentially submit pieces for competition, as well as to build a larger portfolio. Outside of art, she enjoys playing guitar, baking, and playing tennis.",
        location: "Lexington, MA",
        style: "Nature Art, Color & Value Focus",
        website: "https://instagram.com/lentil.beans.art",
        featured: false,
        featuredWeek: null,
        image: "/emma-xu.png"
      },
      {
        name: "Alexis Zhang",
        bio: "Alexis Zhang is a multidisciplinary artist born and raised in Massachusetts, currently studying at Belmont High School. Her art focuses on the complexity of human nature, exploring novel ways to unravel and express the world through her creative lens. When she's not experimenting with art mediums, you can find her planning meetings for Belmont's Art Therapy Club, filming erhu content for social media, or reading cognitive science articles online.",
        location: "Belmont, MA",
        style: "Multidisciplinary Art, Human Nature Studies",
        website: "https://instagram.com/azhang.artt",
        featured: false,
        featuredWeek: null,
        image: "/attached_assets/11701750971815_.pic_1750971832933.jpg"
      },
      {
        name: "Kimly Nguyen",
        bio: "Kimly Nguyen is a self-taught digital artist from the class of 2027. She has been drawing using Procreate since 2020, but has also experimented with various traditional media, including colored pencils, markers, and different paints. She resonated with digital art because it was precise, eclectic, and allowed her to capture stories and people in her style. Outside of art, she plays volleyball, crochets, does nail art, and plays video games.",
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
      },
      {
        name: "Lucas Dai",
        bio: "Lucas is a rising junior at Lexington High School. He has long worked with colored pencil and graphite but has recently begun experimenting with new mediums such as oil paint and watercolor. Through his art, he explores questions about humanity and its relationship with the natural world. He hopes to continue creating and sharing his work with a wider audience in the future. Outside of drawing, Lucas enjoys playing tennis, competing in Science Olympiad, and spending time with friends.",
        location: "Lexington, MA",
        style: "Colored Pencil, Graphite, Oil Paint, Watercolor",
        website: "https://instagram.com/lucassdai",
        featured: false,
        featuredWeek: null,
        image: "/attached_assets/WechatIMG1178_1751242295860.jpg"
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

    // Seed products - using actual tote bag design images from PDF once available
    const productsData = [
      {
        name: "Amy Ma Design Tote",
        description: "Original tote bag design by Amy Ma, featuring her signature environmental storytelling through digital and traditional art techniques.",
        price: "36.99",
        salePrice: null,
        image: "/attached_assets/tote_design_drafts_1751242641261.pdf",
        artistId: 1,
        category: "tote-bag",
        inStock: true,
        featured: true
      },
      {
        name: "Emma Xu Design Tote",
        description: "Original tote bag design by Emma Xu, showcasing her intricate nature art with emphasis on color and natural details.",
        price: "34.99",
        salePrice: null,
        image: "/attached_assets/tote_design_drafts_1751242641261.pdf",
        artistId: 2,
        category: "tote-bag",
        inStock: true,
        featured: true
      },
      {
        name: "Alexis Zhang Design Tote",
        description: "Original tote bag design by Alexis Zhang, reflecting her multidisciplinary approach to exploring human nature complexity.",
        price: "35.99",
        salePrice: null,
        image: "/attached_assets/tote_design_drafts_1751242641261.pdf",
        artistId: 3,
        category: "tote-bag",
        inStock: true,
        featured: false
      },
      {
        name: "Kimly Nguyen Design Tote",
        description: "Original tote bag design by Kimly Nguyen, featuring her digital art storytelling style created with Procreate techniques.",
        price: "33.99",
        salePrice: null,
        image: "/attached_assets/tote_design_drafts_1751242641261.pdf",
        artistId: 4,
        category: "tote-bag",
        inStock: true,
        featured: false
      },
      {
        name: "Angela Wang Design Tote",
        description: "Original tote bag design by Angela Wang, inspired by architecture, objects, scenery, and cultural expression themes.",
        price: "35.99",
        salePrice: null,
        image: "/attached_assets/tote_design_drafts_1751242641261.pdf",
        artistId: 5,
        category: "tote-bag",
        inStock: true,
        featured: false
      },
      {
        name: "Lucas Dai Design Tote",
        description: "Original tote bag design by Lucas Dai, exploring humanity's relationship with nature through his colored pencil and watercolor artistry.",
        price: "34.99",
        salePrice: null,
        image: "/attached_assets/tote_design_drafts_1751242641261.pdf",
        artistId: 6,
        category: "tote-bag",
        inStock: true,
        featured: false
      },
      {
        name: "Jeffrey Liu Design Tote",
        description: "Original tote bag design by Jeffrey Liu - coming soon! Watch this space for his unique artistic perspective.",
        price: "35.99",
        salePrice: null,
        image: "/attached_assets/tote_design_drafts_1751242641261.pdf",
        artistId: 7, // Will be updated when Jeffrey is added
        category: "tote-bag",
        inStock: false, // Coming soon
        featured: false
      },

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
