import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Search as SearchIcon, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { PRODUCTS } from '../data/products';
import { auth } from '../firebase';
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';

export const AuthModal = () => {
  const { isAuthOpen, setIsAuthOpen } = useAppContext();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      setIsAuthOpen(false);
    } catch (error) {
      console.error("Google sign in failed", error);
      alert("Failed to log in with Google.");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsAuthOpen(false);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

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
            className="bg-white rounded-3xl shadow-2xl w-full max-w-sm relative z-10 overflow-hidden text-center"
          >
            <button 
              onClick={() => setIsAuthOpen(false)} 
              className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors z-20"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="p-8 pb-10 mt-6">
              <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-8 text-black">Account</h3>
              
              {user ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 border-2 border-gray-100 shadow-sm">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt={user.displayName || 'User'} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-2xl text-gray-500">
                        {(user.displayName || user.email || 'U')[0].toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-lg leading-tight">{user.displayName || 'User'}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                  <div className="w-full flex gap-2 mt-4">
                    <button 
                      onClick={() => {
                        setIsAuthOpen(false);
                        navigate('/orders');
                      }}
                      className="flex-1 flex items-center justify-center gap-2 bg-black text-white font-bold uppercase tracking-widest py-3 rounded-xl hover:bg-gray-900 transition-colors"
                    >
                      {user.email === 'skullogsupport@gmail.com' ? 'All Orders' : 'My Orders'}
                    </button>
                    <button 
                      onClick={handleLogout}
                      className="flex-none p-3 bg-gray-100 text-black rounded-xl hover:bg-gray-200 transition-colors"
                      title="Sign Out"
                    >
                      <LogOut className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <p className="text-gray-500 mb-2 text-sm">Sign in to manage your orders</p>
                  <button 
                    onClick={handleGoogleLogin}
                    className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 text-black font-bold transition-all hover:bg-gray-50 py-4 rounded-xl shadow-sm hover:shadow active:scale-[0.98]"
                  >
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                    Login with Google
                  </button>
                </div>
              )}
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
