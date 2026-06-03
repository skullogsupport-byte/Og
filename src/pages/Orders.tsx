import React, { useEffect, useState, useMemo } from 'react';
import { db, auth } from '../firebase';
import { collection, query, where, getDocs, orderBy, Timestamp, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';
import { PackageOpen, Clock, CheckCircle, XCircle, Trash2, Mail, Truck, PackageCheck, MessageCircle, MessageSquare, Copy } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';

interface OrderItem {
  id: string;
  name: string;
  size?: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  orderId: string;
  amount: number;
  status: string;
  items: OrderItem[];
  createdAt: Timestamp;
  customerEmail?: string;
}

type AdminTab = 'New Orders' | 'Draft Orders' | 'Abandoned Carts' | 'Delivered Orders';
const ADMIN_TABS: AdminTab[] = ['New Orders', 'Draft Orders', 'Abandoned Carts', 'Delivered Orders'];

export const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [adminTab, setAdminTab] = useState<AdminTab>('New Orders');

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Message copied to clipboard');
  };

  const getWhatsappUrl = (phone: string, text: string) => {
    return `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`;
  };

  const getSmsUrl = (phone: string, text: string) => {
    return `sms:${phone}?body=${encodeURIComponent(text)}`;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      try {
        const isAdmin = user.email === 'skullogsupport@gmail.com';
        const ordersRef = collection(db, 'orders');
        
        let q;
        if (isAdmin) {
          q = query(ordersRef, orderBy('createdAt', 'desc'));
        } else {
          q = query(ordersRef, where('userId', '==', user.uid), orderBy('createdAt', 'desc'));
        }

        const querySnapshot = await getDocs(q);
        const fetchedOrders = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Order[];

        setOrders(fetchedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  const isAdmin = user?.email === 'skullogsupport@gmail.com';

  const visibleOrders = useMemo(() => {
    if (!isAdmin) return orders;
    return orders.filter(order => {
      switch (adminTab) {
        case 'New Orders': return ['paid', 'new', 'tracking'].includes(order.status);
        case 'Draft Orders': return ['pending', 'draft'].includes(order.status);
        case 'Abandoned Carts': return ['failed', 'abandoned'].includes(order.status);
        case 'Delivered Orders': return order.status === 'delivered';
        default: return true;
      }
    });
  }, [orders, adminTab, isAdmin]);

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { status });
      setOrders(orders.map(o => o.id === orderId ? { ...o, status } : o));
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const deleteOrder = async (orderId: string) => {
    if (!window.confirm("Are you sure you want to delete this order/draft?")) return;
    try {
      await deleteDoc(doc(db, 'orders', orderId));
      setOrders(orders.filter(o => o.id !== orderId));
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-skullog-red border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <PackageOpen className="w-16 h-16 text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Please sign in to view your orders.</h2>
        <p className="text-gray-500 max-w-md">You need to be logged in to view your order history.</p>
      </div>
    );
  }

  return (
    <div className={`flex-1 w-full mx-auto ${isAdmin ? 'bg-black text-white min-h-screen pt-8 px-4 sm:px-6 lg:px-8' : 'max-w-4xl p-4 sm:p-6 lg:p-8'}`}>
      <div className={`${isAdmin ? 'max-w-7xl mx-auto' : ''}`}>
        <div className="mb-8 flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-heading font-black italic tracking-tighter uppercase mb-2">
              {isAdmin ? 'All Orders (Admin)' : 'My Orders'}
            </h1>
            <p className={isAdmin ? 'text-gray-400' : 'text-gray-500'}>
              {isAdmin ? 'Manage all customer orders and statuses.' : 'Track and view your recent purchases.'}
            </p>
          </div>

          {isAdmin && (
            <div className="flex flex-wrap gap-2 p-1.5 bg-gray-900 rounded-2xl w-fit border border-gray-800">
              {ADMIN_TABS.map(tab => (
                <button
                  key={tab}
                  onClick={() => setAdminTab(tab)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold uppercase tracking-wider transition-all ${
                    adminTab === tab 
                      ? 'bg-white text-black shadow-sm' 
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          )}
        </div>

        {visibleOrders.length === 0 ? (
          <div className={`${isAdmin ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'} rounded-3xl p-12 text-center border shadow-sm flex flex-col items-center`}>
            <PackageOpen className={`w-16 h-16 ${isAdmin ? 'text-gray-700' : 'text-gray-200'} mx-auto mb-4`} />
            <h3 className="text-xl font-bold mb-2">No orders found</h3>
            <p className={`${isAdmin ? 'text-gray-400' : 'text-gray-500'} mb-6`}>
              {isAdmin ? `No orders found in ${adminTab}.` : "You haven't placed any orders yet."}
            </p>
            {!isAdmin && (
              <Link 
                to="/" 
                className="bg-black text-white px-8 py-3 rounded-xl font-bold uppercase tracking-widest hover:bg-gray-900 transition-colors inline-block"
              >
                Start Shopping
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <AnimatePresence mode="popLayout">
              {visibleOrders.map((order, i) => {
                const customerName = order.customerEmail?.split('@')[0] || 'Customer';
                const phone = '1234567890'; // Mock phone for now, replace when full data is available

                const msgPaymentReceived = `Hello ${customerName}, your payment has been received successfully for your SKULL OG order ${order.orderId}. We are now preparing your order for shipment. Thank you for shopping with us.`;
                const msgTracking = `Hello ${customerName}, your SKULL OG order ${order.orderId} has been shipped successfully. Your tracking details will be updated shortly.`;
                const msgPaymentReminder = `Hello ${customerName}, you left some amazing SKULL OG products in your cart (Order ${order.orderId}). Complete your payment now before the items go out of stock.`;
                const msgReviewRequest = `Hello ${customerName}, your SKULL OG order ${order.orderId} has been delivered successfully. We would love to hear your feedback. Please leave a review and share your experience.`;
                const msgReorderReminder = `Hello ${customerName}, thank you for shopping with SKULL OG. Explore our newest drops and reorder your favorite products today.`;
                const msgAbandonedReminder = `Hello ${customerName}, your SKULL OG cart is waiting for you. Complete your order now before your selected items sell out.`;
                const msgDiscountOffer = `Complete your SKULL OG purchase now and enjoy an exclusive discount. Use code: SKULLOG10`;

                return (
                <motion.div 
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  key={order.id} 
                  className={`${isAdmin ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'} rounded-3xl p-6 border shadow-sm`}
                >
                  <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b ${isAdmin ? 'border-gray-800' : 'border-gray-100'}`}>
                    <div>
                      <p className={`text-sm ${isAdmin ? 'text-gray-400' : 'text-gray-500'} mb-1`}>
                        Order ID: <span className={`font-mono ${isAdmin ? 'text-white' : 'text-black'}`}>{order.orderId}</span>
                      </p>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className={isAdmin ? 'text-gray-300' : 'text-gray-600'}>
                          {order.createdAt ? new Date(order.createdAt.seconds * 1000).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          }) : 'N/A'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:items-end gap-2">
                      <div className="flex items-center gap-2">
                        {['paid', 'new'].includes(order.status) ? (
                          <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold uppercase tracking-wider">
                            <CheckCircle className="w-3.5 h-3.5" /> Paid
                          </div>
                        ) : order.status === 'tracking' ? (
                           <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider">
                            <Truck className="w-3.5 h-3.5" /> Tracking
                          </div>
                        ) : order.status === 'delivered' ? (
                          <div className="flex items-center gap-1.5 px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-bold uppercase tracking-wider">
                            <PackageCheck className="w-3.5 h-3.5" /> Delivered
                          </div>
                        ) : ['failed', 'abandoned'].includes(order.status) ? (
                          <div className="flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-700 rounded-full text-xs font-bold uppercase tracking-wider">
                            <XCircle className="w-3.5 h-3.5" /> Failed/Abandoned
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full text-xs font-bold uppercase tracking-wider">
                            <Clock className="w-3.5 h-3.5" /> Draft/Pending
                          </div>
                        )}
                      </div>
                      <p className="text-xl font-bold">Rs. {order.amount.toFixed(2)}</p>
                    </div>
                  </div>

                  {isAdmin && order.customerEmail && (
                     <div className="mb-4 p-4 bg-gray-950 rounded-2xl border border-gray-800 flex flex-col gap-4">
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                         <div>
                           <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Customer Name</p>
                           <p className="font-medium">{customerName}</p>
                         </div>
                         <div>
                           <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Email</p>
                           <p className="font-medium text-gray-300">{order.customerEmail}</p>
                         </div>
                       </div>
                       
                       <div className="flex flex-col gap-3 pt-3 border-t border-gray-800">
                         <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Actions & Communication</p>
                         <div className="flex flex-wrap gap-2">
                        {adminTab === 'New Orders' && (
                          <>
                            <div className="flex items-center gap-1 border border-gray-800 p-1 rounded-lg bg-gray-900">
                              <span className="text-xs text-gray-400 font-bold px-2">PAYMENT REC:</span>
                              <a title="WhatsApp" href={getWhatsappUrl(phone, msgPaymentReceived)} target="_blank" rel="noreferrer" className="p-1.5 text-gray-300 hover:text-green-400"><MessageCircle className="w-4 h-4"/></a>
                              <a title="SMS" href={getSmsUrl(phone, msgPaymentReceived)} className="p-1.5 text-gray-300 hover:text-white"><MessageSquare className="w-4 h-4"/></a>
                              <a title="Email" href={`mailto:${order.customerEmail}?subject=Payment Received&body=${encodeURIComponent(msgPaymentReceived)}`} className="p-1.5 text-gray-300 hover:text-white"><Mail className="w-4 h-4"/></a>
                              <button title="Copy" onClick={() => copyToClipboard(msgPaymentReceived)} className="p-1.5 text-gray-300 hover:text-white"><Copy className="w-4 h-4"/></button>
                            </div>

                            <button 
                              onClick={() => {
                                updateOrderStatus(order.id, 'tracking');
                                window.open(getWhatsappUrl(phone, msgTracking), '_blank');
                              }}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-900/30 text-blue-400 border border-blue-900/50 hover:bg-blue-900/50 rounded-lg text-xs font-bold transition-colors"
                            >
                              <Truck className="w-4 h-4" /> Mark Tracking + Notify
                            </button>
                            <button 
                              onClick={() => updateOrderStatus(order.id, 'delivered')}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-900/30 text-purple-400 border border-purple-900/50 hover:bg-purple-900/50 rounded-lg text-xs font-bold transition-colors"
                            >
                              <PackageCheck className="w-4 h-4" /> Mark Delivered
                            </button>
                          </>
                        )}
                        
                        {(adminTab === 'Draft Orders' || adminTab === 'Abandoned Carts') && (
                          <>
                            <div className="flex items-center gap-1 border border-gray-800 p-1 rounded-lg bg-gray-900">
                              <span className="text-xs text-gray-400 font-bold px-2">REMINDER:</span>
                              <a title="WhatsApp" href={getWhatsappUrl(phone, adminTab === 'Abandoned Carts' ? msgAbandonedReminder : msgPaymentReminder)} target="_blank" rel="noreferrer" className="p-1.5 text-gray-300 hover:text-green-400"><MessageCircle className="w-4 h-4"/></a>
                              <a title="SMS" href={getSmsUrl(phone, adminTab === 'Abandoned Carts' ? msgAbandonedReminder : msgPaymentReminder)} className="p-1.5 text-gray-300 hover:text-white"><MessageSquare className="w-4 h-4"/></a>
                              <a title="Email" href={`mailto:${order.customerEmail}?subject=Complete Your Order&body=${encodeURIComponent(adminTab === 'Abandoned Carts' ? msgAbandonedReminder : msgPaymentReminder)}`} className="p-1.5 text-gray-300 hover:text-white"><Mail className="w-4 h-4"/></a>
                              <button title="Copy" onClick={() => copyToClipboard(adminTab === 'Abandoned Carts' ? msgAbandonedReminder : msgPaymentReminder)} className="p-1.5 text-gray-300 hover:text-white"><Copy className="w-4 h-4"/></button>
                            </div>
                            {adminTab === 'Abandoned Carts' && (
                              <div className="flex items-center gap-1 border border-gray-800 p-1 rounded-lg bg-gray-900">
                                <span className="text-xs text-gray-400 font-bold px-2">DISCOUNT:</span>
                                <a title="WhatsApp" href={getWhatsappUrl(phone, msgDiscountOffer)} target="_blank" rel="noreferrer" className="p-1.5 text-gray-300 hover:text-green-400"><MessageCircle className="w-4 h-4"/></a>
                                <a title="Email" href={`mailto:${order.customerEmail}?subject=Special Offer Inside&body=${encodeURIComponent(msgDiscountOffer)}`} className="p-1.5 text-gray-300 hover:text-white"><Mail className="w-4 h-4"/></a>
                                <button title="Copy" onClick={() => copyToClipboard(msgDiscountOffer)} className="p-1.5 text-gray-300 hover:text-white"><Copy className="w-4 h-4"/></button>
                              </div>
                            )}

                            <button 
                              onClick={() => deleteOrder(order.id)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-900/30 text-skullog-red border border-red-900/50 hover:bg-red-900/50 rounded-lg text-xs font-bold transition-colors ml-auto"
                            >
                              <Trash2 className="w-4 h-4" /> Delete Draft
                            </button>
                          </>
                        )}

                        {adminTab === 'Delivered Orders' && (
                          <>
                            <div className="flex items-center gap-1 border border-gray-800 p-1 rounded-lg bg-gray-900">
                              <span className="text-xs text-gray-400 font-bold px-2">REVIEW MSG:</span>
                              <a title="WhatsApp" href={getWhatsappUrl(phone, msgReviewRequest)} target="_blank" rel="noreferrer" className="p-1.5 text-gray-300 hover:text-green-400"><MessageCircle className="w-4 h-4"/></a>
                              <a title="Email" href={`mailto:${order.customerEmail}?subject=How did we do?&body=${encodeURIComponent(msgReviewRequest)}`} className="p-1.5 text-gray-300 hover:text-white"><Mail className="w-4 h-4"/></a>
                              <button title="Copy" onClick={() => copyToClipboard(msgReviewRequest)} className="p-1.5 text-gray-300 hover:text-white"><Copy className="w-4 h-4"/></button>
                            </div>
                            <div className="flex items-center gap-1 border border-gray-800 p-1 rounded-lg bg-gray-900">
                              <span className="text-xs text-gray-400 font-bold px-2">REORDER:</span>
                              <a title="WhatsApp" href={getWhatsappUrl(phone, msgReorderReminder)} target="_blank" rel="noreferrer" className="p-1.5 text-gray-300 hover:text-green-400"><MessageCircle className="w-4 h-4"/></a>
                              <a title="Email" href={`mailto:${order.customerEmail}?subject=Time for a refresh?&body=${encodeURIComponent(msgReorderReminder)}`} className="p-1.5 text-gray-300 hover:text-white"><Mail className="w-4 h-4"/></a>
                              <button title="Copy" onClick={() => copyToClipboard(msgReorderReminder)} className="p-1.5 text-gray-300 hover:text-white"><Copy className="w-4 h-4"/></button>
                            </div>
                          </>
                        )}
                         </div>
                       </div>
                     </div>
                  )}

                  <div className="space-y-4">
                    <h4 className="font-bold text-sm uppercase tracking-wider text-gray-400 mb-2">Items</h4>
                    {order.items?.map((item, index) => (
                      <div key={index} className={`flex justify-between items-center ${isAdmin ? 'bg-gray-900 border border-gray-800' : 'bg-gray-50'} rounded-xl p-4`}>
                        <div>
                          <p className="font-bold text-sm">{item.name}</p>
                          <p className={`text-xs ${isAdmin ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                            {item.size && `Size: ${item.size} • `}Qty: {item.quantity}
                          </p>
                        </div>
                        <p className="font-bold text-sm">Rs. {(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};
