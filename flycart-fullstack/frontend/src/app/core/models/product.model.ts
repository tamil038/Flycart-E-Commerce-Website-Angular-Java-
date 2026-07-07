export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  mrp: number;
  image: string;
  rating: number;
  reviewCount: number;
  description: string;
  highlights: string[];
  stock: number;
  tags: string[];
}

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  qty: number;
}

export interface Review {
  id: number;
  productId: number;
  author: string;
  rating: number;
  comment: string;
  date: string;
}
