import React, { useState, useEffect } from 'react';
import ConfidenceBadge from '../../components/ConfidenceBadge';
import { CheckCircle2, AlertTriangle, Sparkles, HelpCircle } from 'lucide-react';

export default function ReviewForm({ prediction, taxonomy, onApprove }) {
  const [formData, setFormData] = useState({
    category: '',
    color: '',
    pattern: '',
    material: '',
    sleeve_type: '',
    neckline: '',
    brand: '',
  });

  // Always pre-populate form with AI predictions (even low-confidence candidates)
  useEffect(() => {
    if (prediction) {
      setFormData({
        category: prediction?.category?.value || '',
        color: prediction?.attributes?.color?.value || '',
        pattern: prediction?.attributes?.pattern?.value || '',
        material: prediction?.attributes?.material?.value || '',
        sleeve_type: prediction?.attributes?.sleeve_type?.value || '',
        neckline: prediction?.attributes?.neckline?.value || '',
        brand: prediction?.attributes?.brand?.value || '',
      });
    }
  }, [prediction]);

  const categories = taxonomy?.categories ? Object.values(taxonomy.categories) : [];
  const colors = taxonomy?.vocabularies?.color || [];
  const patterns = taxonomy?.vocabularies?.pattern || [];
  const materials = taxonomy?.vocabularies?.material || [];
  const sleeveTypes = taxonomy?.vocabularies?.sleeve_type || [];
  const necklines = taxonomy?.vocabularies?.neckline || [];

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isLowConfidence = (item) => {
    if (!item) return false;
    return item.status === 'needs_review' || (item.confidence !== null && item.confidence < 0.7);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <span>Review & Approve Metadata</span>
            <span className="text-xs font-normal text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
              <Sparkles className="h-3 w-3" /> Pre-filled with AI Candidates
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            AI top candidates are pre-selected below. Please verify any low-confidence fields before approving.
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
          <AlertTriangle className="h-3.5 w-3.5" />
          <span>Human Review Step</span>
        </div>
      </div>

      <div className="space-y-4">
        {/* Category Field */}
        <div className={`p-3 rounded-lg border ${isLowConfidence(prediction?.category) ? 'bg-amber-50/40 border-amber-200' : 'bg-slate-50/50 border-slate-200'}`}>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-800">
              Category
              {isLowConfidence(prediction?.category) && (
                <span className="ml-2 text-[11px] font-medium text-amber-600">(Needs verification)</span>
              )}
            </label>
            <ConfidenceBadge
              confidence={prediction?.category?.confidence}
              status={prediction?.category?.status}
            />
          </div>
          <select
            value={formData.category}
            onChange={(e) => handleFieldChange('category', e.target.value)}
            className="w-full text-sm rounded-lg border-slate-200 bg-white px-3 py-2 border focus:border-emerald-500 focus:outline-none"
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
        <div className={`p-3 rounded-lg border ${isLowConfidence(prediction?.attributes?.color) ? 'bg-amber-50/40 border-amber-200' : 'bg-slate-50/50 border-slate-200'}`}>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-800">
              Primary Color
              {isLowConfidence(prediction?.attributes?.color) && (
                <span className="ml-2 text-[11px] font-medium text-amber-600">(Needs verification)</span>
              )}
            </label>
            <ConfidenceBadge
              confidence={prediction?.attributes?.color?.confidence}
              status={prediction?.attributes?.color?.status}
            />
          </div>
          <select
            value={formData.color}
            onChange={(e) => handleFieldChange('color', e.target.value)}
            className="w-full text-sm rounded-lg border-slate-200 bg-white px-3 py-2 border focus:border-emerald-500 focus:outline-none capitalize"
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
        <div className={`p-3 rounded-lg border ${isLowConfidence(prediction?.attributes?.pattern) ? 'bg-amber-50/40 border-amber-200' : 'bg-slate-50/50 border-slate-200'}`}>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-800">
              Pattern
              {isLowConfidence(prediction?.attributes?.pattern) && (
                <span className="ml-2 text-[11px] font-medium text-amber-600">(Needs verification)</span>
              )}
            </label>
            <ConfidenceBadge
              confidence={prediction?.attributes?.pattern?.confidence}
              status={prediction?.attributes?.pattern?.status}
            />
          </div>
          <select
            value={formData.pattern}
            onChange={(e) => handleFieldChange('pattern', e.target.value)}
            className="w-full text-sm rounded-lg border-slate-200 bg-white px-3 py-2 border focus:border-emerald-500 focus:outline-none capitalize"
          >
            <option value="">Select Pattern</option>
            {patterns.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        {/* Material Field */}
        <div className={`p-3 rounded-lg border ${isLowConfidence(prediction?.attributes?.material) ? 'bg-amber-50/40 border-amber-200' : 'bg-slate-50/50 border-slate-200'}`}>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-800">
              Fabric / Material
              {isLowConfidence(prediction?.attributes?.material) && (
                <span className="ml-2 text-[11px] font-medium text-amber-600">(Needs verification)</span>
              )}
            </label>
            <ConfidenceBadge
              confidence={prediction?.attributes?.material?.confidence}
              status={prediction?.attributes?.material?.status}
            />
          </div>
          <select
            value={formData.material}
            onChange={(e) => handleFieldChange('material', e.target.value)}
            className="w-full text-sm rounded-lg border-slate-200 bg-white px-3 py-2 border focus:border-emerald-500 focus:outline-none capitalize"
          >
            <option value="">Select Material</option>
            {materials.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        {/* Sleeve Type Field */}
        <div className={`p-3 rounded-lg border ${isLowConfidence(prediction?.attributes?.sleeve_type) ? 'bg-amber-50/40 border-amber-200' : 'bg-slate-50/50 border-slate-200'}`}>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-800">
              Sleeve Type
              {isLowConfidence(prediction?.attributes?.sleeve_type) && (
                <span className="ml-2 text-[11px] font-medium text-amber-600">(Needs verification)</span>
              )}
            </label>
            <ConfidenceBadge
              confidence={prediction?.attributes?.sleeve_type?.confidence}
              status={prediction?.attributes?.sleeve_type?.status}
            />
          </div>
          <select
            value={formData.sleeve_type}
            onChange={(e) => handleFieldChange('sleeve_type', e.target.value)}
            className="w-full text-sm rounded-lg border-slate-200 bg-white px-3 py-2 border focus:border-emerald-500 focus:outline-none capitalize"
          >
            <option value="">Select Sleeve Type</option>
            {sleeveTypes.map((s) => (
              <option key={s} value={s}>
                {s.replace(/_/g, ' ')}
              </option>
            ))}
          </select>
        </div>

        {/* Neckline Field */}
        <div className={`p-3 rounded-lg border ${isLowConfidence(prediction?.attributes?.neckline) ? 'bg-amber-50/40 border-amber-200' : 'bg-slate-50/50 border-slate-200'}`}>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-800">
              Neckline
              {isLowConfidence(prediction?.attributes?.neckline) && (
                <span className="ml-2 text-[11px] font-medium text-amber-600">(Needs verification)</span>
              )}
            </label>
            <ConfidenceBadge
              confidence={prediction?.attributes?.neckline?.confidence}
              status={prediction?.attributes?.neckline?.status}
            />
          </div>
          <select
            value={formData.neckline}
            onChange={(e) => handleFieldChange('neckline', e.target.value)}
            className="w-full text-sm rounded-lg border-slate-200 bg-white px-3 py-2 border focus:border-emerald-500 focus:outline-none capitalize"
          >
            <option value="">Select Neckline</option>
            {necklines.map((n) => (
              <option key={n} value={n}>
                {n.replace(/_/g, ' ')}
              </option>
            ))}
          </select>
        </div>

        {/* Brand Field (OCR candidate) */}
        <div className="p-3 rounded-lg border bg-slate-50/50 border-slate-200">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-800">Brand (Label OCR)</label>
            <ConfidenceBadge
              confidence={prediction?.attributes?.brand?.confidence}
              status={prediction?.attributes?.brand?.status}
            />
          </div>
          <input
            type="text"
            placeholder="No label brand detected (enter brand if known)"
            value={formData.brand}
            onChange={(e) => handleFieldChange('brand', e.target.value)}
            className="w-full text-sm rounded-lg border-slate-200 bg-white px-3 py-2 border focus:border-emerald-500 focus:outline-none"
          />
        </div>
      </div>

      <button
        onClick={() => onApprove(formData)}
        className="w-full mt-6 bg-slate-900 hover:bg-slate-800 text-white font-medium py-2.5 px-4 rounded-lg text-sm transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
      >
        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
        <span>Approve & Save Verified Record</span>
      </button>
    </div>
  );
}
