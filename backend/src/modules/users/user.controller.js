// It handles HTTP requests and responses.

class UserController {
  async me(req, res) {
    res.json({
      role: 'catalog_operator',
      permissions: ['upload', 'review', 'approve'],
    });
  }
}

module.exports = new UserController();
