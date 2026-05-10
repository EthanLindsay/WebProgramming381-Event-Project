const Booking = require('../models/Booking');
const Event   = require('../models/Event');

// GET /bookings/dashboard — user's personal booking history
const getDashboard = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.session.user._id })
      .populate('event')
      .sort({ createdAt: -1 });

    res.render('bookings/dashboard', {
      title:   'My Bookings',
      bookings,
      success: req.query.success || null,
      error:   req.query.error   || null
    });
  } catch (err) {
    res.status(500).render('error', { title: 'Error', message: err.message, statusCode: 500 });
  }
};

// POST /bookings — create a new booking
const createBooking = async (req, res) => {
  try {
    const { eventId, ticketCount } = req.body;
    const count = parseInt(ticketCount, 10) || 1;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).render('error', { title: 'Not Found', message: 'Event not found.', statusCode: 404 });
    }

    // Guard: check remaining capacity
    if (event.bookedCount + count > event.capacity) {
      return res.redirect(`/events/${eventId}?error=Not+enough+tickets+available.`);
    }

    // Guard: one confirmed booking per user per event
    const existing = await Booking.findOne({
      user:   req.session.user._id,
      event:  eventId,
      status: 'confirmed'
    });
    if (existing) {
      return res.redirect(`/events/${eventId}?error=You+already+have+a+booking+for+this+event.`);
    }

    await new Booking({
      user:        req.session.user._id,
      event:       eventId,
      ticketCount: count,
      totalPrice:  event.price * count
    }).save();

    // Keep bookedCount in sync on the event document
    event.bookedCount += count;
    await event.save();

    res.redirect('/bookings/dashboard?success=Booking+confirmed!');
  } catch (err) {
    res.status(500).render('error', { title: 'Error', message: err.message, statusCode: 500 });
  }
};

// POST /bookings/:id/cancel — cancel a booking
const cancelBooking = async (req, res) => {
  try {
    // Only allow the booking owner to cancel
    const booking = await Booking.findOne({ _id: req.params.id, user: req.session.user._id });
    if (!booking) {
      return res.status(404).render('error', { title: 'Not Found', message: 'Booking not found.', statusCode: 404 });
    }
    if (booking.status === 'cancelled') {
      return res.redirect('/bookings/dashboard?error=This+booking+is+already+cancelled.');
    }

    booking.status = 'cancelled';
    await booking.save();

    // Release the capacity back to the event
    await Event.findByIdAndUpdate(booking.event, { $inc: { bookedCount: -booking.ticketCount } });

    res.redirect('/bookings/dashboard?success=Booking+cancelled.');
  } catch (err) {
    res.status(500).render('error', { title: 'Error', message: err.message, statusCode: 500 });
  }
};

module.exports = { getDashboard, createBooking, cancelBooking };
