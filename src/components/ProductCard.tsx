import React from 'react';
import { Eye } from 'lucide-react';
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
      className="group flex flex-col h-full cursor-pointer transition-opacity hover:opacity-90"
    >
      {/* Image */}
      <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden w-full shrink-0 mb-4">
        {/* Badges */}
        {product.originalPrice ? (
          <span className="absolute top-3 left-3 bg-skullog-red text-white text-[10px] font-black uppercase px-2 py-1 rounded-full z-10">
            -{Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
          </span>
        ) : null}
        
        {/* Quick View / Eye */}
        <button 
          className="absolute top-3 right-3 bg-white p-2 rounded-full z-10 text-black hover:text-skullog-red shadow-[0_2px_10px_rgba(0,0,0,0.1)] transition-colors"
          onClick={(e) => { e.stopPropagation(); /* Quick view logic */ }}
        >
          <Eye className="w-5 h-5" />
        </button>

        <img 
          src={product.images[0]} 
          alt={product.name} 
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
        />
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 gap-2 text-left">
        <h3 className="font-bold text-sm md:text-base leading-snug">{product.name}</h3>
        <p className="text-gray-500 text-sm font-medium">{product.category}</p>
        <div className="flex items-center gap-2 mt-1">
          {product.originalPrice && (
            <span className="text-gray-500 line-through text-sm md:text-base">Rs. {product.originalPrice.toFixed(2)}</span>
          )}
          <span className="text-skullog-red font-bold text-sm md:text-base">
            Rs. {product.price.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};
