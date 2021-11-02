const express = require('express');
const router = express.Router();

const Tips = require('./tips');

router.get('/', Tips.getTips);
router.post('/calculate', Tips.calculateTips);

module.exports = router;