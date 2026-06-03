import React from 'react';
import { Mail, Instagram, Twitter, Facebook } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-black text-white pt-16 pb-8 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div className="flex flex-col gap-4">
          <Link to="/" className="text-3xl font-heading font-black italic uppercase tracking-tighter hover:text-skullog-red transition-colors w-fit">
            SKULL<span className="text-skullog-red">OG</span>
          </Link>
          <p className="text-gray-400 text-sm pb-2">
            Premium Streetwear & Sports Fashion. Wear the attitude.
          </p>
          <div className="flex items-center gap-4 text-gray-400">
            <a href="#" className="hover:text-white transition-colors duration-200">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" className="hover:text-white transition-colors duration-200">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="hover:text-white transition-colors duration-200">
              <Facebook className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h4 className="font-heading font-bold uppercase tracking-wider text-sm mb-2">Shop</h4>
          <Link to="/collections" className="text-gray-400 hover:text-white transition-colors text-sm w-fit">All Collections</Link>
          <Link to="/collections?category=Hoodies" className="text-gray-400 hover:text-white transition-colors text-sm w-fit">Hoodies</Link>
          <Link to="/collections?category=T-Shirts" className="text-gray-400 hover:text-white transition-colors text-sm w-fit">T-Shirts</Link>
          <Link to="/collections?category=Bottoms" className="text-gray-400 hover:text-white transition-colors text-sm w-fit">Bottoms</Link>
        </div>

        <div className="flex flex-col gap-4">
          <h4 className="font-heading font-bold uppercase tracking-wider text-sm mb-2">Support</h4>
          <Link to="#" className="text-gray-400 hover:text-white transition-colors text-sm w-fit">FAQ</Link>
          <Link to="#" className="text-gray-400 hover:text-white transition-colors text-sm w-fit">Shipping & Returns</Link>
          <Link to="#" className="text-gray-400 hover:text-white transition-colors text-sm w-fit">Size Guide</Link>
          <Link to="#" className="text-gray-400 hover:text-white transition-colors text-sm w-fit">Track Order</Link>
        </div>

        <div className="flex flex-col gap-4">
          <h4 className="font-heading font-bold uppercase tracking-wider text-sm mb-2">Contact Us</h4>
          <a href="mailto:skullogsupport@gmail.com" className="group flex items-center gap-3 text-gray-400 hover:text-white transition-colors text-sm">
            <Mail className="w-5 h-5 shrink-0 group-hover:text-skullog-red transition-colors" />
            <span>skullogsupport@gmail.com</span>
          </a>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
        <p>&copy; {new Date().getFullYear()} SKULLOG. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <Link to="#" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link to="#" className="hover:text-white transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
};
