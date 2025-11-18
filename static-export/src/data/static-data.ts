// Static data for Mecenas Totes - includes all artists and products

export interface Artist {
  id: number;
  name: string;
  bio: string;
  location: string;
  style: string;
  website: string | null;
  featured: boolean | null;
  featuredWeek: number | null;
  image: string | null;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  salePrice: string | null;
  image: string;
  images: string[];
  artistId: number;
  category: string | null;
  inStock: boolean | null;
  stock: number;
  featured: boolean | null;
  availability: string;
}

export interface ProductWithArtist extends Product {
  artist: Artist;
}

export const artists: Artist[] = [
  {
    id: 1,
    name: "Amy Ma",
    bio: "Amy Ma is a rising Junior at Lexington High School. As an artist, she explores themes of nature, climate change, immigration, and technology while blending digital and traditional arts. Her art is mostly driven by storytelling and the foreshadowing of our unpredictable future. When she's not creating, she likes to play badminton, swim, and read psychological horror.",
    location: "Lexington, MA",
    style: "Digital & Traditional Arts, Environmental Storytelling",
    website: "https://instagram.com/amy.art617",
    featured: true,
    featuredWeek: 52,
    image: "/api/images/amy-ma.jpg"
  },
  {
    id: 2,
    name: "Emma Xu",
    bio: "Emma Xu is a rising junior at Lexington High School, and she's been making art since she was five. Through her art, she attempts to highlight the intricacies of nature, putting emphasis on color and value in her work. She hopes to continue making art in the future to potentially submit pieces for competition, as well as to build a larger portfolio. Outside of art, she enjoys playing guitar, baking, and playing tennis.",
    location: "Lexington, MA",
    style: "Nature Art, Color & Value Focus",
    website: "https://instagram.com/lentil.beans.art",
    featured: false,
    featuredWeek: null,
    image: "/api/images/emma-xu.jpg"
  },
  {
    id: 3,
    name: "Alexis Zhang",
    bio: "Alexis Zhang is a multidisciplinary artist born and raised in Massachusetts, currently studying at Belmont High School. Her art focuses on the complexity of human nature, exploring novel ways to unravel and express the world through her creative lens. When she's not experimenting with art mediums, you can find her planning meetings for Belmont's Art Therapy Club, filming erhu content for social media, or reading cognitive science articles online.",
    location: "Belmont, MA",
    style: "Multidisciplinary Art, Human Nature Studies",
    website: "https://instagram.com/azhang.artt",
    featured: false,
    featuredWeek: null,
    image: "/api/images/alexis-zhang.jpg"
  },
  {
    id: 4,
    name: "Kimly Nguyen",
    bio: "Kimly Nguyen is a self-taught digital artist from the class of 2027. She has been drawing using Procreate since 2020, but has also experimented with various traditional media, including colored pencils, markers, and different paints. She resonated with digital art because it was precise, eclectic, and allowed her to capture stories and people in her style. Outside of art, she plays volleyball, crochets, does nail art, and plays video games.",
    location: "Lexington, MA",
    style: "Digital Art, Traditional Media, Storytelling",
    website: "https://instagram.com/kibblessssssssss",
    featured: false,
    featuredWeek: null,
    image: "/api/images/kimly-nguyen.jpg"
  },
  {
    id: 5,
    name: "Angela Wang",
    bio: "Meet Angela! She's 16 years old and currently a rising junior at Needham High School. She took her first art class when she was 5 years old. Over the years, art has become an outlet for her to not only explore the world, but also to express her culture and identity. She's especially into drawing architecture, objects, and scenery! Art will probably stick with her for life, so her goal is pretty simple: keep getting better. Hopefully in the future, she'll be able to draw like WeChat artist 老张和面包 (check him out—he's really cool)! When she's not drawing, you'll find her on the badminton court, on a piano bench, outside taking pictures, or just hanging out with friends. She also loves to read and has an arguably superior music taste. Feel free to reach out to her anytime!",
    location: "Needham, MA",
    style: "Architecture, Objects & Scenery, Cultural Expression",
    website: "https://instagram.com/alegnaaa.art",
    featured: false,
    featuredWeek: null,
    image: "/api/images/angela-wang.png"
  },
  {
    id: 6,
    name: "Lucas Dai",
    bio: "Lucas is a rising junior at Lexington High School. He has long worked with colored pencil and graphite but has recently begun experimenting with new mediums such as oil paint and watercolor. Through his art, he explores questions about humanity and its relationship with the natural world. He hopes to continue creating and sharing his work with a wider audience in the future. Outside of drawing, Lucas enjoys playing tennis, competing in Science Olympiad, and spending time with friends.",
    location: "Lexington, MA",
    style: "Colored Pencil, Graphite, Oil Paint, Watercolor",
    website: "https://instagram.com/lucassdai",
    featured: false,
    featuredWeek: null,
    image: "/api/images/lucas-dai.jpg"
  },
  {
    id: 7,
    name: "Jeffrey Liu",
    bio: "Jeffrey Liu is an emerging artist exploring themes of nature and tranquility through traditional landscape painting techniques. His work captures serene mountain scenes with careful attention to atmosphere and natural beauty.",
    location: "Lexington, MA",
    style: "Traditional Landscape, Chinese Art, Nature Scenes",
    website: null,
    featured: false,
    featuredWeek: null,
    image: "/api/images/jeffrey-liu.jpg"
  }
];

const products: Product[] = [
  {
    id: 1,
    name: "Carbon Memory",
    description: "Amy Ma's 'Carbon Memory' - a powerful environmental piece exploring climate change through digital art featuring futuristic characters and swirling energy.",
    price: "19.99",
    salePrice: "16.99",
    image: "/api/images/9_1751684994303.png",
    images: ["/api/images/9_1751684994303.png", "/api/images/10_1751684998869.png"],
    artistId: 1,
    category: "tote-bag",
    inStock: false,
    stock: 0,
    featured: false,
    availability: "coming-soon"
  },
  {
    id: 2,
    name: "Garden Party",
    description: "Emma Xu's 'Garden Party' - a whimsical celebration of nature featuring adorable woodland creatures, flowers, and natural elements in vibrant colors.",
    price: "17.99",
    salePrice: "14.99",
    image: "/api/images/7_1751684943884.png",
    images: ["/api/images/7_1751684943884.png", "/api/images/8_1751684947477.png"],
    artistId: 2,
    category: "tote-bag",
    inStock: false,
    stock: 0,
    featured: false,
    availability: "coming-soon"
  },
  {
    id: 3,
    name: "Daydream",
    description: "Alexis Zhang's 'Daydream' - an introspective piece exploring human consciousness with swirling blues and a contemplative figure surrounded by dreamlike elements.",
    price: "19.99",
    salePrice: "16.99",
    image: "/api/images/11_1751685121994.png",
    images: ["/api/images/11_1751685121994.png", "/api/images/12_1751685131775.png"],
    artistId: 3,
    category: "tote-bag",
    inStock: false,
    stock: 0,
    featured: false,
    availability: "coming-soon"
  },
  {
    id: 4,
    name: "Boxed Like a Fish",
    description: "Kimly Nguyen's 'Boxed Like a Fish' - a playful blue digital illustration showcasing her storytelling abilities and creative character design in Procreate.",
    price: "17.99",
    salePrice: "14.99",
    image: "/api/images/3_1751684658073.png",
    images: ["/api/images/3_1751684658073.png", "/api/images/4_1751684664217.png"],
    artistId: 4,
    category: "tote-bag",
    inStock: false,
    stock: 0,
    featured: false,
    availability: "available"
  },
  {
    id: 5,
    name: "Café July",
    description: "Angela Wang's 'Café July' - a detailed architectural drawing of a charming café scene with intricate line work showcasing her love for buildings and cultural spaces.",
    price: "17.99",
    salePrice: "14.99",
    image: "/api/images/1_1751684360702.png",
    images: ["/api/images/1_1751684360702.png", "/api/images/2_1751684371094.png"],
    artistId: 5,
    category: "tote-bag",
    inStock: false,
    stock: 0,
    featured: false,
    availability: "available"
  },
  {
    id: 6,
    name: "Don't Litter This Moment",
    description: "Lucas Dai's 'Don't Litter This Moment' - a beautiful environmental message featuring a serene lake scene painted in his signature watercolor style, promoting nature conservation.",
    price: "19.99",
    salePrice: "16.99",
    image: "/api/images/13_1751685146749.png",
    images: ["/api/images/13_1751685146749.png", "/api/images/14_1751685149891.png"],
    artistId: 6,
    category: "tote-bag",
    inStock: false,
    stock: 0,
    featured: false,
    availability: "coming-soon"
  },
  {
    id: 7,
    name: "悬空山桂",
    description: "Jeffrey Liu's traditional Chinese landscape painting featuring misty mountains and natural scenery with Chinese calligraphy, showcasing his mastery of classical techniques.",
    price: "17.99",
    salePrice: "14.99",
    image: "/api/images/5_1751684843595.png",
    images: ["/api/images/5_1751684843595.png", "/api/images/6_1751684847264.png"],
    artistId: 7,
    category: "tote-bag",
    inStock: false,
    stock: 0,
    featured: false,
    availability: "available"
  }
];

// Create products with artist information
export const productsWithArtists: ProductWithArtist[] = products.map(product => {
  const artist = artists.find(a => a.id === product.artistId)!;
  return {
    ...product,
    artist
  };
});

export const getProducts = () => productsWithArtists;
export const getArtists = () => artists;
export const getProduct = (id: number) => productsWithArtists.find(p => p.id === id);
export const getArtist = (id: number) => artists.find(a => a.id === id);
