const express = require('express');
const router  = express.Router();
const { getEvents, getEventDetail } = require('../controllers/eventController');

router.get('/',    getEvents);
router.get('/:id', getEventDetail);

module.exports = router;
