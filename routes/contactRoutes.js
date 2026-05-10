const express = require('express');
const router  = express.Router();
const { getContact, submitContact } = require('../controllers/contactController');

router.get('/',  getContact);
router.post('/', submitContact);

module.exports = router;
