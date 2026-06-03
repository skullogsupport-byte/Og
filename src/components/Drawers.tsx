import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Minus, Plus, User as UserIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { saveOrderToFirestore } from '../utils/checkout';
import { auth } from '../firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const CartDrawer = () => {
  const { isCartOpen, setIsCartOpen, cart, updateQuantity, removeFromCart, cartTotal, clearCart } = useAppContext();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setIsProcessing(true);

    try {
      const response = await fetch('/api/razorpay/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: cartTotal, currency: 'INR' }),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const order = await response.json();

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || '', // Fallback or provided key
        amount: order.amount,
        currency: order.currency,
        name: "Skullog",
        description: "Checkout Order",
        order_id: order.id,
        handler: async function (response: any) {
          // Payment succeeded
          await saveOrderToFirestore({
            orderId: order.id,
            userId: auth.currentUser?.uid || null,
            customerEmail: auth.currentUser?.email || null,
            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature,
            amount: cartTotal,
            status: 'paid',
            items: cart.map(item => ({
              id: item.id,
              name: item.name,
              size: item.selectedSize,
              quantity: item.quantity,
              price: item.price
            }))
          });
          alert("Payment Successful!");
          setIsCartOpen(false);
          clearCart();
        },
        prefill: {
          name: "Customer Name",
          email: "customer@example.com",
          contact: "9999999999"
        },
        theme: {
          color: "#000000"
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', async function (response: any) {
        console.error("Payment Failed", response.error);
        await saveOrderToFirestore({
          orderId: order.id,
          userId: auth.currentUser?.uid || null,
          customerEmail: auth.currentUser?.email || null,
          amount: cartTotal,
          status: 'failed',
          items: cart.map(item => ({ id: item.id, name: item.name })),
          errorReason: response.error.reason
        });
        alert("Payment failed: " + response.error.description);
      });
      rzp.open();
    } catch (error) {
      console.error(error);
      alert("Error initializing checkout. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

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
                <div className="flex-1 flex flex-col items-center justify-center text-gray-500 gap-4">
                  <p>Your cart is empty.</p>
                  <Link 
                    to="/" 
                    onClick={() => setIsCartOpen(false)}
                    className="mt-2 bg-black text-white px-8 py-3 rounded-xl font-bold uppercase tracking-widest hover:bg-gray-900 transition-colors"
                  >
                    Continue Shopping
                  </Link>
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
                <button 
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  className="w-full bg-black text-white font-bold uppercase tracking-widest py-4 rounded-xl hover:bg-gray-900 transition-colors active:scale-[0.98] disabled:opacity-50"
                >
                  {isProcessing ? 'Processing...' : 'Checkout'}
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
  const { isMenuOpen, setIsMenuOpen, setIsAuthOpen } = useAppContext();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

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
            
            <nav className="flex flex-col p-6 gap-6 flex-1">
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
              
              {user && (
                <Link
                  to="/orders"
                  onClick={() => setIsMenuOpen(false)}
                  className="font-heading text-3xl font-bold uppercase tracking-tight text-gray-400 hover:text-skullog-red transition-colors mt-auto pt-6 border-t border-gray-900"
                >
                  {user.email === 'skullogsupport@gmail.com' ? 'All Orders' : 'My Orders'}
                </Link>
              )}
            </nav>

            <div className="p-6 border-t border-gray-900">
              {user ? (
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    setIsAuthOpen(true);
                  }}
                  className="flex items-center gap-3 w-full bg-gray-900 hover:bg-gray-800 transition-colors rounded-xl p-4"
                >
                  <div className="w-10 h-10 rounded-full bg-gray-800 overflow-hidden shrink-0">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt={user.displayName || 'User'} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-gray-400">
                        {(user.displayName || user.email || 'U')[0].toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <p className="font-bold truncate text-sm">{user.displayName || 'Account'}</p>
                    <p className="text-xs text-gray-400 truncate">{user.email}</p>
                  </div>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    setIsAuthOpen(true);
                  }}
                  className="flex items-center justify-center gap-2 w-full bg-gray-900 hover:bg-gray-800 transition-colors uppercase font-bold tracking-widest text-sm rounded-xl py-4"
                >
                  <UserIcon className="w-4 h-4" />
                  Sign In
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
