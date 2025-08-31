const { login, logout, getAuthStatus, loginInvitado, loginSlideshow } = require('../middleware/auth');
const QRCode = require('qrcode');
const os = require('os'); // Added

class AuthController {
  // Helper function to get the local IP address
  getIpAddress() {
    const interfaces = os.networkInterfaces();
    for (const devName in interfaces) {
      const iface = interfaces[devName];
      for (let i = 0; i < iface.length; i++) {
        const alias = iface[i];
        if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
          return alias.address;
        }
      }
    }
    return 'localhost'; // Fallback to localhost if no suitable IP is found
  }

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
    const ipAddress = this.getIpAddress(); // Get local IP
    const port = process.env.PORT || 3000; // Get port from environment or default to 3000
    const qrUploadUrl = `${req.protocol}://${ipAddress}:${port}/qr-upload`; // Use IP and port
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