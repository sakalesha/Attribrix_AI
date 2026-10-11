// Acts as a client for the ML service, providing methods to interact with the ML service.

const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const config = require('../config');
const logger = require('../utils/logger');

// Handles communication with the separate ML service.
class MLClient {
  constructor() {
    this.baseUrl = config.mlServiceUrl;
  }

  // Health check on ML service
  async checkHealth() {
    try {
      const response = await axios.get(`${this.baseUrl}/health`, { timeout: 5000 });
      return { ok: true, data: response.data };
    } catch (error) {
      logger.error(`ML service health check failed: ${error.message}`);
      return { ok: false, error: error.message };
    }
  }

  // Fetch supported taxonomy from ML service
  async getTaxonomy() {
    try {
      const response = await axios.get(`${this.baseUrl}/api/v1/taxonomy`, { timeout: 5000 });
      return response.data;
    } catch (error) {
      logger.error(`Failed to fetch taxonomy from ML service: ${error.message}`);
      throw new Error(`ML Service unavailable: ${error.message}`);
    }
  }

  // Send product images to ML service for category and attribute prediction
  async predictProduct(filePaths, options = {}) {
    try {
      const formData = new FormData();

      for (const filePath of filePaths) {
        formData.append('images', fs.createReadStream(filePath));
      }

      if (options.productId) {
        formData.append('product_id', options.productId);
      }

      const response = await axios.post(`${this.baseUrl}/api/v1/predict`, formData, {
        headers: {
          ...formData.getHeaders(),
        },
        timeout: 30000, // 30s timeout for ML inference on CPU
      });

      return response.data;
    } catch (error) {
      logger.error(`ML inference failed: ${error.message}`);
      throw new Error(`ML prediction error: ${error.response?.data?.detail || error.message}`);
    }
  }
}

module.exports = new MLClient();
