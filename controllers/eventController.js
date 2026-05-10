const Event = require('../models/Event');

const CATEGORIES = ['Conference', 'Workshop', 'Festival', 'Private', 'Corporate'];

// GET /events — listing with optional search and filter
const getEvents = async (req, res) => {
  try {
    const { search, category, date, availability } = req.query;
    const query = {};

    // Text search across title and location
    if (search) {
      query.$or = [
        { title:    { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    if (category && category !== 'all') query.category = category;

    // Filter to events on a specific date (whole day window)
    if (date) {
      const start = new Date(date);
      const end   = new Date(date);
      end.setDate(end.getDate() + 1);
      query.date = { $gte: start, $lt: end };
    }

    // Only events that still have capacity left
    if (availability === 'available') {
      query.$expr = { $lt: ['$bookedCount', '$capacity'] };
    }

    const events = await Event.find(query).sort({ date: 1 });

    res.render('index', {
      title: 'Browse Events',
      events,
      categories: CATEGORIES,
      query: req.query
    });
  } catch (err) {
    res.status(500).render('error', { title: 'Error', message: err.message, statusCode: 500 });
  }
};

// GET /events/:id — single event detail
const getEventDetail = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).render('error', { title: 'Not Found', message: 'Event not found.', statusCode: 404 });
    }
    res.render('events/detail', {
      title: event.title,
      event,
      error:   req.query.error   || null,
      success: req.query.success || null
    });
  } catch (err) {
    res.status(500).render('error', { title: 'Error', message: err.message, statusCode: 500 });
  }
};

module.exports = { getEvents, getEventDetail };
