'use strict';

const express = require('express');
// authRouter
const notFoundHandler = require('./error-handlers/404.js');
const errorHandler = require('./error-handlers/500.js');
const logger = require('./middleware/logger.js');
const v1Routes = require('./routes/v1.js');
const app = express();
app.use(logger);
const cors = require('cors');
const morgan = require('morgan');
// server
// Esoteric Resources
const authRoutes = require('./routes/routes.js');

const notFound = require('./error-handlers/404.js');


// const authRouter = express.Router();

// Prepare the express app

// App Level MW
app.use(cors());
app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use('/api/v1', v1Routes);

app.use(authRoutes);
app.use('*', notFoundHandler);
app.use(errorHandler);



// Routes

// Catchalls
app.use(notFound);
// app.use(errorHandler);



module.exports = {
  app: app,
  start: port => {
    if (!port) { throw new Error('Missing Port'); }
    app.listen(port, () => console.log(`Listening on ${port}`));
  },
};
