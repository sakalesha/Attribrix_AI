const { v4: uuidv4 } = require('uuid');
const mlClient = require('../../integrations/mlClient');
const { getPool } = require('../../config/db');
const logger = require('../../utils/logger');

class ProductService {
  /**
   * Orchestrates multi-image analysis: calls ML service, prepares product metadata
   */
  async analyzeProductImages(files) {
    if (!files || files.length === 0) {
      const err = new Error('No images provided for product analysis');
      err.statusCode = 400;
      throw err;
    }

    const productId = uuidv4();
    const filePaths = files.map((f) => f.path);

    logger.info(`Analyzing ${files.length} images for product ${productId}`);

    // Call ML service via integration client
    const mlResult = await mlClient.predictProduct(filePaths, { productId });

    return {
      product_id: productId,
      images: files.map((f) => ({
        filename: f.filename,
        original_name: f.originalname,
        size: f.size,
        mime_type: f.mimetype,
      })),
      ...mlResult,
    };
  }

  /**
   * Save human review and approval
   */
  async saveReview(productId, reviewData) {
    logger.info(`Saving review for product ${productId}`, { reviewData });
    // In later phases, this persists to PostgreSQL review_events & products tables
    return {
      product_id: productId,
      status: 'approved',
      updated_at: new Date().toISOString(),
      attributes: reviewData.attributes,
      category: reviewData.category,
    };
  }

  /**
   * Fetch taxonomy
   */
  async getTaxonomy() {
    return await mlClient.getTaxonomy();
  }
}

module.exports = new ProductService();
