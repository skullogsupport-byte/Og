import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Minus, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export const CartDrawer = () => {
  const { isCartOpen, setIsCartOpen, cart, updateQuantity, removeFromCart, cartTotal } = useAppContext();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-2xl font-heading font-bold uppercase tracking-tight">Your Cart</h2>
              <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
              {cart.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                  <p>Your cart is empty.</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.cartId} className="flex gap-4">
                    <div className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                      <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-sm leading-tight pr-4">{item.name}</h3>
                          <button onClick={() => removeFromCart(item.cartId)} className="text-gray-400 hover:text-skullog-red transition-colors">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Size: {item.selectedSize}</p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-3 border border-gray-200 rounded-full px-2 py-1">
                          <button onClick={() => updateQuantity(item.cartId, item.quantity - 1)} className="hover:text-skullog-red">
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.cartId, item.quantity + 1)} className="hover:text-skullog-red">
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="font-bold">Rs. {(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {cart.length > 0 && (
              <div className="p-6 border-t border-gray-100 bg-gray-50">
                <div className="flex items-center justify-between font-bold mb-4">
                  <span>Subtotal</span>
                  <span>Rs. {cartTotal.toFixed(2)}</span>
                </div>
                <button className="w-full bg-black text-white font-bold uppercase tracking-widest py-4 rounded-xl hover:bg-gray-900 transition-colors active:scale-[0.98]">
                  Checkout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'New Arrivals', path: '/collections?sort=newest' },
  { label: 'Best Sellers', path: '/collections?sort=featured' },
  { label: 'Hoodies', path: '/collections?category=Hoodies' },
  { label: 'Gym Wear', path: '/collections?category=Gym wear' },
  { label: 'Jacket', path: '/collections?category=Jacket' },
];

export const MenuDrawer = () => {
  const { isMenuOpen, setIsMenuOpen } = useAppContext();

  return (
    <AnimatePresence>
      {isMenuOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMenuOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-sm bg-black text-white z-50 shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between p-6">
              <span className="text-xl font-heading font-bold tracking-tight mt-1">
                SKULL<span className="text-skullog-red">OG</span>
              </span>
              <button onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-gray-900 rounded-full transition-colors">
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
            
            <nav className="flex flex-col p-6 gap-6">
              {navLinks.map((link, i) => (
                <Link
                  key={i}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className="font-heading text-3xl font-bold uppercase tracking-tight hover:text-skullog-red transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
