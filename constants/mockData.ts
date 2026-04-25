export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  reviews: number;
  category: string;
  categoryId: string;
  image: string;
  images: string[];
  description: string;
  brand: string;
  inStock: boolean;
  badge?: string;
  tags: string[];
  sold: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  productCount: number;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  avatar: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';
  date: string;
  address: Address;
  paymentMethod: string;
  trackingId?: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Address {
  id: string;
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export const CATEGORIES: Category[] = [
  { id: 'electronics', name: 'Electronics', icon: 'devices', color: '#1565C0', productCount: 48 },
  { id: 'fashion', name: 'Fashion', icon: 'checkroom', color: '#6A1B9A', productCount: 126 },
  { id: 'home', name: 'Home & Living', icon: 'home', color: '#2E7D32', productCount: 84 },
  { id: 'sports', name: 'Sports', icon: 'sports-soccer', color: '#E65100', productCount: 62 },
  { id: 'beauty', name: 'Beauty', icon: 'spa', color: '#AD1457', productCount: 95 },
  { id: 'books', name: 'Books', icon: 'menu-book', color: '#4527A0', productCount: 210 },
  { id: 'grocery', name: 'Grocery', icon: 'local-grocery-store', color: '#1B5E20', productCount: 340 },
  { id: 'toys', name: 'Toys', icon: 'toys', color: '#F57F17', productCount: 78 },
];

export const PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Sony WH-1000XM5 Wireless Headphones',
    price: 24999,
    originalPrice: 34990,
    discount: 28,
    rating: 4.8,
    reviews: 2847,
    category: 'Electronics',
    categoryId: 'electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&q=80',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&q=80',
    ],
    description: 'Industry-leading noise canceling with Dual Noise Sensor technology. Next-level music with 8 mics for clear calls. Up to 30-hour battery life with quick charging (3 min charge = 3 hours playback).',
    brand: 'Sony',
    inStock: true,
    badge: 'Bestseller',
    tags: ['wireless', 'noise-canceling', 'premium'],
    sold: 12400,
  },
  {
    id: 'p2',
    name: 'Apple iPhone 15 Pro 256GB Natural Titanium',
    price: 119900,
    originalPrice: 134900,
    discount: 11,
    rating: 4.9,
    reviews: 5621,
    category: 'Electronics',
    categoryId: 'electronics',
    image: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?w=400&q=80',
    images: [
      'https://images.unsplash.com/photo-1696446701796-da61225697cc?w=600&q=80',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&q=80',
    ],
    description: 'iPhone 15 Pro. Titanium. So strong. So light. So Pro. 48MP Main camera with 3x Optical zoom. A17 Pro chip with 6-core GPU. Action button.',
    brand: 'Apple',
    inStock: true,
    badge: 'Top Rated',
    tags: ['smartphone', '5G', 'premium'],
    sold: 8920,
  },
  {
    id: 'p3',
    name: 'Nike Air Max 270 Running Shoes',
    price: 8995,
    originalPrice: 12995,
    discount: 31,
    rating: 4.5,
    reviews: 1893,
    category: 'Sports',
    categoryId: 'sports',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=80',
    ],
    description: 'Nike Air Max 270 delivers an ultra-soft ride for all-day wear. Large Max Air heel unit provides plush cushioning. Engineered mesh upper is lightweight and breathable.',
    brand: 'Nike',
    inStock: true,
    badge: 'Deal',
    tags: ['running', 'sports', 'Nike'],
    sold: 4300,
  },
  {
    id: 'p4',
    name: 'Samsung 55" 4K QLED Smart TV',
    price: 54990,
    originalPrice: 89990,
    discount: 39,
    rating: 4.6,
    reviews: 3241,
    category: 'Electronics',
    categoryId: 'electronics',
    image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=400&q=80',
    images: [
      'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=600&q=80',
    ],
    description: 'Quantum Dot technology for brilliant color. 100% Color Volume with Quantum Dot. Quantum HDR 12X. Object Tracking Sound+. Smart TV powered by Tizen.',
    brand: 'Samsung',
    inStock: true,
    badge: 'Hot Deal',
    tags: ['TV', '4K', 'QLED', 'Smart TV'],
    sold: 2180,
  },
  {
    id: 'p5',
    name: 'Lakme 9to5 Primer + Matte Lipstick',
    price: 399,
    originalPrice: 599,
    discount: 33,
    rating: 4.3,
    reviews: 6782,
    category: 'Beauty',
    categoryId: 'beauty',
    image: 'https://images.unsplash.com/photo-1586495777744-4e6232bf5001?w=400&q=80',
    images: [
      'https://images.unsplash.com/photo-1586495777744-4e6232bf5001?w=600&q=80',
    ],
    description: 'Lakme 9to5 Primer + Matte Lip Color is a 2-in-1 lipstick that provides perfect matte finish that stays all day. Enriched with primer for smooth application.',
    brand: 'Lakme',
    inStock: true,
    tags: ['lipstick', 'matte', 'beauty'],
    sold: 18900,
  },
  {
    id: 'p6',
    name: 'Polo Assn. Men\'s Regular Fit T-Shirt',
    price: 699,
    originalPrice: 1499,
    discount: 53,
    rating: 4.2,
    reviews: 4521,
    category: 'Fashion',
    categoryId: 'fashion',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80',
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80',
    ],
    description: 'Classic polo shirt with premium cotton blend. Comfortable fit for everyday wear. Available in multiple colors. Machine washable.',
    brand: 'US Polo Assn.',
    inStock: true,
    tags: ['tshirt', 'casual', 'fashion'],
    sold: 23400,
  },
  {
    id: 'p7',
    name: 'Instant Pot Duo 7-in-1 Electric Pressure Cooker',
    price: 6999,
    originalPrice: 10999,
    discount: 36,
    rating: 4.7,
    reviews: 9823,
    category: 'Home & Living',
    categoryId: 'home',
    image: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=400&q=80',
    images: [
      'https://images.unsplash.com/photo-1585515320310-259814833e62?w=600&q=80',
    ],
    description: '7-in-1 multi-use programmable cooker: pressure cooker, slow cooker, rice cooker, steamer, saute pan, yogurt maker, and warmer. 6 Quart capacity.',
    brand: 'Instant Pot',
    inStock: true,
    badge: 'Amazon\'s Choice',
    tags: ['kitchen', 'cooker', 'home'],
    sold: 31200,
  },
  {
    id: 'p8',
    name: 'Kindle Paperwhite 16GB Waterproof E-reader',
    price: 11999,
    originalPrice: 16999,
    discount: 29,
    rating: 4.8,
    reviews: 7234,
    category: 'Electronics',
    categoryId: 'electronics',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80',
    images: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&q=80',
    ],
    description: 'The thinnest, lightest Paperwhite ever. Adjustable warm light. 16GB storage. Waterproof (IPX8). 10 weeks battery life. 6.8" 300 ppi glare-free display.',
    brand: 'Amazon',
    inStock: true,
    tags: ['ereader', 'books', 'kindle'],
    sold: 5600,
  },
  {
    id: 'p9',
    name: 'Adidas Ultraboost 23 Running Shoes',
    price: 12995,
    originalPrice: 17995,
    discount: 28,
    rating: 4.6,
    reviews: 2103,
    category: 'Sports',
    categoryId: 'sports',
    image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&q=80',
    images: [
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&q=80',
    ],
    description: 'BOOST midsole technology returns energy with every step. Linear Energy Push system for increased propulsion. Flexible Stretchweb outsole.',
    brand: 'Adidas',
    inStock: true,
    tags: ['running', 'sports', 'Adidas'],
    sold: 3800,
  },
  {
    id: 'p10',
    name: 'L\'Oreal Paris Serum Foundation',
    price: 799,
    originalPrice: 1299,
    discount: 38,
    rating: 4.4,
    reviews: 5421,
    category: 'Beauty',
    categoryId: 'beauty',
    image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&q=80',
    images: [
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&q=80',
    ],
    description: 'True Match Super Blendable Foundation. 30 true-to-skin undertone shades. Hyaluronic acid infused. Natural healthy glow. SPF 17 sun protection.',
    brand: "L'Oreal Paris",
    inStock: true,
    tags: ['foundation', 'makeup', 'beauty'],
    sold: 14200,
  },
  {
    id: 'p11',
    name: 'LEGO Technic Lamborghini Sian FKP 37',
    price: 14999,
    originalPrice: 24999,
    discount: 40,
    rating: 4.9,
    reviews: 1872,
    category: 'Toys',
    categoryId: 'toys',
    image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&q=80',
    images: [
      'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600&q=80',
    ],
    description: '3696 piece LEGO Technic set. 1:8 scale replica of the Lamborghini Sian FKP 37. Working steering, V12 engine with moving pistons. For ages 18+.',
    brand: 'LEGO',
    inStock: true,
    badge: 'Limited Deal',
    tags: ['LEGO', 'toys', 'collector'],
    sold: 920,
  },
  {
    id: 'p12',
    name: 'Atomic Habits by James Clear',
    price: 399,
    originalPrice: 799,
    discount: 50,
    rating: 4.9,
    reviews: 48293,
    category: 'Books',
    categoryId: 'books',
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&q=80',
    images: [
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&q=80',
    ],
    description: 'No. 1 New York Times bestseller. An Easy & Proven Way to Build Good Habits & Break Bad Ones. Over 15 million copies sold worldwide.',
    brand: 'Penguin Random House',
    inStock: true,
    badge: 'Bestseller',
    tags: ['self-help', 'habits', 'productivity'],
    sold: 89200,
  },
];

export const REVIEWS: Review[] = [
  { id: 'r1', productId: 'p1', userId: 'u1', userName: 'Rahul Sharma', rating: 5, comment: 'Absolutely amazing sound quality! The noise cancellation is top-notch. Worth every penny!', date: '2024-03-15', avatar: 'https://i.pravatar.cc/100?img=1' },
  { id: 'r2', productId: 'p1', userId: 'u2', userName: 'Priya Verma', rating: 5, comment: 'Best headphones I\'ve ever used. Battery life is incredible. Highly recommended!', date: '2024-03-10', avatar: 'https://i.pravatar.cc/100?img=2' },
  { id: 'r3', productId: 'p1', userId: 'u3', userName: 'Amit Kumar', rating: 4, comment: 'Great product! Only minor issue is the carrying case could be better. Sound quality is superb.', date: '2024-03-05', avatar: 'https://i.pravatar.cc/100?img=3' },
];

export const MOCK_ORDERS: Order[] = [
  {
    id: 'TYF001234',
    userId: 'user1',
    items: [
      { productId: 'p1', name: 'Sony WH-1000XM5', price: 24999, quantity: 1, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&q=80' },
    ],
    total: 24999,
    status: 'Delivered',
    date: '2024-03-10',
    address: { id: 'a1', name: 'Rahul Sharma', phone: '9876543210', line1: '123 MG Road', city: 'Bangalore', state: 'Karnataka', pincode: '560001', isDefault: true },
    paymentMethod: 'UPI',
    trackingId: 'DTDC89274823',
  },
  {
    id: 'TYF001235',
    userId: 'user1',
    items: [
      { productId: 'p3', name: 'Nike Air Max 270', price: 8995, quantity: 2, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&q=80' },
      { productId: 'p12', name: 'Atomic Habits', price: 399, quantity: 1, image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=200&q=80' },
    ],
    total: 18389,
    status: 'Shipped',
    date: '2024-03-18',
    address: { id: 'a1', name: 'Rahul Sharma', phone: '9876543210', line1: '123 MG Road', city: 'Bangalore', state: 'Karnataka', pincode: '560001', isDefault: true },
    paymentMethod: 'Cash on Delivery',
    trackingId: 'BLUEDART928471',
  },
  {
    id: 'TYF001236',
    userId: 'user1',
    items: [
      { productId: 'p7', name: 'Instant Pot Duo 7-in-1', price: 6999, quantity: 1, image: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=200&q=80' },
    ],
    total: 6999,
    status: 'Pending',
    date: '2024-03-20',
    address: { id: 'a1', name: 'Rahul Sharma', phone: '9876543210', line1: '123 MG Road', city: 'Bangalore', state: 'Karnataka', pincode: '560001', isDefault: true },
    paymentMethod: 'Card',
  },
];

export const MOCK_USERS = [
  { id: 'u1', name: 'Rahul Sharma', email: 'rahul@example.com', phone: '9876543210', orders: 8, status: 'Active', joined: '2023-11-10', avatar: 'https://i.pravatar.cc/100?img=1' },
  { id: 'u2', name: 'Priya Verma', email: 'priya@example.com', phone: '9876543211', orders: 15, status: 'Active', joined: '2023-10-05', avatar: 'https://i.pravatar.cc/100?img=2' },
  { id: 'u3', name: 'Amit Kumar', email: 'amit@example.com', phone: '9876543212', orders: 3, status: 'Active', joined: '2024-01-15', avatar: 'https://i.pravatar.cc/100?img=3' },
  { id: 'u4', name: 'Sneha Patel', email: 'sneha@example.com', phone: '9876543213', orders: 22, status: 'Active', joined: '2023-09-20', avatar: 'https://i.pravatar.cc/100?img=4' },
  { id: 'u5', name: 'Vikas Singh', email: 'vikas@example.com', phone: '9876543214', orders: 1, status: 'Blocked', joined: '2024-02-01', avatar: 'https://i.pravatar.cc/100?img=5' },
];

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
};
