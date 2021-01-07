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
 * @route       GET api/lists/:list_id
 * @description Get a single list of user
 * @access      Private
 */
router.get('/:list_id', auth, async (req, res) => {
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

    res.json(list);
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
      return res.status(400).json({ errors: errors.array() });
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
      return res.status(404).json({ errors: [{ msg: 'List not found' }] });
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
 * @route       PUT api/lists/rearrange/:list_id
 * @description Rearranges the list order
 * @access      Private
 */
router.put('/rearrange/:list_id', auth, async (req, res) => {
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

    list.items = req.body.items.map(
      ({ _id, text, completedDate, dueDate, date }, index) => ({
        _id,
        text,
        completedDate,
        dueDate,
        date,
        order: index,
      })
    );

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

    if (!list) {
      return res.status(404).json({ errors: [{ msg: 'List not found' }] });
    }

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

      if (!list) {
        return res.status(404).json({ errors: [{ msg: 'List not found' }] });
      }

      if (list.users.indexOf(req.user.id) < 0) {
        return res.status(401).json({
          errors: [{ msg: 'User is not authorized to perform this action' }],
        });
      }

      const { text, dueDate } = req.body;

      const newItem = {
        text,
        dueDate,
      };

      list.items.unshift(newItem);
      list.items = list.items.map(
        ({ _id, text, completedDate, dueDate, date }, index) => ({
          _id,
          text,
          completedDate,
          dueDate,
          date,
          order: index,
        })
      );

      await list.save();

      res.json(list);
    } catch (error) {
      logger.error(error.message);
      res.status(500).send('Server Error');
    }
  }
);

/**
 * @route       PUT api/lists/item/text/:list_id/:item_id
 * @description Update text of a to-do item of item_id, of list of list_id
 * @access      Private
 */
router.put(
  '/item/text/:list_id/:item_id',
  [auth, check('text', 'Please include to-do text').not().isEmpty()],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const list = await List.findById(req.params.list_id);

      if (!list) {
        return res.status(404).json({ errors: [{ msg: 'List not found ' }] });
      }

      const item = list.items.filter((item) => item.id === req.params.item_id);

      if (item.length === 0) {
        return res.status(404).json({ errors: [{ msg: 'Item not found' }] });
      }

      if (list.users.indexOf(req.user.id) < 0) {
        return res.status(401).json({
          errors: [{ msg: 'User is not authorized to perform this action' }],
        });
      }

      const newList = await List.findOneAndUpdate(
        { _id: req.params.list_id },
        {
          $set: {
            'items.$[elem].text': req.body.text,
          },
        },
        {
          arrayFilters: [{ 'elem._id': { $eq: req.params.item_id } }],
          new: true,
        }
      );

      res.json(newList);
    } catch (error) {
      logger.error(error.message);
      res.status(500).send('Server Error');
    }
  }
);

/**
 * @route       PUT api/lists/item/complete/:list_id/:item_id
 * @description Update a to-do item of item_id, of list of list_id as completed on now's date
 * @access      Private
 */
router.put('/item/complete/:list_id/:item_id', auth, async (req, res) => {
  try {
    const list = await List.findById(req.params.list_id);

    if (!list) {
      return res.status(404).json({ errors: [{ msg: 'List not found ' }] });
    }

    const item = list.items.filter((item) => item.id === req.params.item_id);

    if (item.length === 0) {
      return res.status(404).json({ errors: [{ msg: 'Item not found' }] });
    }

    if (item[0].completedDate) {
      return res
        .status(400)
        .json({ errors: [{ msg: 'Item has already been completed' }] });
    }

    if (list.users.indexOf(req.user.id) < 0) {
      return res.status(401).json({
        errors: [{ msg: 'User is not authorized to perform this action' }],
      });
    }

    const newList = await List.findOneAndUpdate(
      { _id: req.params.list_id },
      {
        $set: {
          'items.$[elem].completedDate': Date.now(),
        },
      },
      { arrayFilters: [{ 'elem._id': { $eq: req.params.item_id } }], new: true }
    );

    res.json(newList);
  } catch (error) {
    logger.error(error.message);
    res.status(500).send('Server Error');
  }
});

/**
 * @route       PUT api/lists/item/incomplete/:list_id/:item_id
 * @description Update a to-do item of item_id, of list of list_id as incomplete
 * @access      Private
 */
router.put('/item/incomplete/:list_id/:item_id', auth, async (req, res) => {
  try {
    const list = await List.findById(req.params.list_id);

    if (!list) {
      return res.status(404).json({ errors: [{ msg: 'List not found ' }] });
    }

    const item = list.items.filter((item) => item.id === req.params.item_id);

    if (item.length === 0) {
      return res.status(404).json({ errors: [{ msg: 'Item not found' }] });
    }

    if (!item[0].completedDate) {
      return res
        .status(400)
        .json({ errors: [{ msg: 'Item has not been completed' }] });
    }

    if (list.users.indexOf(req.user.id) < 0) {
      return res.status(401).json({
        errors: [{ msg: 'User is not authorized to perform this action' }],
      });
    }

    const newList = await List.findOneAndUpdate(
      { _id: req.params.list_id },
      {
        $set: {
          'items.$[elem].completedDate': null,
        },
      },
      { arrayFilters: [{ 'elem._id': { $eq: req.params.item_id } }], new: true }
    );

    res.json(newList);
  } catch (error) {
    logger.error(error.message);
    res.status(500).send('Server Error');
  }
});

/**
 * @route       PUT api/lists/item/due/:list_id/:item_id
 * @description Update due date of a to-do item of item_id, of list of list_id
 * @access      Private
 */
router.put(
  '/item/due/:list_id/:item_id',
  [
    auth,
    check('dueDate', 'Enter a valid due date').not().isEmpty(),
    check('dueDate', 'Enter a valid due date').isDate(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors) {
        return res.status(400).json({ errors: errors.array() });
      }

      const list = await List.findById(req.params.list_id);

      if (!list) {
        return res.status(404).json({ errors: [{ msg: 'List not found ' }] });
      }

      const item = list.items.filter((item) => item.id === req.params.item_id);

      if (item.length === 0) {
        return res.status(404).json({ errors: [{ msg: 'Item not found' }] });
      }

      if (list.users.indexOf(req.user.id) < 0) {
        return res.status(401).json({
          errors: [{ msg: 'User is not authorized to perform this action' }],
        });
      }

      const newList = await List.findOneAndUpdate(
        { _id: req.params.list_id },
        {
          $set: {
            'items.$[elem].dueDate': req.body.dueDate,
          },
        },
        {
          arrayFilters: [{ 'elem._id': { $eq: req.params.item_id } }],
          new: true,
        }
      );

      res.json(newList);
    } catch (error) {
      logger.error(error.message);
      res.status(500).send('Server Error');
    }
  }
);

/**
 * @route       PUT api/lists/item/undue/:list_id/:item_id
 * @description Remove due data of a to-do item of item_id, of list of list_id
 * @access      Private
 */
router.put('/item/undue/:list_id/:item_id', auth, async (req, res) => {
  try {
    const list = await List.findById(req.params.list_id);

    if (!list) {
      return res.status(404).json({ errors: [{ msg: 'List not found ' }] });
    }

    const item = list.items.filter((item) => item.id === req.params.item_id);

    if (item.length === 0) {
      return res.status(404).json({ errors: [{ msg: 'Item not found' }] });
    }

    if (!item[0].dueDate) {
      return res
        .status(400)
        .json({ errors: [{ msg: 'Item does not have a due date' }] });
    }

    if (list.users.indexOf(req.user.id) < 0) {
      return res.status(401).json({
        errors: [{ msg: 'User is not authorized to perform this action' }],
      });
    }

    const newList = await List.findOneAndUpdate(
      { _id: req.params.list_id },
      {
        $set: {
          'items.$[elem].dueDate': null,
        },
      },
      { arrayFilters: [{ 'elem._id': { $eq: req.params.item_id } }], new: true }
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
    list.items = list.items.map(
      ({ _id, text, completedDate, dueDate, date }, index) => ({
        _id,
        text,
        completedDate,
        dueDate,
        date,
        order: index,
      })
    );

    await list.save();

    res.json(list);
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
