const express = require('express');
const { createUser } = require("../controllers/users");
const { scrapeMovieByYears } = require('../controllers/scrapeMoviesByYears');
const { validate , validationRules } = require('../middleware/validation');
const { health } = require('../controllers/health');
const { auth , login } = require('../controllers/auth');
const { authMW } = require('../middleware/authMW');
const { getRandomMovie } = require('../controllers/movie');
const { convert } = require('../controllers/convert');

const routes = () => {
    const router = express.Router();

    //  Users and Authentication
    router.get('/health', health);
    // router.get('/convert', convert);
    router.get('/auth',authMW, auth);
    router.post('/auth', validationRules('login'), validate, login);
    router.post('/users', validationRules('users'), validate ,createUser);

    // Movies
    router.get('/movie', validationRules('getMovie'), validate, getRandomMovie);
    router.post('/scrapeMoviesByYears', authMW, validationRules('scrapeMoviesByYears'), validate, scrapeMovieByYears);

return router;
};

module.exports = routes;