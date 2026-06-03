import React from 'react';
import { ShoppingBag, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../types';

interface Props {
  product: Product;
  key?: React.Key | string | number;
}

export const ProductCard = ({ product }: Props) => {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(`/product/${product.id}`)}
      className="group bg-white rounded-2xl border border-gray-100 overflow-hidden flex flex-col h-full cursor-pointer hover:shadow-lg transition-shadow"
    >
      {/* Image */}
      <div className="relative h-48 lg:h-64 bg-gray-100 overflow-hidden w-full shrink-0">
        {/* Badges */}
        {product.originalPrice ? (
          <span className="absolute top-3 left-3 bg-skullog-red text-white text-[10px] font-black uppercase px-2 py-1 rounded-full z-10">
            -{Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
          </span>
        ) : null}
        
        {/* Wishlist */}
        <button 
          className="absolute top-3 right-3 bg-white/80 backdrop-blur-md p-2 rounded-full z-10 hover:text-skullog-red transition-colors text-gray-600 shadow-sm"
          onClick={(e) => { e.stopPropagation(); /* Add to wishlist logic */ }}
        >
          <Heart className="w-4 h-4" />
        </button>

        <img 
          src={product.images[0]} 
          alt={product.name} 
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 hover:scale-105"
        />
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1 gap-1 justify-between">
        <div>
          <h3 className="font-bold text-sm uppercase truncate">{product.name}</h3>
          <div className="flex items-center gap-2">
            <span className="font-black text-lg">${product.price}</span>
            {product.originalPrice && (
              <span className="text-gray-400 text-xs line-through">${product.originalPrice}</span>
            )}
          </div>
        </div>
        
        {/* CTA */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/product/${product.id}`);
          }}
          className="mt-3 w-full bg-gray-50 border border-gray-200 group-hover:bg-black group-hover:text-white group-hover:border-black py-2 rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          <ShoppingBag className="w-4 h-4" />
          <span className="text-xs font-bold uppercase">Add To Bag</span>
        </button>
      </div>
    </div>
  );
};
