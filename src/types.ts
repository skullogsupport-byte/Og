export type Category = 'Hoodies' | 'Gym wear' | 'Jacket';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: Category;
  images: string[];
  sizes: string[];
  rating: number;
}
