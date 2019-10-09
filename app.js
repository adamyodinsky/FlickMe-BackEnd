process.env.BASE_DIR_NAME = __dirname;
const config  = require('./config/config');
const express = require('express');
const router = require('./routes/router')();
const logger  = require('./helpers/logger');
const connectDB = require('./config/db');
const syntaxErr = require('./middleware/syntaxErr');
const cors = require('cors');
const corsOptions = require('./config/corsConfig');


const app = express();
connectDB();

//init Middleware
app.use(cors(corsOptions));
app.use(express.json({extended: true}));
app.use(syntaxErr);
app.use('/v1', router);


app.listen(config.appPort, ()=> {
    logger.info(`Server running on ${config.appHost}:${config.appPort}`);
});

