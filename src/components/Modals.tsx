import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Search as SearchIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { PRODUCTS } from '../data/products';

export const AuthModal = () => {
  const { isAuthOpen, setIsAuthOpen } = useAppContext();
  const [tab, setTab] = useState<'login' | 'register'>('login');

  return (
    <AnimatePresence>
      {isAuthOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsAuthOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden"
          >
            <button 
              onClick={() => setIsAuthOpen(false)} 
              className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors z-20"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex border-b border-gray-100">
              <button 
                onClick={() => setTab('login')}
                className={`flex-1 py-4 font-bold font-heading uppercase tracking-wide text-center transition-colors ${tab === 'login' ? 'text-black border-b-2 border-black' : 'text-gray-400'}`}
              >
                Login
              </button>
              <button 
                onClick={() => setTab('register')}
                className={`flex-1 py-4 font-bold font-heading uppercase tracking-wide text-center transition-colors ${tab === 'register' ? 'text-black border-b-2 border-black' : 'text-gray-400'}`}
              >
                Register
              </button>
            </div>

            <div className="p-8">
              <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
                {tab === 'register' && (
                  <div>
                    <label className="sr-only">Name</label>
                    <input type="text" placeholder="Full Name" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black transition-shadow" />
                  </div>
                )}
                <div>
                  <label className="sr-only">Email</label>
                  <input type="email" placeholder="Email Address" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black transition-shadow" />
                </div>
                <div>
                  <label className="sr-only">Password</label>
                  <input type="password" placeholder="Password" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black transition-shadow" />
                </div>
                <button className="w-full bg-skullog-red text-white font-bold uppercase tracking-widest py-4 rounded-xl hover:bg-red-700 transition-colors mt-2 active:scale-[0.98]">
                  {tab === 'login' ? 'Sign In' : 'Create Account'}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export const SearchModal = () => {
  const { isSearchOpen, setIsSearchOpen } = useAppContext();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const results = query
    ? PRODUCTS.filter(p => p.name.toLowerCase().includes(query.toLowerCase()) || p.category.toLowerCase().includes(query.toLowerCase()))
    : [];

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex flex-col items-center pt-20 p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSearchOpen(false)}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-2xl relative z-10"
          >
            <div className="relative">
              <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6" />
              <input 
                type="text" 
                autoFocus
                placeholder="Search collection..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-white rounded-full pl-16 pr-16 py-5 text-xl font-medium focus:outline-none shadow-2xl"
              />
              <button 
                onClick={() => setIsSearchOpen(false)} 
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {query && (
              <div className="mt-4 bg-white rounded-3xl shadow-xl overflow-hidden max-h-[60vh] overflow-y-auto w-full">
                {results.length > 0 ? (
                  <div className="flex flex-col">
                    {results.map((product) => (
                      <div 
                        key={product.id}
                        onClick={() => {
                          navigate(`/product/${product.id}`);
                          setIsSearchOpen(false);
                          setQuery('');
                        }}
                        className="flex items-center gap-4 p-4 hover:bg-gray-50 border-b border-gray-100 last:border-0 cursor-pointer transition-colors"
                      >
                        <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <h4 className="font-bold">{product.name}</h4>
                          <span className="text-gray-500">Rs. {product.price.toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    No products found for "{query}"
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
