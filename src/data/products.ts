import { Product } from '../types';

export const CATEGORIES = ['All', 'Hoodies', 'Gym wear', 'Jacket'] as const;

export const PRODUCTS: Product[] = [
  // Hoodies
  {
    id: 'h1',
    name: 'SkullOG Heavyweight Hoodie',
    description: 'Premium 400gsm cotton heavyweight hoodie with an oversized fit, drop shoulders, and our signature skull logo embroidered on the chest.',
    price: 85,
    originalPrice: 110,
    category: 'Hoodies',
    images: [
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1616422285623-14bf0c042978?q=80&w=600&auto=format&fit=crop'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    rating: 4.8
  },
  {
    id: 'h2',
    name: 'Ghost Camo Zip-Up',
    description: 'Urban stealth camo zip-up hoodie featuring a YKK double zip, thumbholes, and a distressed finish for extra edge.',
    price: 95,
    category: 'Hoodies',
    images: [
      'https://images.unsplash.com/photo-1509942730568-111100f72dd3?q=80&w=600&auto=format&fit=crop'
    ],
    sizes: ['M', 'L', 'XL'],
    rating: 4.5
  },
  {
    id: 'h3',
    name: 'Phantom Tech Fleece',
    description: 'Lightweight technical fleece hoodie that provides superior warmth without the bulk. Perfect for training or everyday streetwear.',
    price: 110,
    originalPrice: 130,
    category: 'Hoodies',
    images: [
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1578681994506-b8f463449011?q=80&w=600&auto=format&fit=crop'
    ],
    sizes: ['S', 'M', 'L'],
    rating: 4.9
  },
  {
    id: 'h4',
    name: 'Bloodline Essential Hoodie',
    description: 'Our iconic red piece. A vibrant, durable essential with ribbed cuffs and a relaxed fit.',
    price: 75,
    category: 'Hoodies',
    images: [
      'https://images.unsplash.com/photo-1572495646197-850fcc71ee94?q=80&w=600&auto=format&fit=crop'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    rating: 4.6
  },

  // Gym Wear
  {
    id: 'g1',
    name: 'Apex Seamless Tee',
    description: 'Form-fitting seamless t-shirt that stretches and wicks sweat away during intense training sessions.',
    price: 45,
    originalPrice: 60,
    category: 'Gym wear',
    images: [
      'https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=600&auto=format&fit=crop'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    rating: 4.7
  },
  {
    id: 'g2',
    name: 'Compression Rush Tights',
    description: 'Second-skin tights designed for maximum mobility and muscle support. Includes a discreet media pocket.',
    price: 55,
    category: 'Gym wear',
    images: [
      'https://images.unsplash.com/photo-1550534789-9a706509f7a8?q=80&w=600&auto=format&fit=crop'
    ],
    sizes: ['M', 'L'],
    rating: 4.5
  },
  {
    id: 'g3',
    name: 'Powerlift Stringer',
    description: 'Old-school bodybuilding stringer with deep armholes and an aggressive cut on the back to show off your gains.',
    price: 35,
    originalPrice: 40,
    category: 'Gym wear',
    images: [
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto=format&fit=crop'
    ],
    sizes: ['M', 'L', 'XL'],
    rating: 4.8
  },
  {
    id: 'g4',
    name: 'Velocity 2-in-1 Shorts',
    description: 'High-performance shorts with a built-in compression liner and a towel loop. Everything you need for a brutal workout.',
    price: 48,
    category: 'Gym wear',
    images: [
      'https://images.unsplash.com/photo-1563604077678-b11874f63c4e?q=80&w=600&auto=format&fit=crop'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    rating: 4.9
  },

  // Jackets
  {
    id: 'j1',
    name: 'Tactical Bomber',
    description: 'Classic flight jacket silhouette modernized with tactical webbing, multiple utility pockets, and a matte black finish.',
    price: 180,
    category: 'Jacket',
    images: [
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=600&auto=format&fit=crop'
    ],
    sizes: ['M', 'L', 'XL'],
    rating: 4.9
  },
  {
    id: 'j2',
    name: 'Windbreaker Anorak',
    description: 'Water-resistant, packable half-zip anorak with an expansive front kangaroo pocket and adjustable hood.',
    price: 125,
    originalPrice: 150,
    category: 'Jacket',
    images: [
      'https://images.unsplash.com/photo-1525457136159-8878c2323e7f?q=80&w=600&auto=format&fit=crop'
    ],
    sizes: ['S', 'M', 'L'],
    rating: 4.7
  },
  {
    id: 'j3',
    name: 'Stadium Puffer',
    description: 'Oversized quilted puffer jacket for extreme cold. Features thermal lining and bold block lettering on the back.',
    price: 210,
    category: 'Jacket',
    images: [
      'https://images.unsplash.com/photo-1544923363-207d4bfaeccd?q=80&w=600&auto=format&fit=crop'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    rating: 4.6
  },
  {
    id: 'j4',
    name: 'Vanguard Track Jacket',
    description: 'Retro-inspired zip track jacket with racing stripes down the sleeves. Pairs perfectly with our track pants.',
    price: 95,
    originalPrice: 115,
    category: 'Jacket',
    images: [
      'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?q=80&w=600&auto=format&fit=crop'
    ],
    sizes: ['M', 'L', 'XL'],
    rating: 4.5
  }
];
