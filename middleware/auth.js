// Middleware: ensure the user is logged in before accessing a route
const isLoggedIn = (req, res, next) => {
  if (req.session.user) return next();
  res.redirect('/auth/login');
};

// Middleware: ensure the logged-in user has the admin role
const isAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.role === 'admin') return next();
  res.status(403).render('error', {
    title: 'Access Denied',
    message: 'You do not have permission to access this page.',
    statusCode: 403
  });
};

module.exports = { isLoggedIn, isAdmin };
