const Event   = require('../models/Event');
const Booking = require('../models/Booking');
const User    = require('../models/User');
const Contact = require('../models/Contact');

const CATEGORIES = ['Conference', 'Workshop', 'Festival', 'Private', 'Corporate'];

// ─── EVENT MANAGEMENT ────────────────────────────────────────────────────────

// GET /admin/events
const getAdminEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.render('admin/events', {
      title:      'Manage Events',
      events,
      categories: CATEGORIES,
      error:      req.query.error   || null,
      success:    req.query.success || null
    });
  } catch (err) {
    res.status(500).render('error', { title: 'Error', message: err.message, statusCode: 500 });
  }
};

// POST /admin/events — create a new event
const createEvent = async (req, res) => {
  try {
    const { title, description, category, date, time, location, price, capacity } = req.body;
    const image = req.file ? `/images/events/${req.file.filename}` : '/images/placeholder.jpg';
    await new Event({
      title, description, category, date, time, location,
      price:    parseFloat(price),
      capacity: parseInt(capacity, 10),
      image,
      createdBy: req.session.user._id
    }).save();
    res.redirect('/admin/events?success=Event+created+successfully.');
  } catch (err) {
    const events = await Event.find().sort({ date: 1 });
    res.render('admin/events', {
      title: 'Manage Events', events, categories: CATEGORIES,
      error: err.message, success: null
    });
  }
};

// GET /admin/events/:id/edit
const getEditEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).render('error', { title: 'Not Found', message: 'Event not found.', statusCode: 404 });
    res.render('admin/editEvent', { title: 'Edit Event', event, categories: CATEGORIES, error: null });
  } catch (err) {
    res.status(500).render('error', { title: 'Error', message: err.message, statusCode: 500 });
  }
};

// POST /admin/events/:id/edit — update an event
const updateEvent = async (req, res) => {
  try {
    const { title, description, category, date, time, location, price, capacity } = req.body;
    const updateData = {
      title, description, category, date, time, location,
      price: parseFloat(price),
      capacity: parseInt(capacity, 10)
    };
    if (req.file) {
      updateData.image = `/images/events/${req.file.filename}`;
    } else if (req.body.removeImage === '1') {
      updateData.image = '/images/placeholder.jpg';
    }

    await Event.findByIdAndUpdate(req.params.id, updateData, { runValidators: true });
    res.redirect('/admin/events?success=Event+updated+successfully.');
  } catch (err) {
    const event = await Event.findById(req.params.id);
    res.render('admin/editEvent', { title: 'Edit Event', event, categories: CATEGORIES, error: err.message });
  }
};

// POST /admin/events/:id/delete — remove an event and its bookings
const deleteEvent = async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    await Booking.deleteMany({ event: req.params.id }); // cascade delete
    res.redirect('/admin/events?success=Event+deleted.');
  } catch (err) {
    res.redirect('/admin/events?error=' + encodeURIComponent(err.message));
  }
};

// ─── DASHBOARD ───────────────────────────────────────────────────────────────

// GET /admin/dashboard — analytics overview
const getAdminDashboard = async (req, res) => {
  try {
    const [totalEvents, totalUsers, totalBookings, revenueResult] = await Promise.all([
      Event.countDocuments(),
      User.countDocuments({ role: 'user' }),
      Booking.countDocuments({ status: 'confirmed' }),
      Booking.aggregate([
        { $match: { status: 'confirmed' } },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } }
      ])
    ]);

    const popularEvents = await Event.find().sort({ bookedCount: -1 }).limit(5);

    const recentBookings = await Booking.find({ status: 'confirmed' })
      .populate('user',  'name email')
      .populate('event', 'title date')
      .sort({ createdAt: -1 })
      .limit(8);

    res.render('admin/dashboard', {
      title: 'Admin Dashboard',
      stats: {
        totalEvents,
        totalUsers,
        totalBookings,
        totalRevenue: revenueResult[0]?.total || 0
      },
      popularEvents,
      recentBookings,
      success: req.query.success || null,
      error:   req.query.error   || null
    });
  } catch (err) {
    res.status(500).render('error', { title: 'Error', message: err.message, statusCode: 500 });
  }
};

// ─── ENQUIRIES ───────────────────────────────────────────────────────────────

// GET /admin/enquiries
const getEnquiries = async (req, res) => {
  try {
    const enquiries = await Contact.find().sort({ createdAt: -1 });
    res.render('admin/enquiries', {
      title: 'Manage Enquiries',
      enquiries,
      success: req.query.success || null,
      error:   req.query.error   || null
    });
  } catch (err) {
    res.status(500).render('error', { title: 'Error', message: err.message, statusCode: 500 });
  }
};

// POST /admin/enquiries/:id/status — update enquiry status
const updateEnquiryStatus = async (req, res) => {
  try {
    await Contact.findByIdAndUpdate(req.params.id, { status: req.body.status });
    res.redirect('/admin/enquiries?success=Status+updated.');
  } catch (err) {
    res.redirect('/admin/enquiries?error=' + encodeURIComponent(err.message));
  }
};

// POST /admin/enquiries/:id/delete
const deleteEnquiry = async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.redirect('/admin/enquiries?success=Enquiry+deleted.');
  } catch (err) {
    res.redirect('/admin/enquiries?error=' + encodeURIComponent(err.message));
  }
};

module.exports = {
  getAdminEvents, createEvent, getEditEvent, updateEvent, deleteEvent,
  getAdminDashboard,
  getEnquiries, updateEnquiryStatus, deleteEnquiry
};
