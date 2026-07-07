import { Injectable } from '@angular/core';
import { Product, Review } from '../models/product.model';

export const CATEGORIES = ['All', 'Electronics', 'Fashion', 'Home & Kitchen', 'Sports & Fitness', 'Beauty'] as const;

const PRODUCTS: Product[] = [
  {
    id: 1, name: 'Pulse Smart Watch', category: 'Electronics', price: 4999, mrp: 6499,
    image: 'assets/img/smartwatch.jpg', rating: 4.4, reviewCount: 128, stock: 34,
    description: 'Track workouts, sleep and heart rate with a bright always-on display and a battery that lasts a week.',
    highlights: ['7-day battery life', 'Heart-rate & SpO2 sensor', '5 ATM water resistance', 'Works with iOS & Android'],
    tags: ['bestseller'],
  },
  {
    id: 2, name: 'Aero Wireless Headphones', category: 'Electronics', price: 2499, mrp: 3299,
    image: 'assets/img/headphone.jpg', rating: 4.2, reviewCount: 94, stock: 51,
    description: 'Over-ear comfort with active noise cancellation, tuned for warm, punchy bass on any commute.',
    highlights: ['Active noise cancellation', '30-hour playback', 'Plush memory-foam ear cups', 'Quick-charge: 10 min = 3 hrs'],
    tags: ['bestseller'],
  },
  {
    id: 3, name: 'Trailblaze Running Shoes', category: 'Sports & Fitness', price: 2999, mrp: 3999,
    image: 'assets/img/runningshoe.jpg', rating: 4.5, reviewCount: 210, stock: 60,
    description: 'A responsive foam midsole and breathable knit upper built for daily miles, rain or shine.',
    highlights: ['Breathable knit mesh', 'Responsive foam cushioning', 'Reflective details for night runs', 'Available true to size'],
    tags: ['bestseller', 'new'],
  },
  {
    id: 4, name: 'Aroma Brew Coffee Maker', category: 'Home & Kitchen', price: 2599, mrp: 3199,
    image: 'assets/img/coffeemaker.jpg', rating: 4.1, reviewCount: 67, stock: 22,
    description: 'Café-style drip coffee at home, with a keep-warm plate and a reusable gold-tone filter.',
    highlights: ['12-cup carafe', 'Programmable auto-start', 'Reusable filter — no paper needed', 'Auto shut-off for safety'],
    tags: [],
  },
  {
    id: 5, name: 'Horizon Polarized Sunglasses', category: 'Fashion', price: 1799, mrp: 2399,
    image: 'assets/img/sunglass.jpg', rating: 4.3, reviewCount: 45, stock: 80,
    description: 'UV400 polarized lenses cut glare without dulling colour, set in a lightweight matte frame.',
    highlights: ['UV400 polarized lenses', 'Lightweight matte frame', 'Anti-scratch coating', 'Unisex fit'],
    tags: ['new'],
  },
  {
    id: 6, name: 'Voyager Laptop Backpack', category: 'Fashion', price: 1899, mrp: 2499,
    image: 'assets/img/lapbackpack.jpg', rating: 4.6, reviewCount: 156, stock: 40,
    description: 'A padded 15.6" laptop sleeve, a USB charging port and water-resistant fabric for daily carry.',
    highlights: ['Fits up to 15.6" laptops', 'Built-in USB charging port', 'Water-resistant fabric', 'Anti-theft back pocket'],
    tags: ['bestseller'],
  },
  {
    id: 7, name: 'Pulse True Wireless Earbuds', category: 'Electronics', price: 1299, mrp: 1799,
    image: 'assets/img/earbuds.jpg', rating: 4.0, reviewCount: 88, stock: 70,
    description: 'Pocket-sized earbuds with a snug fit, punchy bass and a case that tops up on the go.',
    highlights: ['24-hour case battery', 'Touch controls', 'IPX5 sweat resistant', 'Auto-pair with last device'],
    tags: [],
  },
  {
    id: 8, name: 'Nova X Smartphone', category: 'Electronics', price: 27000, mrp: 31000,
    image: 'assets/img/mobile.jpg', rating: 4.3, reviewCount: 302, stock: 15,
    description: 'A smooth 120 Hz display, all-day battery and a capable triple-camera system.',
    highlights: ['6.5" 120 Hz display', '5000 mAh battery', 'Triple rear camera', '128 GB storage'],
    tags: ['bestseller'],
  },
  {
    id: 9, name: 'Silky Shine Shampoo', category: 'Beauty', price: 899, mrp: 1199,
    image: 'assets/img/shampoo.jpg', rating: 4.2, reviewCount: 74, stock: 120,
    description: 'A sulfate-free formula that smooths frizz and adds shine, gentle enough for daily use.',
    highlights: ['Sulfate-free formula', 'Adds visible shine', 'Safe for colour-treated hair', '350 ml bottle'],
    tags: [],
  },
  {
    id: 10, name: 'Skyline Yoga Mat', category: 'Sports & Fitness', price: 1299, mrp: 1699,
    image: 'https://placehold.co/600x600/d62839/fff?text=Yoga+Mat', rating: 4.4, reviewCount: 51, stock: 45,
    description: 'Extra-thick non-slip cushioning for yoga, pilates and floor workouts, with a carry strap.',
    highlights: ['6 mm non-slip cushioning', 'Includes carry strap', 'Sweat and moisture resistant', 'Lightweight at 900 g'],
    tags: ['new'],
  },
  {
    id: 11, name: 'Ember Scented Candle Set', category: 'Home & Kitchen', price: 999, mrp: 1399,
    image: 'https://placehold.co/600x600/a11627/fff?text=Candle+Set', rating: 4.5, reviewCount: 39, stock: 55,
    description: 'Three hand-poured soy candles in warm, cosy scents — a small ritual for the end of the day.',
    highlights: ['Set of 3, 40-hr burn each', '100% soy wax', 'Cotton wicks, no lead', 'Reusable glass jars'],
    tags: ['new'],
  },
  {
    id: 12, name: 'Velvet Matte Lipstick Trio', category: 'Beauty', price: 1299, mrp: 1699,
    image: 'https://placehold.co/600x600/ff7a59/fff?text=Lipstick+Trio', rating: 4.3, reviewCount: 62, stock: 65,
    description: 'Three long-wear matte shades that glide on light and stay put through the day.',
    highlights: ['Long-wear matte finish', 'Set of 3 shades', 'Enriched with vitamin E', 'Cruelty-free'],
    tags: ['bestseller'],
  },
];

const REVIEWS: Review[] = [
  { id: 1, productId: 1, author: 'Ananya R.', rating: 5, comment: 'Battery genuinely lasts a week, and the display is easy to read outdoors.', date: '2026-05-12' },
  { id: 2, productId: 1, author: 'Karthik S.', rating: 4, comment: 'Great value. Wish the strap came in more colours.', date: '2026-04-02' },
  { id: 3, productId: 2, author: 'Meera V.', rating: 4, comment: 'Noise cancellation works well on flights. Comfortable for long wear.', date: '2026-03-21' },
  { id: 4, productId: 3, author: 'Rahul D.', rating: 5, comment: 'My feet stay comfortable even after a 10K. Great cushioning.', date: '2026-05-30' },
  { id: 5, productId: 6, author: 'Priya N.', rating: 5, comment: 'The charging port is so convenient. Fits my 15" laptop with room to spare.', date: '2026-02-14' },
  { id: 6, productId: 8, author: 'Suresh K.', rating: 4, comment: 'Snappy performance and the camera is excellent in daylight.', date: '2026-06-01' },
];

@Injectable({ providedIn: 'root' })
export class ProductService {
  getAll(): Product[] {
    return PRODUCTS;
  }

  getById(id: number): Product | undefined {
    return PRODUCTS.find((p) => p.id === id);
  }

  getFeatured(): Product[] {
    return PRODUCTS.filter((p) => p.tags.includes('bestseller')).slice(0, 4);
  }

  getRelated(product: Product, limit = 4): Product[] {
    return PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, limit);
  }

  getReviews(productId: number): Review[] {
    return REVIEWS.filter((r) => r.productId === productId);
  }

  search(term: string, category: string, sort: string): Product[] {
    let list = [...PRODUCTS];
    if (category && category !== 'All') {
      list = list.filter((p) => p.category === category);
    }
    if (term && term.trim()) {
      const t = term.trim().toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(t) || p.category.toLowerCase().includes(t) || p.tags.some((tag) => tag.includes(t)));
    }
    switch (sort) {
      case 'price-asc': list.sort((a, b) => a.price - b.price); break;
      case 'price-desc': list.sort((a, b) => b.price - a.price); break;
      case 'rating': list.sort((a, b) => b.rating - a.rating); break;
      default: break;
    }
    return list;
  }
}
