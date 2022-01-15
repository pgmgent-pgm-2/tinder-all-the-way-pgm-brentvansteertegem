/*
Import packages
*/
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const nunjucks = require('nunjucks');

/*
Import custopm packages
*/
const publicRoutes = require('./routes');
const apiRoutes = require('./api/routes');

/*
Settings
*/
const NODE_ENV = process.env.NODE_ENV || 'development';
const HOSTNAME = process.env.HOSTNAME || 'localhost';
const PORT = process.env.PORT || 4040; // Port >= 0 and < 65536

/*
Create Express app
*/
const app = express();

/*
View Engine
*/
nunjucks.configure(path.join(__dirname, 'views'), {
  autoescape: true,
  express: app,
  noCache: true,
  watch: true,
});
app.set('view engine', 'html');

/*
bodyParser
*/
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/*
Serving static files
*/
app.use('/static', express.static(path.join(__dirname, 'public')));

/*
Public Routes
*/
app.use('/', publicRoutes);

/*
API Routes
*/
app.use('/api', cors(), apiRoutes);

/*
Not Found routes
*/
app.get('*', (req, res, next) => {
  const err = new Error(
    `${req.ip} tried to access ${req.originalUrl}`,
  );
  err.statusCode = 301;
  next(err);
});

/*
Error Handler
*/
app.use((err, req, res, next) => {
  const error = err;
  error.statusCode = error.statusCode || 500;
  res.status(error.statusCode);

  const body = {
    url: req.url,
    error: {
      message: error.message,
      statusCode: error.statusCode,
    },
  };

  if (req.accepts('html')) {
    res.render('error', body);
  } else if (req.accepts('json')) {
    res.json(body);
  } else {
    res.send('You have to accept application/json or text/html!');
  }
  next();
});

/*
Start the server
Listen to incoming requests
*/
let server;
if (NODE_ENV !== 'test') {
  server = app.listen(PORT, HOSTNAME, (err) => {
    if (err) throw err;
    if (NODE_ENV === 'development') {
      console.log(`Server is listening at http://${HOSTNAME}:${PORT}!`);
    }
  });
}

/*
Handle shutdown gracefully
*/
const handleGracefully = async () => {
  try {
    await server.close(async (err) => {
      if (err) throw err;
      
      if (NODE_ENV === 'development') {
        console.log('Server is gracefully closed!');
      }
      process.exit(0);
    });
  } catch (ex) {
    console.error(ex);
  }
};

/*
Handle close
*/
const handleClose = async () => {
  await server.close();
};

/*
Shutdown the application
*/
process.on('SIGINT', () => {
  handleGracefully();
});

/*
Exports the app for testing
*/
module.exports = {
  app,
  handleClose,
  handleGracefully,
};
