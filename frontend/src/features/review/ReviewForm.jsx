import React, { useState } from 'react';
import ConfidenceBadge from '../../components/ConfidenceBadge';
import { CheckCircle2, AlertTriangle, HelpCircle } from 'lucide-react';

export default function ReviewForm({ prediction, taxonomy, onApprove }) {
  const [formData, setFormData] = useState({
    category: prediction?.category?.value || '',
    color: prediction?.attributes?.color?.value || '',
    pattern: prediction?.attributes?.pattern?.value || '',
    material: prediction?.attributes?.material?.value || '',
    brand: prediction?.attributes?.brand?.value || '',
  });

  const categories = taxonomy?.categories ? Object.values(taxonomy.categories) : [];
  const colors = taxonomy?.vocabularies?.color || [];
  const patterns = taxonomy?.vocabularies?.pattern || [];

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Review & Approve Metadata</h2>
          <p className="text-xs text-slate-500">
            Verify AI predictions. Edit incorrect values or mark fields unknown before saving.
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
          <AlertTriangle className="h-3.5 w-3.5" />
          <span>Human Verification Required</span>
        </div>
      </div>

      <div className="space-y-4">
        {/* Category Field */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-slate-700">Category</label>
            <ConfidenceBadge
              confidence={prediction?.category?.confidence}
              status={prediction?.category?.status}
            />
          </div>
          <select
            value={formData.category}
            onChange={(e) => handleFieldChange('category', e.target.value)}
            className="w-full text-sm rounded-lg border-slate-200 bg-slate-50 px-3 py-2 border focus:border-emerald-500 focus:outline-none"
          >
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.display_name}
              </option>
            ))}
          </select>
        </div>

        {/* Color Field */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-slate-700">Primary Color</label>
            <ConfidenceBadge
              confidence={prediction?.attributes?.color?.confidence}
              status={prediction?.attributes?.color?.status}
            />
          </div>
          <select
            value={formData.color}
            onChange={(e) => handleFieldChange('color', e.target.value)}
            className="w-full text-sm rounded-lg border-slate-200 bg-slate-50 px-3 py-2 border focus:border-emerald-500 focus:outline-none capitalize"
          >
            <option value="">Select Color</option>
            {colors.map((col) => (
              <option key={col} value={col}>
                {col}
              </option>
            ))}
          </select>
        </div>

        {/* Pattern Field */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-slate-700">Pattern</label>
            <ConfidenceBadge
              confidence={prediction?.attributes?.pattern?.confidence}
              status={prediction?.attributes?.pattern?.status}
            />
          </div>
          <select
            value={formData.pattern}
            onChange={(e) => handleFieldChange('pattern', e.target.value)}
            className="w-full text-sm rounded-lg border-slate-200 bg-slate-50 px-3 py-2 border focus:border-emerald-500 focus:outline-none capitalize"
          >
            <option value="">Select Pattern</option>
            {patterns.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        {/* Brand Field (OCR candidate) */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-slate-700">Brand (OCR Evidence)</label>
            <ConfidenceBadge
              confidence={prediction?.attributes?.brand?.confidence}
              status={prediction?.attributes?.brand?.status}
            />
          </div>
          <input
            type="text"
            placeholder="No brand detected (or enter brand)"
            value={formData.brand}
            onChange={(e) => handleFieldChange('brand', e.target.value)}
            className="w-full text-sm rounded-lg border-slate-200 bg-slate-50 px-3 py-2 border focus:border-emerald-500 focus:outline-none"
          />
        </div>

        {/* Material Field */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-slate-700">Material</label>
            <ConfidenceBadge
              confidence={prediction?.attributes?.material?.confidence}
              status={prediction?.attributes?.material?.status}
            />
          </div>
          <input
            type="text"
            placeholder="Unknown / check garment label"
            value={formData.material}
            onChange={(e) => handleFieldChange('material', e.target.value)}
            className="w-full text-sm rounded-lg border-slate-200 bg-slate-50 px-3 py-2 border focus:border-emerald-500 focus:outline-none"
          />
        </div>
      </div>

      <button
        onClick={() => onApprove(formData)}
        className="w-full mt-6 bg-slate-900 hover:bg-slate-800 text-white font-medium py-2.5 px-4 rounded-lg text-sm transition-colors shadow-sm flex items-center justify-center gap-2"
      >
        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
        <span>Approve & Save Verified Record</span>
      </button>
    </div>
  );
}
