import React from 'react';
import Navbar from '../components/Navbar';

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <footer className="border-t border-slate-200 py-4 bg-white text-center text-xs text-slate-400">
        Attribrix AI &copy; 2026 &bull; Catalog Enrichment Architecture
      </footer>
    </div>
  );
}
