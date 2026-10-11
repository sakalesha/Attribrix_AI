import React from 'react';
import { Tag, Sparkles } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-sm">
            <Tag className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-semibold text-slate-900 text-lg tracking-tight flex items-center gap-2">
              Attribrix AI
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                Phase 1 Foundation
              </span>
            </h1>
            <p className="text-xs text-slate-500">Fashion Catalog Metadata Enrichment</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-slate-600">
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1.5 rounded-md border border-slate-200">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            <span>CLIP Baseline + OCR</span>
          </div>
        </div>
      </div>
    </header>
  );
}
