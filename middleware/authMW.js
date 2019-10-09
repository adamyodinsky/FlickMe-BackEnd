const jwt = require('jsonwebtoken');
const config = require('../config/config');
const logger = require('../helpers/logger');

const authMW = (req, res, next) => {
//  Get the token from the header
  const token = req.header('x-auth-token');

//  Check if there is no token
  if(!token) {
    logger.info({status: 401, body: 'No token. Authorization denied'});
    return res.status(401).json("No token. Authorization denied");
  }

//  Verify token
  try {
    const decoded = jwt.verify(token, config.jwtToken);
    req.user = decoded.user;
    logger.info('Token Verified');
    next();
  } catch (e) {
    res.status(401).json(e.message);
    logger.error({status: 401, body: e.message});
  }
};

module.exports = { authMW };