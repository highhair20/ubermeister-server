'use strict';

var root = require('./controllers/root.js');
var users = require('./controllers/users.js');
var controllers = require('./controllers/controllers.js');
var stations = require('./controllers/stations.js');

var compress = require('koa-compress');
var logger = require('koa-logger');
var koa = require('koa');
var router = require('koa-router')();
var app = module.exports = koa();

// Logger
app.use(logger());

// error handling
app.use(function *(next) {
  try {
    yield next;
  } catch (err) {
    this.status = err.status || 500;
    this.body = err.message;
    this.app.emit('error', err, this);
  }
});

// GET / -> List all links available.
router.get('/', root.home);

// GET /users -> list all users
router.get('/users/', users.list);
router.post('/users/', users.create);
router.get('/users/:id', users.read);
router.put('/users/:id', users.update);
router.delete('/users/:id', users.remove);

// controllers
router.get('/users/:username/controllers/', controllers.list);
router.post('/users/:username/controllers/', controllers.create);
router.get('/users/:username/controllers/:id', controllers.read);
router.put('/users/:username/controllers/:id', controllers.update);
router.delete('/users/:username/controllers/:id', controllers.remove);

// GET /stations -> List all the stations in JSON.
router.get('/users/:username/controllers/:controller_id/stations/', stations.list);
// POST /stations/ -> JSON data to inserted to the stations document.
router.post('/users/:username/controllers/:controller_id/stations/', stations.create);
// GET /stations/:id -> Returns the stations for the given ID
router.get('/users/:username/controllers/:controller_id/stations/:id', stations.read);
// PUT /stations/:id -> JSON data to update the stations data.
router.put('/users/:username/controllers/:controller_id/stations/:id', stations.update);
// DELETE /stations/:id -> Removes the stations with the specified ID.
router.delete('/users/:username/controllers/:controller_id/stations/:id', stations.remove);

// use the router
app.use(router.routes());

// Compress the response
app.use(compress());

// listen
app.listen(process.env.PORT || 3000);
