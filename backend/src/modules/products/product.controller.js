const productService = require('./product.service');

class ProductController {
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
