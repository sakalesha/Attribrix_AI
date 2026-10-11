// It handles incoming HTTP requests related to products and sends them to the product service.

const productService = require('./product.service');

// It handles HTTP requests and responses.
class ProductController {
  // It analyzes the uploaded product images using the ML service.
  async analyze(req, res, next) {
    try {
      const result = await productService.analyzeProductImages(req.files);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  // It saves the review for the product.
  async review(req, res, next) {
    try {
      const { productId } = req.params;
      const result = await productService.saveReview(productId, req.body);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  // It returns the taxonomy.
  async getTaxonomy(req, res, next) {
    try {
      const taxonomy = await productService.getTaxonomy();
      res.status(200).json({
        success: true,
        data: taxonomy,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ProductController();
