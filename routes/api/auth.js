const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

const auth = require('../../middleware/auth');
const logger = require('../../util/logger');

const User = require('../../models/User');

/**
 * @route       GET api/auth
 * @description Test route
 * @access      Public
 */
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    res.json(user);
  } catch (error) {
    logger.error(error.message);
    res.status(500).send('Server Error');
  }
});

/**
 * @route       POST api/auth
 * @description Authenticate user & get token (Login)
 * @access      Public
 */
router.post('/', [], async (req, res) => {});

module.exports = router;
