const express = require('express');
const router = express.Router();

// Import route modules
const apiRoutes = require('./api');
const viewRoutes = require('./views');
const authRoutes = require('./auth');

// Mount routes
router.use('/api', apiRoutes);
router.use('/', viewRoutes);
router.use('/auth', authRoutes);

module.exports = router;