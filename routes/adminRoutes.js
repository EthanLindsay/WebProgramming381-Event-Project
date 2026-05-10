const express = require('express');
const router  = express.Router();
const { isLoggedIn, isAdmin } = require('../middleware/auth');
const upload  = require('../middleware/upload');
const {
  getAdminEvents, createEvent, getEditEvent, updateEvent, deleteEvent,
  getAdminDashboard,
  getEnquiries, updateEnquiryStatus, deleteEnquiry
} = require('../controllers/adminController');

// Every route in this file requires login + admin role
router.use(isLoggedIn, isAdmin);

router.get('/dashboard',              getAdminDashboard);

router.get('/events',                 getAdminEvents);
router.post('/events',                upload.single('image'), createEvent);
router.get('/events/:id/edit',        getEditEvent);
router.post('/events/:id/edit',       upload.single('image'), updateEvent);
router.post('/events/:id/delete',     deleteEvent);

router.get('/enquiries',              getEnquiries);
router.post('/enquiries/:id/status',  updateEnquiryStatus);
router.post('/enquiries/:id/delete',  deleteEnquiry);

module.exports = router;
