const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ListSchema = new Schema({
  users: [
    {
      type: Schema.Types.ObjectId,
      ref: 'users',
    },
  ],
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  items: [
    {
      text: {
        type: String,
        required: true,
      },
      completedDate: {
        type: Date,
      },
      dueDate: {
        type: Date,
      },
      date: {
        type: Date,
        default: Date.now,
      },
      order: {
        type: Number,
      },
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = List = mongoose.model('list', ListSchema);
