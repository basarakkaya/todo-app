const express = require('express');
const path = require('path');

const connectDB = require('./config/db');
const logger = require('./util/logger');

const app = express();

// connect DB
connectDB();

// Init middleware
app.use(express.json({ extended: false }));
app.use(require('morgan')('dev'));

// Define routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/lists', require('./routes/api/lists'));
app.use('/api/auth', require('./routes/api/auth'));

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => logger.info(`Server started on port ${PORT}`));
