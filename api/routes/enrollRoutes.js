const express = require('express');
const router = express.Router();
const { enrollStudent } = require('../controllers/studentController');
const authenticateJWT = require('../config/auth');

router.post('/students/enroll', authenticateJWT, enrollStudent);

module.exports = router;