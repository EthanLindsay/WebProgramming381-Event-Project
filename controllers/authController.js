const User = require('../models/User');

// GET /auth/login
const getLogin = (req, res) => {
  if (req.session.user) return res.redirect('/events');
  const registered = req.query.registered === 'true';
  res.render('auth/login', { title: 'Login', error: null, registered });
};

// POST /auth/login
const postLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.render('auth/login', {
        title: 'Login',
        error: 'Invalid email or password.',
        registered: false
      });
    }

    // Store only the fields we need in session (not the full Mongoose document)
    req.session.user = {
      _id:   user._id,
      name:  user.name,
      email: user.email,
      role:  user.role
    };

    // Redirect admins straight to their dashboard
    res.redirect(user.role === 'admin' ? '/admin/dashboard' : '/bookings/dashboard');
  } catch (err) {
    res.render('auth/login', { title: 'Login', error: 'An error occurred. Please try again.', registered: false });
  }
};

// GET /auth/register
const getRegister = (req, res) => {
  if (req.session.user) return res.redirect('/events');
  res.render('auth/register', { title: 'Create Account', error: null });
};

// POST /auth/register
const postRegister = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  try {
    if (password !== confirmPassword) {
      return res.render('auth/register', { title: 'Create Account', error: 'Passwords do not match.' });
    }
    if (await User.findOne({ email })) {
      return res.render('auth/register', { title: 'Create Account', error: 'An account with that email already exists.' });
    }
    await new User({ name, email, password }).save();
    res.redirect('/auth/login?registered=true');
  } catch (err) {
    res.render('auth/register', { title: 'Create Account', error: 'Registration failed. Please try again.' });
  }
};

// GET /auth/logout
const logout = (req, res) => {
  req.session.destroy(() => res.redirect('/events'));
};

module.exports = { getLogin, postLogin, getRegister, postRegister, logout };
