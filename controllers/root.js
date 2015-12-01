'use strict';

//
//
module.exports.home = function * home(next) {
  if ('GET' != this.method) return yield next;
  var domain = this.request.origin;
  this.body = {
    'links' : [
      {
        'rel' : 'self',
        'href' : domain.concat('/')
      },
      {
        'rel' : 'users',
        'href' : domain.concat('/users')
      },
      {
        'rel' : 'controllers',
        'href' : domain.concat('/controllers')
      }
    ]
  };
};
