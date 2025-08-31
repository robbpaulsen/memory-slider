const { login, logout, getAuthStatus, loginInvitado, loginSlideshow } = require('../middleware/auth');
const QRCode = require('qrcode');

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

  // Generate QR code for guest login
  async generateQrCode(req, res) {
    const qrUploadUrl = `${req.protocol}://${req.get('host')}/qr-upload`;
    try {
      const qrCodeImage = await QRCode.toDataURL(qrUploadUrl, {
        errorCorrectionLevel: 'H',
        type: 'image/png',
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      res.send(qrCodeImage);
    } catch (err) {
      console.error('Failed to generate QR code', err);
      res.status(500).send('Failed to generate QR code');
    }
  }
}

module.exports = new AuthController();