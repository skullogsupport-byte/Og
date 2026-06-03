import React, { useRef, useState } from 'react';
import { PRODUCTS } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Upload, X, Link as LinkIcon, FileVideo } from 'lucide-react';
import type { Category } from '../types';

export const Home = () => {
  const [heroVideo, setHeroVideo] = useState("https://files.catbox.moe/z75gx0.mp4");
  const [showVideoOptions, setShowVideoOptions] = useState(false);
  const [videoUrlInput, setVideoUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setHeroVideo(URL.createObjectURL(file));
      setShowVideoOptions(false);
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (videoUrlInput) {
      setHeroVideo(videoUrlInput);
      setShowVideoOptions(false);
      setVideoUrlInput('');
    }
  };

  const isYoutube = heroVideo.includes('youtube.com') || heroVideo.includes('youtu.be');
  
  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const youtubeId = isYoutube ? getYoutubeId(heroVideo) : '';
  const youtubeEmbedUrl = youtubeId ? `https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${youtubeId}&playsinline=1` : '';

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-screen bg-black flex items-center justify-center overflow-hidden shrink-0 w-full group">
        {isYoutube && youtubeEmbedUrl ? (
          <iframe 
            src={youtubeEmbedUrl} 
            allow="autoplay; encrypted-media"
            className="absolute inset-0 w-full h-full object-cover opacity-70 pointer-events-none scale-[1.5]"
            style={{ border: 'none' }}
          />
        ) : (
          <video 
            key={heroVideo}
            autoPlay 
            muted 
            loop 
            playsInline 
            className="absolute inset-0 w-full h-full object-cover opacity-70"
          >
            <source src={heroVideo} type="video/mp4" />
          </video>
        )}
        
        {/* Custom Video Upload Button */}
        <button 
          onClick={() => setShowVideoOptions(true)}
          className="absolute bottom-6 right-6 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white p-4 rounded-full opacity-0 group-hover:opacity-100 transition-all z-20 shadow-xl"
          title="Change background video"
        >
          <Upload className="w-6 h-6" />
        </button>
        <input 
          type="file" 
          accept="video/*" 
          ref={fileInputRef} 
          className="hidden" 
          onChange={handleVideoUpload}
        />

        <AnimatePresence>
          {showVideoOptions && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowVideoOptions(false)}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="bg-white rounded-3xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden text-left"
              >
                <button 
                  onClick={() => setShowVideoOptions(false)} 
                  className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors z-20"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="p-8">
                  <h3 className="font-heading font-black italic uppercase text-2xl tracking-tighter mb-6">Change Background</h3>
                  
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full flex items-center justify-center gap-3 bg-gray-100 hover:bg-gray-200 text-black font-bold shadow-sm uppercase tracking-wide py-4 rounded-xl transition-colors mb-4 border border-gray-200"
                  >
                    <FileVideo className="w-5 h-5" />
                    Upload Local File
                  </button>
                  
                  <div className="flex items-center gap-4 my-6">
                    <div className="flex-1 h-px bg-gray-200" />
                    <span className="text-gray-400 font-bold uppercase text-xs">Or use URL</span>
                    <div className="flex-1 h-px bg-gray-200" />
                  </div>
                  
                  <form onSubmit={handleUrlSubmit} className="flex flex-col gap-3 text-left">
                    <label className="text-sm font-bold border-l-2 pl-2 border-skullog-red uppercase tracking-wider text-black">Video URL (YouTube or Direct MP4)</label>
                    <p className="text-xs text-gray-500 mb-2">Works with YouTube links or direct .mp4 links (e.g., from Imgur, Cloudinary, Dropbox by changing ?dl=0 to ?raw=1)</p>
                    <div className="relative">
                      <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input 
                        type="url" 
                        placeholder="https://youtube.com/watch?v=... or https://.../video.mp4"
                        value={videoUrlInput}
                        onChange={(e) => setVideoUrlInput(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 py-3 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black transition-shadow"
                        required
                      />
                    </div>
                    <button type="submit" className="w-full bg-skullog-red text-white font-bold uppercase tracking-widest py-4 rounded-xl hover:bg-red-700 transition-colors mt-2 active:scale-95">
                      Set Video
                    </button>
                  </form>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <div className="absolute top-[73%] left-1/2 -translate-x-1/2 z-10 text-center w-full px-4">
          <motion.button 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            onClick={() => document.getElementById('hoodies')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-skullog-red text-white px-12 py-5 font-bold uppercase tracking-[0.2em] text-base hover:scale-105 transition-transform rounded-full shadow-2xl"
          >
            Shop Now
          </motion.button>
        </div>
      </section>

      {/* Quick Links */}
      <section className="px-4 md:px-8 py-6 flex flex-col md:flex-row gap-4 shrink-0 bg-white border-b border-gray-100 w-full overflow-x-auto">
        <div className="flex gap-4 min-w-max md:min-w-0 md:flex-1 w-full justify-center md:container md:mx-auto">
          {[
            { id: 'hoodies', label: 'Hoodies', image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=400&auto=format&fit=crop' },
            { id: 'gym-wear', label: 'Gym Wear', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=400&auto=format&fit=crop' },
            { id: 'jackets', label: 'Jackets', image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=400&auto=format&fit=crop' }
          ].map((cat, i) => (
            <motion.div 
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              onClick={() => document.getElementById(cat.id)?.scrollIntoView({ behavior: 'smooth' })}
              className="w-32 md:flex-1 h-32 relative rounded-3xl overflow-hidden group cursor-pointer"
            >
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110" 
                style={{ backgroundImage: `url(${cat.image})` }} 
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <span className="text-white font-black italic uppercase text-lg md:text-2xl">
                  {cat.label}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Product Sections */}
      <div className="flex flex-col gap-16 py-16 bg-gray-50">
        <ProductSection category="Hoodies" id="hoodies" />
        <ProductSection category="Gym wear" id="gym-wear" />
        <ProductSection category="Jacket" id="jackets" />
      </div>
    </div>
  );
};

const ProductSection = ({ category, id }: { category: Category, id: string }) => {
  const products = PRODUCTS.filter(p => p.category === category).slice(0, 4);

  return (
    <section id={id} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full scroll-mt-24">
      <div className="flex items-center justify-between mb-6">
        <div className="border-l-4 border-skullog-red pl-4">
          <h2 className="text-2xl font-black italic uppercase tracking-tighter leading-none">
            {category}
          </h2>
        </div>
        <Link 
          to={`/collections?category=${category}`}
          className="text-xs font-bold uppercase tracking-widest border-b border-black pb-1 hover:text-skullog-red hover:border-skullog-red transition-colors"
        >
          View All {category}
        </Link>
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        {products.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>
    </section>
  );
};
