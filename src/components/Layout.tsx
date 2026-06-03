import React from 'react';
import { Outlet, ScrollRestoration } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { BottomNavigation } from './BottomNavigation';
import { CartDrawer, MenuDrawer } from './Drawers';
import { AuthModal, SearchModal } from './Modals';

export const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col font-sans mb-16 md:mb-0">
      <Header />
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
      <Footer />
      
      {/* Global Overlays */}
      <BottomNavigation />
      <CartDrawer />
      <MenuDrawer />
      <AuthModal />
      <SearchModal />
      
      <ScrollRestoration />
    </div>
  );
};
