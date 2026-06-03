import React from 'react';
import { Menu, Search, ShoppingBag, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export const Header = () => {
  const { cart, setIsCartOpen, setIsMenuOpen, setIsAuthOpen, setIsSearchOpen } = useAppContext();

  const cartQuantity = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left: Logo */}
        <div className="flex-shrink-0 flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-skullog-red flex items-center justify-center rotate-[15deg] rounded-sm">
              <span className="text-white font-black text-xl leading-none -rotate-[15deg] mt-0.5">S</span>
            </div>
            <span className="text-2xl font-black tracking-tighter italic uppercase mt-1">
              SKULL<span className="text-skullog-red">OG</span>
            </span>
          </Link>
        </div>

        {/* Center: Search Bar Placeholder (Hidden on mobile) */}
        <div className="hidden md:flex flex-1 max-w-md mx-12">
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="w-full bg-gray-100 rounded-full py-2 px-6 text-gray-400 text-sm border border-transparent hover:border-gray-200 transition-colors flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            <span>Search collection...</span>
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-6">
          <button 
            title="Search"
            className="md:hidden hover:text-gray-600 transition-colors"
            onClick={() => setIsSearchOpen(true)}
          >
            <Search className="w-6 h-6" />
          </button>
          
          <button 
            title="Account"
            className="hover:text-gray-600 transition-colors hidden sm:block"
            onClick={() => setIsAuthOpen(true)}
          >
            <User className="w-6 h-6" />
          </button>
          
          <button 
            title="Cart"
            className="hover:text-gray-600 transition-colors relative"
            onClick={() => setIsCartOpen(true)}
          >
            <ShoppingBag className="w-6 h-6" />
            {cartQuantity > 0 && (
              <span className="absolute -top-1 -right-1 bg-skullog-red text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white box-content">
                {cartQuantity}
              </span>
            )}
          </button>
          
          <button 
            title="Menu"
            className="hover:text-gray-600 transition-colors"
            onClick={() => setIsMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  );
};
