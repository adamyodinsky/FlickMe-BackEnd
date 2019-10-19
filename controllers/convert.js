const logger = require('../helpers/logger');
const config = require('../config/config');
const mongoose = require('mongoose');

const convert = async (req, res) => {
    
    try {
        let result = [];
        const collection = await mongoose.connection.db.collection(config.tomatoModelName);
        // let result2 = await collection.find({
        //     year: { $gte: 2005, $lte: 2010 }
        // })
        // .forEach((x) => {
        //     result.push(x.year);
        // })

        // console.log(result);
        result = await collection.find({year: { $gte: 2005, $lte: 2010 }}).forEach( function (x) {
            x.year = parseInt(x.year);
            collection.save(x);
        });
        
        // let sorted = await result.sort();
        // let year = await sorted[0];

        // for(let i=0; i<sorted.length; i++) {
        //     if((year) < sorted[i]) {
        //         console.log(`${year} MISSING`);
        //         i--;
        //     }
        //     year++;
        // }

        res.status(200).json('OK');
    } catch (e) {
        res.status(500).json('ERROR');
        console.log(e.message);
    }
    
}

module.exports = { convert }