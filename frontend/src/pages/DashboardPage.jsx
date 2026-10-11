import React, { useState, useEffect } from 'react';
import ImageUploader from '../features/upload/ImageUploader';
import ReviewForm from '../features/review/ReviewForm';
import { getTaxonomy, analyzeImages, submitReview, getHealth } from '../services/api';
import { Layers, Server, Activity, CheckCircle } from 'lucide-react';

export default function DashboardPage() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [taxonomy, setTaxonomy] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [healthStatus, setHealthStatus] = useState(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    // Check initial service connectivity
    getHealth()
      .then((data) => setHealthStatus(data))
      .catch((err) => console.log('Backend offline or starting up'));

    getTaxonomy()
      .then((data) => setTaxonomy(data.data || data))
      .catch((err) => console.log('Taxonomy fetch deferred'));
  }, []);

  const handleAnalyze = async () => {
    if (selectedFiles.length === 0) return;
    setLoading(true);
    setSavedSuccess(false);
    try {
      const res = await analyzeImages(selectedFiles);
      setPrediction(res.data || res);
    } catch (err) {
      alert(`Analysis error: ${err.message}. Make sure backend and ML services are running.`);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (formData) => {
    if (!prediction?.product_id) {
      alert('Approved locally (simulated review for MVP).');
      setSavedSuccess(true);
      return;
    }
    try {
      await submitReview(prediction.product_id, {
        category: formData.category,
        attributes: {
          color: { value: formData.color, status: 'verified', source: 'user' },
          pattern: { value: formData.pattern, status: 'verified', source: 'user' },
          material: { value: formData.material, status: 'verified', source: 'user' },
          sleeve_type: { value: formData.sleeve_type, status: 'verified', source: 'user' },
          neckline: { value: formData.neckline, status: 'verified', source: 'user' },
          brand: { value: formData.brand, status: formData.brand ? 'verified' : 'unknown', source: 'user' },
        },
      });
      setSavedSuccess(true);
    } catch (err) {
      alert(`Save failed: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Status Ribbon */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-6 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-semibold text-slate-700">Architecture Tier:</span>
            <span className="text-slate-500">React &bull; Node/Express BFF &bull; Python ML</span>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-slate-500">Backend Status:</span>
            <span className="font-medium text-emerald-600">{healthStatus ? 'Online' : 'Standby / Local'}</span>
          </div>
        </div>
        <div className="text-xs text-slate-500">
          Target: <strong className="text-slate-700">95% Top-1 Category</strong> &bull; <strong className="text-slate-700">90% Macro F1</strong>
        </div>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl flex items-center gap-3 text-sm">
          <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0" />
          <div>
            <strong className="font-semibold">Review successfully recorded!</strong>
            <p className="text-xs text-emerald-700 mt-0.5">
              Verified catalog metadata and original AI prediction snapshot have been preserved for future evaluation.
            </p>
          </div>
        </div>
      )}

      {/* Main Grid: Upload on left, Review/Results on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-5">
          <ImageUploader
            selectedFiles={selectedFiles}
            setSelectedFiles={setSelectedFiles}
            onAnalyze={handleAnalyze}
            loading={loading}
          />
        </div>

        <div className="lg:col-span-7">
          {prediction ? (
            <ReviewForm
              prediction={prediction}
              taxonomy={taxonomy}
              onApprove={handleApprove}
            />
          ) : (
            <div className="bg-white rounded-xl border border-dashed border-slate-200 p-12 text-center text-slate-400">
              <Layers className="h-10 w-10 mx-auto mb-3 text-slate-300" />
              <h3 className="text-sm font-semibold text-slate-600">No Product Analyzed Yet</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Upload photos of a garment on the left to trigger CLIP zero-shot classification and OCR label reading.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
