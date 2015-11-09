'use strict';
var plugs = require('./controllers/plugs.js');
var compress = require('koa-compress');
var logger = require('koa-logger');
var koa = require('koa');
var route = require('koa-route');
var app = module.exports = koa();

// Logger
app.use(logger());

// GET / -> List all links available.
// OPTIONS / -> Gives the list of allowed request types.
// HEAD / -> HTTP headers only, no body.
// TRACE / -> Blocked for security reasons.
app.use(route.get('/', plugs.home));

// GET /plugs -> List all the books in JSON.
app.use(route.get('/plugs/', plugs.all));

// POST /plugs/ -> JSON data to inserted to the books db.
app.use(route.post('/plugs/', plugs.add));

// GET /plugs/:id -> Returns the book for the given ID

// PUT /plugs/:id -> JSON data to update the book data.
// DELETE /plugs/:id -> Removes the book with the specified ID.



// router.get('/plugs', function* (){
//     this.body = yield data.plugs.get();
// });
// router.get('/plugs/:id', function* (){
//     this.body = yield data.plugs.get();
// });
// app.use(router.routes());

// Compress
app.use(compress());

// listen
app.listen(process.env.PORT || 3000);
