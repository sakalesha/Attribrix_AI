import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1',
  timeout: 30000,
});

export const getHealth = async () => {
  const response = await api.get('/health');
  return response.data;
};

export const getTaxonomy = async () => {
  const response = await api.get('/products/taxonomy');
  return response.data;
};

export const analyzeImages = async (imageFiles) => {
  const formData = new FormData();
  imageFiles.forEach((file) => {
    formData.append('images', file);
  });

  const response = await api.post('/products/analyze', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const submitReview = async (productId, reviewData) => {
  const response = await api.patch(`/products/${productId}/review`, reviewData);
  return response.data;
};

export default api;
