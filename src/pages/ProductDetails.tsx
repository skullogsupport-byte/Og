import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Star, Minus, Plus, ShoppingBag } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { useAppContext } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';

export const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useAppContext();
  
  const product = PRODUCTS.find(p => p.id === id);
  const related = PRODUCTS.filter(p => p.category === product?.category && p.id !== product?.id).slice(0, 4);

  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-32">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <button onClick={() => navigate('/collections')} className="text-skullog-red hover:underline">
          Return to Collections
        </button>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size first.");
      return;
    }
    addToCart(product, selectedSize, quantity);
  };

  return (
    <div className="flex-1 bg-white">
      {/* Breadcrumbs */}
      <div className="hidden md:flex max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 items-center gap-2 text-sm text-gray-400 font-medium uppercase tracking-wider">
        <Link to="/" className="hover:text-black transition-colors">Home</Link>
        <ChevronRight className="w-4 h-4" />
        <Link to={`/collections?category=${product.category}`} className="hover:text-black transition-colors">{product.category}</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-black truncate">{product.name}</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8 flex flex-col md:flex-row gap-8 lg:gap-16">
        
        {/* Left: Images */}
        <div className="w-full md:w-1/2 flex flex-col gap-4">
          <div className="w-full aspect-[4/5] bg-gray-100 rounded-3xl overflow-hidden relative">
            <img 
              src={product.images[activeImage]} 
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto no-scrollbar">
              {product.images.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`w-20 h-24 flex-shrink-0 bg-gray-100 rounded-xl overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-black' : 'border-transparent opacity-60 hover:opacity-100'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Details */}
        <div className="w-full md:w-1/2 flex flex-col py-2 md:py-8">
          <div className="flex items-center gap-1 text-skullog-red mb-2">
            {[1, 2, 3, 4, 5].map(star => (
              <Star key={star} className={`w-4 h-4 ${star <= Math.round(product.rating) ? 'fill-current' : 'text-gray-300'}`} />
            ))}
            <span className="text-black font-bold text-sm ml-2">({product.rating} Reviews)</span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-heading font-black italic uppercase tracking-tighter leading-none mb-2">
            {product.name}
          </h1>
          
          <div className="text-2xl md:text-3xl font-bold flex items-center gap-3 mt-4 mb-6">
            <span>${product.price}</span>
            {product.originalPrice && (
              <span className="text-gray-400 line-through text-xl md:text-2xl">${product.originalPrice}</span>
            )}
            {product.originalPrice && (
              <span className="bg-skullog-red text-white text-xs px-2 py-1 rounded-full uppercase tracking-widest self-center ml-2">
                Save ${product.originalPrice - product.price}
              </span>
            )}
          </div>

          <p className="text-gray-600 mb-8 border-b border-gray-100 pb-8 leading-relaxed">
            {product.description}
          </p>

          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="font-bold uppercase tracking-wider text-sm">Select Size</span>
              <button className="text-sm text-gray-500 underline hover:text-black">Size Guide</button>
            </div>
            <div className="flex flex-wrap gap-3">
              {product.sizes.map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`w-14 h-14 font-bold border-2 rounded-2xl flex items-center justify-center transition-all ${
                    selectedSize === size 
                      ? 'border-black bg-black text-white scale-105' 
                      : 'border-gray-200 text-black hover:border-gray-400'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-4 mb-8">
            <div className="flex items-center justify-between border-2 border-gray-200 rounded-2xl px-4 py-2 w-32 h-14">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="hover:text-skullog-red transition-colors">
                <Minus className="w-5 h-5" />
              </button>
              <span className="font-bold text-lg">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="hover:text-skullog-red transition-colors">
                <Plus className="w-5 h-5" />
              </button>
            </div>
            
            <button 
              onClick={handleAddToCart}
              className="flex-1 bg-black text-white font-bold h-14 rounded-2xl flex items-center justify-center gap-2 hover:bg-gray-900 transition-colors active:scale-[0.98]"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="uppercase tracking-widest text-sm">Add to Bag</span>
            </button>
          </div>

          {/* Dummy Accents */}
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 space-y-3 mt-auto">
            <div className="flex text-sm">
              <span className="font-bold w-32">Shipping</span>
              <span className="text-gray-500 text-right flex-1">Free standard on orders &gt; $150</span>
            </div>
            <div className="flex text-sm">
              <span className="font-bold w-32">Returns</span>
              <span className="text-gray-500 text-right flex-1">30 days, no questions asked</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 border-t border-gray-100">
          <h2 className="text-2xl md:text-3xl font-heading font-black italic uppercase tracking-tight mb-8">
            Complete The Look
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-6">
            {related.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
