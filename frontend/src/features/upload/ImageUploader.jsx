import React, { useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

export default function ImageUploader({ selectedFiles, setSelectedFiles, onAnalyze, loading }) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files) {
      const filesArr = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...filesArr]);
    }
  };

  const handleRemove = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      <h2 className="text-base font-semibold text-slate-900 mb-1">Product Images</h2>
      <p className="text-xs text-slate-500 mb-4">
        Upload 1 or more photos of the same fashion garment (different views, closeups, label tags).
      </p>

      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-lg p-6 text-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-emerald-50/20"
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleFileChange}
        />
        <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
        <p className="text-sm font-medium text-slate-700">Click or drag images here to upload</p>
        <p className="text-xs text-slate-400 mt-1">JPEG, PNG, or WEBP (Max 10MB each)</p>
      </div>

      {selectedFiles.length > 0 && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-700">
              Selected Views ({selectedFiles.length})
            </span>
            <button
              onClick={() => setSelectedFiles([])}
              className="text-xs text-rose-600 hover:underline"
            >
              Clear all
            </button>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {selectedFiles.map((file, idx) => {
              const previewUrl = URL.createObjectURL(file);
              return (
                <div key={idx} className="relative group rounded-lg overflow-hidden border border-slate-200 aspect-square bg-slate-100">
                  <img src={previewUrl} alt={`Upload ${idx}`} className="w-full h-full object-cover" />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(idx);
                    }}
                    className="absolute top-1 right-1 bg-black/60 hover:bg-rose-600 text-white p-1 rounded-full opacity-80 group-hover:opacity-100 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              );
            })}
          </div>

          <button
            onClick={onAnalyze}
            disabled={loading}
            className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-medium py-2 px-4 rounded-lg text-sm transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            {loading ? 'Analyzing with CLIP & OCR...' : `Extract Metadata (${selectedFiles.length} images)`}
          </button>
        </div>
      )}
    </div>
  );
}
