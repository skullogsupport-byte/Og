import React from 'react';
import { Outlet, ScrollRestoration } from 'react-router-dom';
import { Header } from './Header';
import { CartDrawer, MenuDrawer } from './Drawers';
import { AuthModal, SearchModal } from './Modals';

export const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header />
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
      
      {/* Global Overlays */}
      <CartDrawer />
      <MenuDrawer />
      <AuthModal />
      <SearchModal />
      
      <ScrollRestoration />
    </div>
  );
};
