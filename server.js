const Nuxt = require('nuxt');
const bodyParser = require('body-parser');
const session = require('express-session');
const express = require('express');
const path = require('path');
const app = express();

const conf = require('./config');

app.use(bodyParser.json());
app.use(session({
  secret: 'super-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 60000 }
}));

/* eslint-disable no-console */

const apiRoutes = require('./server/routes/apiRoutes.js');

app.use(express.static(path.join( __dirname, './assets')));
app.use('/api', apiRoutes);

const isProd = process.env.NODE_ENV === 'production';

let config = require('./nuxt.config.js');
config.dev = !isProd;

const nuxt = new Nuxt(config);
const promise = (isProd ? Promise.resolve() : nuxt.build());

promise.then(() => {
  app.use(nuxt.render);
  app.listen(3000);
  console.log('Server is listening on http://localhost:3000');
})
.catch((error) => {
  console.error(error);
  process.exit(1);
});
