const { login, logout, getAuthStatus, loginInvitado, loginSlideshow } = require('../middleware/auth');

class AuthController {
  // Handle login
  async handleLogin(req, res) {
    return login(req, res);
  }

  // Handle logout
  async handleLogout(req, res) {
    return logout(req, res);
  }

  // Get authentication status
  async getStatus(req, res) {
    return getAuthStatus(req, res);
  }

  // Handle invitado login
  async handleLoginInvitado(req, res) {
    return loginInvitado(req, res);
  }

  // Handle slideshow login
  async handleLoginSlideshow(req, res) {
    return loginSlideshow(req, res);
  }
}

module.exports = new AuthController();