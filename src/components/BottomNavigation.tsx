import React from 'react';
import { Home, Search, LayoutGrid, User, ShoppingBag } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setIsSearchOpen, setIsAuthOpen, setIsCartOpen, cart } = useAppContext();

  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

  const navItems = [
    {
      icon: <Home className="w-6 h-6" />,
      label: 'Home',
      onClick: () => navigate('/'),
      isActive: location.pathname === '/'
    },
    {
      icon: <Search className="w-6 h-6" />,
      label: 'Search',
      onClick: () => setIsSearchOpen(true),
      isActive: false
    },
    {
      icon: <LayoutGrid className="w-6 h-6" />,
      label: 'Collection',
      onClick: () => navigate('/collections'),
      isActive: location.pathname.includes('/collections')
    },
    {
      icon: <User className="w-6 h-6" />,
      label: 'Account',
      onClick: () => setIsAuthOpen(true),
      isActive: false
    },
    {
      icon: (
        <div className="relative">
          <ShoppingBag className="w-6 h-6" />
          {cartItemsCount > 0 && (
            <span className="absolute -top-1 -right-2 bg-skullog-red text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
              {cartItemsCount}
            </span>
          )}
        </div>
      ),
      label: 'Cart',
      onClick: () => setIsCartOpen(true),
      isActive: false
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 md:hidden pb-safe">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item, index) => (
          <button
            key={index}
            onClick={item.onClick}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
              item.isActive ? 'text-skullog-red' : 'text-gray-600 hover:text-black'
            }`}
          >
            {item.icon}
            <span className="text-[10px] font-medium tracking-wide">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
