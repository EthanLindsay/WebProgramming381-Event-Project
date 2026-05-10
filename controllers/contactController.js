const Contact = require('../models/Contact');

// GET /contact
const getContact = (req, res) => {
  res.render('contact/index', { title: 'Contact Us', success: null, error: null });
};

// POST /contact — save enquiry to the database
const submitContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    await new Contact({ name, email, subject, message }).save();
    res.render('contact/index', {
      title: 'Contact Us',
      success: 'Your enquiry has been submitted. We will get back to you shortly.',
      error: null
    });
  } catch (err) {
    res.render('contact/index', {
      title: 'Contact Us',
      success: null,
      error: 'Could not submit your enquiry. Please try again.'
    });
  }
};

module.exports = { getContact, submitContact };
