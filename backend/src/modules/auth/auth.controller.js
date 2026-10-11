// It handles HTTP requests related to authentication and returns the authentication status.

class AuthController {
  async status(req, res) {
    res.json({
      authenticated: false,
      message: 'MVP operating in open catalog mode (no user login required).',
    });
  }
}

module.exports = new AuthController();
