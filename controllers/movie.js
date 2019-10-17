const logger = require('../helpers/logger');
const config = require('../config/config');
const mongoose = require('mongoose');

const getRandomMovie = async(req, res) => {
    
    let from_year = Number(req.query.from_year);
    let to_year = Number(req.query.to_year);
    let from_rank = Number(req.query.from_quality);
    let to_rank = Number(req.query.to_quality);

    if (from_rank === 0) {
      from_rank = 1;
    }

    if ( to_rank < from_rank ) {
      to_rank = from_rank;
    }

    if ( from_year > to_year ) {
      from_year = to_year;
    }
    
    const options = {
      year: {
        $gte: from_year,
        $lte: to_year
      },
      rank: {
        $gte: from_rank,
        $lte: to_rank
      }
    };


    try {
      // get a random index of a movie
      const collection = await mongoose.connection.db.collection(config.tomatoModelName);
      const moviesCount = await collection.countDocuments(options);
      const random = await Math.floor(Math.random() * moviesCount);

      // grab a random movie and send it
      const movie = await collection.find(options).limit(-1).skip(random).next();
      res.status(200).json(movie);
      logger.info({status: 200, body: movie.fullName});
  } catch (e) {
      logger.error(e.message);
      res.status(500).json(e.message);
  }
};


module.exports = { getRandomMovie };