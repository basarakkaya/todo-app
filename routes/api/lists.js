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
router.get('/', auth, async (req, res) => {
  try {
    const lists = await List.find({ users: { $in: req.user.id } });

    res.json(lists);
  } catch (error) {
    logger.error(error.message);
    res.status(500).send('Server Error');
  }
});

/**
 * @route       POST api/lists
 * @description Create a new list
 * @access      Private
 */
router.post(
  '/',
  [auth, check('name', 'Please include a name for list').not().isEmpty()],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    }

    try {
      const existingName = await List.find({ name: { $eq: req.body.name } });

      if (existingName.length > 0)
        return res
          .status(400)
          .json({ errors: [{ msg: 'List name already exists' }] });

      await User.findById(req.user.id).select('-password');

      const newList = List({
        users: [req.user.id],
        name: req.body.name,
        description: req.body.description || '',
        items: [],
      });

      const list = await newList.save();

      res.json(list);
    } catch (error) {
      logger.error(error.message);
      res.status(500).send('Server Error');
    }
  }
);

/**
 * @route       PUT api/lists/desc/:list_id
 * @description Update description of a list
 * @access      Private
 */
router.put('/desc/:list_id', auth, async (req, res) => {
  try {
    const list = await List.findById(req.params.list_id);

    if (!list) {
      return res.status(404).json({ errors: [{ msg: 'List not found ' }] });
    }

    if (list.users.indexOf(req.user.id) < 0) {
      return res.status(401).json({
        errors: [{ msg: 'User is not authorized to perform this action' }],
      });
    }

    list.description = req.body.description || '';

    await list.save();

    res.json(list);
  } catch (error) {
    logger.error(error.message);
    res.status(500).send('Server Error');
  }
});

/**
 * @route       DELETE api/lists/:list_id
 * @description Delete a list with id of list_id
 * @access      Private
 */
router.delete('/:list_id', auth, async (req, res) => {
  try {
    const list = await List.findById(req.params.list_id);

    if (list.users.indexOf(req.user.id) < 0) {
      return res.status(401).json({
        errors: [{ msg: 'User is not authorized to perform this action' }],
      });
    }

    await List.findOneAndRemove({ _id: req.params.list_id });

    res.json({ msg: 'List deleted' });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ errors: [{ msg: 'Server Error' }] });
  }
});

/**
 * @route       POST api/lists/item/:list_id
 * @description Adds a to-do item to a list with id of list_id
 * @access      Private
 */
router.post(
  '/item/:list_id',
  [auth, check('text', 'Please include to-do item text').not().isEmpty()],
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const list = await List.findById(req.params.list_id);

      if (list.users.indexOf(req.user.id) < 0) {
        return res.status(401).json({
          errors: [{ msg: 'User is not authorized to perform this action' }],
        });
      }

      const { text, completedDate, dueDate } = req.body;

      const newItem = {
        text,
        completedDate,
        dueDate,
        indexInList: list.items.length,
      };

      list.items.unshift(newItem);

      await list.save();

      res.json(list);
    } catch (error) {
      logger.error(error.message);
      res.status(500).send('Server Error');
    }
  }
);

/**
 * @route       PUT api/lists/item/:list_id/:item_id
 * @description Update a to-do item of item_id, of list of list_id
 * @access      Private
 */
router.put('/item/:list_id/:item_id', auth, async (req, res) => {
  try {
    const list = await List.findById(req.params.list_id);

    if (list.users.indexOf(req.user.id) < 0) {
      return res.status(401).json({
        errors: [{ msg: 'User is not authorized to perform this action' }],
      });
    }

    const newList = await List.findOneAndUpdate(
      { _id: req.params.list_id },
      {
        $set: {
          ...(req.body.text ? { 'items.$[elem].text': req.body.text } : {}),
          ...(req.body.indexInList
            ? { 'items.$[elem].indexInList': req.body.indexInList }
            : {}),
          ...(req.body.completedDate
            ? { 'items.$[elem].completedDate': req.body.completedDate }
            : {}),
          ...(req.body.dueDate
            ? { 'items.$[elem].dueDate': req.body.dueDate }
            : {}),
        },
      },
      { arrayFilters: [{ 'elem._id': { $eq: req.params.item_id } }] }
    );

    res.json(newList);
  } catch (error) {
    logger.error(error.message);
    res.status(500).send('Server Error');
  }
});

/**
 * @route       DELETE api/lists/item/:list_id/:item_id
 * @description Delete a to-do item of item_id, of list of list_id
 * @access      Private
 */
router.delete('/item/:list_id/:item_id', auth, async (req, res) => {
  try {
    const list = await List.findById(req.params.list_id);

    if (!list) {
      return res.status(404).json({ errors: [{ msg: 'List not found' }] });
    }

    if (list.users.indexOf(req.user.id) < 0) {
      return res.status(401).json({
        errors: [{ msg: 'User is not authorized to perform this action' }],
      });
    }

    const item = list.items.find((item) => item.id === req.params.item_id);

    if (!item) {
      return res.status(404).json({ errors: [{ msg: 'Item not found' }] });
    }

    const removeIndex = list.items
      .map((item) => item._id)
      .indexOf(req.params.item_id);

    list.items.splice(removeIndex, 1);

    await list.save();

    res.json(list.items);
  } catch (error) {
    logger.error(error.message);
    res.status(500).send('Server Error');
  }
});

/**
 * @route       POST api/lists/users/:list_id
 * @description Adds a user to a list with id of list_id, by user email
 * @access      Private
 */
router.post('/users/:list_id', auth, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({ errors: [{ msg: 'User not found' }] });
    }

    const list = await List.findById(req.params.list_id);

    if (!list) {
      return res.status(404).json({ errors: [{ msg: 'List not found' }] });
    }

    if (list.users.indexOf(req.user.id) < 0) {
      return res.status(401).json({
        errors: [{ msg: 'User is not authorized to perform this action' }],
      });
    }

    list.users.unshift(user);

    await list.save();

    res.json(list);
  } catch (error) {
    logger.error(error.message);
    res.status(500).send('Server Error');
  }
});

/**
 * @route       DELETE api/lists/users/:list_id/:user_id
 * @description Remove a user of user_id from a list with id of list_id
 * @access      Private
 */
router.delete('/users/:list_id/:user_id', auth, async (req, res) => {
  try {
    const list = await List.findById(req.params.list_id);

    if (!list) {
      return res.status(404).json({ errors: [{ msg: 'List not found' }] });
    }

    if (list.users.indexOf(req.user.id) < 0) {
      return res.status(401).json({
        errors: [{ msg: 'User is not authorized to perform this action' }],
      });
    }

    if (list.users.length === 1) {
      return res.status(400).json({
        errors: [
          {
            msg:
              'You cannot remove this user, a list must have at least 1 user',
          },
        ],
      });
    }

    const removeIndex = list.users.indexOf(req.params.user_id);

    if (removeIndex < 0) {
      return res
        .status(404)
        .json({ errors: [{ msg: 'User not found in list users' }] });
    }

    list.users.splice(removeIndex, 1);

    await list.save();

    res.json(list);
  } catch (error) {
    logger.error(error.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
