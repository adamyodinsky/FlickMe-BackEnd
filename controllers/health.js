const request = require('request-promise-native');
const logger = require('../helpers/logger');
const config = require('../config/config');

const health = async (req, res) => {
  const options = {
      method: 'GET',
      uri: `http://${config.scraperHost}:${config.scraperPort}/${config.scraperApi}/health`,
      json: true,
      resolveWithFullResponse: true
  };

  try {
    const response = await request(options);
    res.status(response.statusCode).json('OK');
    logger.info({Scraper: response.body, 'Back-End': 'OK'});
  } catch (e) {
    res.status(200).json('OK');
    logger.error({Scraper: e.message, 'Back-End': 'OK'});
  }

};

module.exports = { health };