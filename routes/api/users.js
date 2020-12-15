const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

const auth = require('../../middleware/auth');
const logger = require('../../util/logger');

const User = require('../../models/User');

/**
 * @route       GET api/users
 * @description Get all users
 * @access      Private
 */
router.get('/', auth, async (req, res) => {});

/**
 * @route       POST api/users
 * @description Register User (Signup)
 * @access      Public
 */
router.post('/', [], async (req, res) => {});

module.exports = router;
