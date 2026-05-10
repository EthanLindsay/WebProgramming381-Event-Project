const express = require('express');
const router  = express.Router();
const { getDashboard, createBooking, cancelBooking } = require('../controllers/bookingController');
const { isLoggedIn } = require('../middleware/auth');

// All booking routes require an authenticated user
router.get('/dashboard',     isLoggedIn, getDashboard);
router.post('/',             isLoggedIn, createBooking);
router.post('/:id/cancel',   isLoggedIn, cancelBooking);

module.exports = router;
