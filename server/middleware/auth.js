const bcrypt = require('bcryptjs');

// Check if user is authenticated
const requireAuth = (req, res, next) => {
  console.log('🔐 Auth Check:', {
    sessionId: req.sessionID,
    hasSession: !!req.session,
    authenticated: req.session?.authenticated,
    role: req.session?.role,
    path: req.path,
    cookies: req.headers.cookie ? 'present' : 'missing'
  });

  if (req.session && req.session.authenticated) {
    const sessionMaxAge = 24 * 60 * 60 * 1000; // 24 hours
    const loginTime = req.session.loginTime ? new Date(req.session.loginTime) : null;

    if (loginTime && (Date.now() - loginTime.getTime()) > sessionMaxAge) {
      req.session.destroy((err) => {
        if (err) console.error('Error destroying expired session:', err);
      });
      const isApiRequest = req.path.startsWith('/api/') || req.originalUrl.startsWith('/api/');
      if (isApiRequest) {
        return res.status(401).json({
          message: 'Session expired',
          code: 'SESSION_EXPIRED',
          redirect: '/login'
        });
      }
      return res.redirect('/login?expired=true');
    }

    return next();
  }

  console.log('❌ Authentication failed for:', req.path);
  const isApiRequest = req.path.startsWith('/api/') || req.originalUrl.startsWith('/api/');
  if (isApiRequest) {
    return res.status(401).json({
      message: 'Authentication required',
      code: 'AUTH_REQUIRED',
      redirect: '/login'
    });
  }
  return res.redirect('/login');
};

// Check if user is NOT authenticated (for login page)
const requireGuest = (req, res, next) => {
  if (req.session && req.session.authenticated) {
    // Redirect based on role
    const redirectUrl = req.session.role === 'admin' ? '/admin' : '/';
    return res.redirect(redirectUrl);
  }
  next();
};

// Login handler for admin
const login = async (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ message: 'Password is required' });
  }

  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  if (!process.env.ADMIN_PASSWORD) {
    console.warn('⚠️  ADMIN_PASSWORD environment variable not set. Using default password "admin123".');
  }

  const isValidPassword = adminPassword.startsWith('$2')
    ? await bcrypt.compare(password, adminPassword)
    : password === adminPassword;

  if (isValidPassword) {
    req.session.authenticated = true;
    req.session.loginTime = new Date();
    req.session.role = 'admin';

    console.log('🔓 Admin login successful:', { sessionId: req.sessionID });

    if (req.headers['content-type'] === 'application/json') {
      return res.json({ message: 'Login successful', redirect: '/admin' });
    }
    return res.redirect('/admin');
  }

  if (req.headers['content-type'] === 'application/json') {
    return res.status(401).json({ message: 'Invalid password' });
  }
  return res.redirect('/login?error=invalid');
};

// Login handler for invitado (guest)
const loginInvitado = (req, res) => {
  req.session.authenticated = true;
  req.session.loginTime = new Date();
  req.session.role = 'invitado';
  console.log('🔓 Invitado login successful:', { sessionId: req.sessionID });
  // Redirect to a dedicated upload page for guests
  res.redirect('/upload'); 
};

// Login handler for slideshow
const loginSlideshow = (req, res) => {
  req.session.authenticated = true;
  req.session.loginTime = new Date();
  req.session.role = 'slideshow';
  console.log('🔓 Slideshow login successful:', { sessionId: req.sessionID });
  res.redirect('/slideshow');
};

// Logout handler
const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
    }
    res.redirect('/login');
  });
};

// Get authentication status
const getAuthStatus = (req, res) => {
  res.json({
    authenticated: !!(req.session && req.session.authenticated),
    role: req.session?.role || null,
    loginTime: req.session?.loginTime || null
  });
};

// Middleware to check for a specific role
const hasRole = (roles) => {
  return (req, res, next) => {
    if (req.session && req.session.authenticated && roles.includes(req.session.role)) {
      return next();
    }
    res.status(403).json({ 
      message: 'Forbidden: Insufficient permissions',
      code: 'FORBIDDEN'
    });
  };
};

module.exports = {
  requireAuth,
  requireGuest,
  login,
  loginInvitado,
  loginSlideshow,
  logout,
  getAuthStatus,
  hasRole
};