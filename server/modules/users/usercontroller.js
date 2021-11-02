const express = require('express');
const router = express.Router();
const Users = require('./users');

router.post('/signup', Users.createUser);
router.post('/login', Users.loginUser);

module.exports = router;