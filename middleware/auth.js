const jwt = require('jsonwebtoken');
const config = require('config');
const logger = require('../util/logger');

module.exports = function (req, res, next) {
  const token = req.header('x-auth-token');

  if (!token) {
    const msg = 'No token found, authorization denied!';
    logger.warn(msg, { middleware: 'auth' });
    return res.status(401).json({ msg });
  }

  try {
    const decoded = jwt.verify(token, config.get('jwtSecret'));
    req.user = decoded.user;
    next();
  } catch (error) {
    const msg = 'Token is not valid!';
    logger.error(msg, { middleware: 'auth' });
    res.status(401).json({ msg });
  }
};
