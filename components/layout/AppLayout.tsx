'use client';

import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface AppLayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
  fullWidth?: boolean;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  showHeader = true,
  showFooter = true,
  fullWidth = false,
}) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      {showHeader && <Header />}
      
      {/* Main Content */}
      <main className="flex-1">
        {fullWidth ? (
          <>{children}</>
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        )}
      </main>
      
      {/* Footer */}
      {showFooter && <Footer />}
    </div>
  );
};