'use strict';
// var views = require('co-views');
var parse = require('co-body');
var monk = require('monk');
var wrap = require('co-monk');
// var db = monk('localhost/powerbank');
var db = monk('ds053164.mongolab.com:53164/heroku_03lb5q27', {
  username : 'admin',
  password : 'foomanchu'
});
var co = require('co');

var plugs = wrap(db.get('plugs'));

// From lifeofjs
co(function * () {
  var plugs = yield plugs.find({});
});

module.exports.home = function * home(next) {
  if ('GET' != this.method) return yield next;
  var domain = this.request.origin;
  this.body = {
    'links' : [{
      'plugs' : domain.concat('/plugs')
    }]
  };
};

module.exports.all = function * all(next) {
  if ('GET' != this.method) return yield next;
  this.body = yield plugs.find({});
};

module.exports.add = function * add(data,next) {
  if ('POST' != this.method) return yield next;
  var plug = yield parse(this, {
    limit: '1kb',
    strict: false
  });
  console.log('position: ', plug.position);
  console.log('mode: ', plug.mode);
  var inserted = yield plugs.insert(plug);
  if (!inserted) {
    this.throw(405, "The plug couldn't be added.");
  }
  this.body = {
    'status': 0
  };
};
