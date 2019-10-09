const logger  = require('../helpers/logger');
const Users = require('../models/User');
const gravatar = require('gravatar');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

const user = async (req, res) => {
    const { name, password, email } = req.body;

    try {
        // See if user exists
        let user = await Users.findOne({ email });

        if(user) {
            logger.info(`User ${email} already exists`);
            return res.status(400).json({errors: [{msg: `User ${email} already exists`}]});
        }

        // Get users gravatar
        const avatar = gravatar.url(email, {
            s: '200', // default size
            r: 'pg',  // rate
            d: 'mm'   // default image
        });

        // Create a user
        user = new Users({name, email, avatar, password});

        // Encrypt password - bcrypt
        const salt = await bcrypt.genSalt(10);

        user.password = await bcrypt.hash(password, salt);

        // save user to data base
        await user.save();

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

module.exports  = { createUser: user };