const { body, query, validationResult } = require('express-validator');
const logger = require('../helpers/logger');
const config = require('../config/config');

const validationRules = (method) => {
  switch (method) {
    case 'login': return  [
          body('email', 'Please include a valid email').isEmail(),
          body('password', 'Please enter a password').not().isEmpty()
      ];
    case 'users':
      return [
          body('name', 'Name is required').not().isEmpty(),
          body('email', 'Please include a valid email').isEmail(),
          body('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
      ];
    case 'scrapeMoviesByYears':
      return [
          body('collection', 'collection is required').isString(),
          body('range.start', 'range.start is required').isString(),
          body('range.end', 'range.end is required').isString()
      ];
    case 'getMovie':
      return [
        query('start', 'start is not valid').isInt({ gt: config.yearMin - 1 }),
        query('end', 'end is not valid').isInt({ lt: config.yearMax + 1 })
      ];
  }
};


const validate = (req, res, next) => {
  // validate
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  // make an array of errors messages
  const extractedErrors = [];
  errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }));


  logger.error(extractedErrors);

  return res.status(422).json({
    errors: extractedErrors,
  })
};


module.exports = {
  validationRules,
  validate,
};

