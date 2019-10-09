const logger = require('../helpers/logger');
const config = require('../config/config');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Users  = require('../models/User');

// @route GET /api/auth
const auth = async (req, res) => {
  try {
    // get user by id from DB without his password
    const user = await User.findById(req.user.id).select('-password');

    res.status(200).json(user);
    logger.info({status: 200, body: user});
  } catch (e) {
    res.status(500).json(e.message);
    logger.error(e.message);
  }
};


// @route POST /api/login
// @desc Authenticate user and get session token
// @access public
const login = async (req, res) => {
  const { password, email } = req.body;

  try {
    // See if user exists
    let user = await Users.findOne({ email });

    if(!user) {
      logger.info(`User with email: ${email} - Not Exists`);
      return res.status(400).json(`invalid Credentials for email: ${email}`);
    }

    // compare encrypted password with decrypted password
    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch) {
      logger.info(`invalid Credentials for email: ${email}`);
      return res.status(401).json(`invalid Credentials for email: ${email}`);
    }

    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
        payload,
        config.jwtToken,
        {expiresIn: config.tokenExpiration },
        (err, token) => {
          if(err) throw err;
          res.status(201).json({ token });
        }
    );

    // await res.json(`User ${email} has been registered successfully`);
  } catch (error) {
    logger.error(error.message);
    await res.status(500).json(error.message);
  }

};
module.exports = { auth , login };