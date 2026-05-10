const express = require('express');
const router  = express.Router();
const Event   = require('../models/Event');
const Booking = require('../models/Booking');
const Contact = require('../models/Contact');
const { isLoggedIn, isAdmin } = require('../middleware/auth');

// ─── EVENTS ──────────────────────────────────────────────────────────────────

// GET /api/events — public
router.get('/events', async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json({ success: true, count: events.length, data: events });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/events/:id — public
router.get('/events/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found.' });
    res.json({ success: true, data: event });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/events — admin only
router.post('/events', isLoggedIn, isAdmin, async (req, res) => {
  try {
    const event = await new Event({ ...req.body, createdBy: req.session.user._id }).save();
    res.status(201).json({ success: true, data: event });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PUT /api/events/:id — admin only
router.put('/events/:id', isLoggedIn, isAdmin, async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!event) return res.status(404).json({ success: false, message: 'Event not found.' });
    res.json({ success: true, data: event });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE /api/events/:id — admin only
router.delete('/events/:id', isLoggedIn, isAdmin, async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found.' });
    await Booking.deleteMany({ event: req.params.id });
    res.json({ success: true, message: 'Event deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── BOOKINGS ─────────────────────────────────────────────────────────────────

// GET /api/bookings — users see their own; admins see all
router.get('/bookings', isLoggedIn, async (req, res) => {
  try {
    const filter = req.session.user.role === 'admin' ? {} : { user: req.session.user._id };
    const bookings = await Booking.find(filter)
      .populate('event', 'title date')
      .populate('user',  'name email');
    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── CONTACTS ─────────────────────────────────────────────────────────────────

// GET /api/contacts — admin only
router.get('/contacts', isLoggedIn, isAdmin, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json({ success: true, count: contacts.length, data: contacts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
