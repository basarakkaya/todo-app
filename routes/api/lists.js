const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const auth = require('../../middleware/auth');
const logger = require('../../util/logger');

const List = require('../../models/List');
const User = require('../../models/User');

/**
 * @route       GET api/lists
 * @description Get user's lists
 * @access      Private
 */
router.get('/', auth, async (req, res) => {});

/**
 * @route       POST api/lists
 * @description Create a new list
 * @access      Private
 */
router.post('/', auth, async (req, res) => {});

/**
 * @route       PUT api/lists/desc/:list_id
 * @description Update description of a list
 * @access      Private
 */
router.put('/desc/:list_id', auth, async (req, res) => {});

/**
 * @route       DELETE api/lists/:list_id
 * @description Delete a list with id of list_id
 * @access      Private
 */
router.delete('/:list_id', auth, async (req, res) => {});

/**
 * @route       POST api/lists/item/:list_id
 * @description Adds an to-do item to a list with id of list_id
 * @access      Private
 */
router.post('/item/:list_id', auth, async (req, res) => {});

/**
 * @route       PUT api/lists/item/:list_id/:item_id
 * @description Update a to-do item of item_id, of list of list_id
 * @access      Private
 */
router.put('/item/:list_id/:item_id', auth, async (req, res) => {});

/**
 * @route       DELETE api/lists/item/:list_id/:item_id
 * @description Delete a to-do item of item_id, of list of list_id
 * @access      Private
 */
router.delete('/item/:list_id/:item_id', auth, async (req, res) => {});

/**
 * @route       POST api/lists/users/:list_id
 * @description Adds a user to a list with id of list_id
 * @access      Private
 */
router.post('/users/:list_id', auth, async (req, res) => {});

/**
 * @route       DELETE api/lists/users/:list_id/:user_id
 * @description Remove a user of user_id from a list with id of list_id
 * @access      Private
 */
router.delete('/users/:list_id/:user_id', auth, async (req, res) => {});

module.exports = router;
