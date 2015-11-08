var koa = require('koa');
var router = require('koa-router')();

var data = require('./plug-data.js');

var app = module.exports = koa();

// OPTIONS / -> Gives the list of allowed request types.
// HEAD / -> HTTP headers only, no body.
// TRACE / -> Blocked for security reasons.
router.get('/', function* () {
  this.body = {
    'links' : [
      'plugs' : this.request.origin + '/plugs'
    ]
  };
});

// GET /plugs -> List all the books in JSON.
// GET /plugs/:id -> Returns the book for the given ID
// POST /plugs/ -> JSON data to inserted to the books db.
// PUT /plugs/:id -> JSON data to update the book data.
// DELETE /plugs/:id -> Removes the book with the specified ID.
router.get('/plugs', function* (){
    this.body = yield data.plugs.get();
});
router.get('/plugs/:id', function* (){
    this.body = yield data.plugs.get();
});

app.use(router.routes());

app.listen(process.env.PORT || 3000);
