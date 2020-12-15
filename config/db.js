const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');
const logger = require('../util/logger');

/**
 * @description Creates DB Connection with given credential & configs
 */
const connectDB = async () => {
  try {
    logger.info('Waiting for the MongoDB connection');

    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: true,
    });

    logger.info('MongoDB connected!');
  } catch (error) {
    logger.error(error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
