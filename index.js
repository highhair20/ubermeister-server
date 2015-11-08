var koa = require('koa');
var router = require('koa-router')();

var data = require('./device-data.js');

var app = module.exports = koa();

// GET /books -> List all the books in JSON.
// GET /books/:id -> Returns the book for the given ID
// POST /books/ -> JSON data to inserted to the books db.
// PUT /books/:id -> JSON data to update the book data.
// DELETE /books/:id -> Removes the book with the specified ID.
// OPTIONS / -> Gives the list of allowed request types.
// HEAD / -> HTTP headers only, no body.
// TRACE / -> Blocked for security reasons.
router.get('/devices', function* (){
    this.body = yield data.devices.get();
});
router.get('/devices/:id', function* (){
    this.body = yield data.devices.get();
});

app.use(router.routes());

app.listen(process.env.PORT || 3000);
