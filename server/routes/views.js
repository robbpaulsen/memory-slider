const express = require('express');
const router = express.Router();
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');
const { requireAuth, requireGuest, hasRole } = require('../middleware/auth');

// Public routes
router.get('/', viewController.redirectToSlideshow.bind(viewController));
router.get('/slideshow', viewController.serveSlideshow.bind(viewController));
router.get('/folder-selection', viewController.serveFolderSelection.bind(viewController));
router.get('/login', requireGuest, viewController.serveLogin.bind(viewController));

// Special login routes for QR code and slideshow
router.get('/qr-upload', authController.handleLoginInvitado.bind(authController));
router.get('/slideshow-login', authController.handleLoginSlideshow.bind(authController));

// Protected routes
router.get('/admin', requireAuth, hasRole(['admin']), viewController.serveAdmin.bind(viewController));
router.get('/access-accounts', requireAuth, hasRole(['admin']), viewController.serveAccessAccounts.bind(viewController));

// Guest upload page
router.get('/upload', requireAuth, hasRole(['invitado', 'admin']), viewController.serveUpload.bind(viewController));

module.exports = router;