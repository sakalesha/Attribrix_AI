import { useState } from 'react';
import { analyzeImages } from '../services/api';

export function useProductAnalysis() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const analyze = async (files) => {
    setLoading(true);
    setError(null);
    try {
      const res = await analyzeImages(files);
      setData(res.data || res);
      return res;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { analyze, loading, error, data };
}
