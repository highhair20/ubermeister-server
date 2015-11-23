'use strict';
var root = require('./controllers/root.js');
var plugs = require('./controllers/plugs.js');
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

// GET /plugs -> List all the books in JSON.
router.get('/plugs/', plugs.list);

// POST /plugs/ -> JSON data to inserted to the plugs db.
router.post('/plugs/', plugs.create);

// GET /plugs/:id -> Returns the plug for the given ID
router.get('/plugs/:id', plugs.read);

// PUT /plugs/:id -> JSON data to update the book data.
router.put('/plugs/:id', plugs.update);

// DELETE /plugs/:id -> Removes the book with the specified ID.
router.delete('/plugs/:id', plugs.remove);

// use the router
app.use(router.routes());

// Compress the response
app.use(compress());

// listen
app.listen(process.env.PORT || 3000);
