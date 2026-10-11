import React from 'react';

export default function ConfidenceBadge({ confidence, status }) {
  if (confidence === null || confidence === undefined || status === 'unknown') {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
        Unknown
      </span>
    );
  }

  const pct = Math.round(confidence * 100);

  if (pct >= 80) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
        {pct}% High
      </span>
    );
  }

  if (pct >= 50) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
        {pct}% Medium
      </span>
    );
  }

  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200">
      {pct}% Low
    </span>
  );
}
