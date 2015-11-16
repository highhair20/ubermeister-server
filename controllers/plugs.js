'use strict';
// var views = require('co-views');
var parse = require('co-body');
var monk = require('monk');
var wrap = require('co-monk');
var co = require('co');

var db = monk('admin:foomanchu@ds053164.mongolab.com:53164/heroku_03lb5q27');
var plugs = wrap(db.get('plugs'));

// From lifeofjs
co(function * () {
  var plugs = yield plugs.find({});
});

//
//
module.exports.registerId = function * registerId(id, next) {
 this.id = id;
 yield next;
}

//
//
module.exports.home = function * home(next) {
  if ('GET' != this.method) return yield next;
  var domain = this.request.origin;
  this.body = {
    'links' : [
      {
        'rel' : 'self',
        'href' : domain
      },
      {
        'rel' : 'list',
        'href' : domain.concat('/plugs')
      }
    ]
  };
};

//
// list all plugs
module.exports.list = function * list(next) {
  if ('GET' != this.method) return yield next;
  var domain = this.request.origin;
  var plugData = yield plugs.find({});
  for (var i = 0; i < plugData.length; i++) {
    plugData[i].links = [
      {
        'rel' : 'self',
        'href' : domain.concat('/plugs/').concat(plugData[i]._id.toString())
      }
    ]
  }
  this.body = {
    'links' : [
      {
        'rel' : 'self',
        'href' : domain.concat('/plugs')
      }
    ],
    'content' : plugData
  };
};

//
// create a new plug
module.exports.create = function * create(data,next) {
  if ('POST' != this.method) return yield next;
  var domain = this.request.origin;
  var plug = yield parse(this, {
    limit: '1kb',
    strict: false
  });
  console.log('position: ', plug.position);
  console.log('mode: ', plug.mode);
  var allowedPositions = [1,2,3,4,5,6,7,8];
  console.log(allowedPositions.indexOf(plug.position));
  if (allowedPositions.indexOf(plug.position) == -1) {
    this.throw('The record count not be added. Position ' + plug.position + ' is not allowed', 405);
  }
  try {
    var inserted = yield plugs.insert(plug);
    if (!inserted) {
      this.throw(405, "The record couldn't be added.");
    }
    console.log('created new record: ' + inserted._id);
    this.status = 201; // created
    this.body = {
      'links' :[
        {
          'rel' : 'self',
          'href' : domain.concat('/plugs/').concat(inserted._id)
        },
        {
          'rel' : 'list',
          'href' : domain.concat('/plugs')
        }
      ],
      'content' : {
        _id : inserted._id
      }
    };
  } catch (err) {
    var httpStatus, errType, errCode, errMessage;
    for (let prop in err) {
      switch (prop) {
        case 'code':
          errCode = err[prop];
          break;
        case 'err':
          errMessage = err[prop];
          break;
        default:
          errType = err[prop];
          break;
      }
    }
    if (errCode == 11000) {
      // MongoError, E11000, heroku_03lb5q27.plugs.$position
      this.status = 409;  // conflict
      this.body = 'Unable to create new plug data.  A plug already exists for position: ' + plug.position.toString();
    } else if (typeof errMessage !== 'undefined') {
      this.status = 500;
      this.body = errMessage.toString();
    }
    //delegate the error back to application
    this.app.emit('error', err, this);
  }
};

//
// get the details of a specific plug
module.exports.read = function * read(next) {
  if ('GET' != this.method) return yield next;
  var domain = this.request.origin;
  if(typeof this.id !== undefined) {
    var plug = yield plugs.findById(this.id);
    console.log('plug: ', plug);
    if (plug === null) {
      this.throw(404, 'plug with id = ' + this.id + ' was not found');
    }
    this.body = {
      'links' :[
        {
          'rel' : 'self',
          'href' : domain.concat('/plugs/').concat(plug._id)
        },
        {
          'rel' : 'list',
          'href' : domain.concat('/plugs')
        }
      ],
      'content' : plug
    };
  } else {
    this.throw(404, 'unable to process request');
  }
};

//
// update an existing plug
module.exports.update = function * update(data,next) {
  if ('PUT' != this.method) return yield next;
  var domain = this.request.origin;
  var plug = yield parse(this, {
    limit: '1kb',
    strict: false
  });
  console.log('plug: ', plug);
  try {
    var updated = yield plugs.update(
      { _id: this.id },
      { $set:
        {
          position: plug.position,
          mode: plug.mode
        }
      });
    console.log('num rows updated: ' + updated);
    if (!updated) {
      this.throw(405, "The record couldn't be updated.");
    }
    this.status = 201; // updated
    this.body = {
      'links' :[
        {
          'rel' : 'self',
          'href' : domain.concat('/plugs/').concat(this.id)
        },
        {
          'rel' : 'list',
          'href' : domain.concat('/plugs')
        }
      ]
    };
  } catch (err) {
    console.log(err);
  }
};

//
//
// module.exports.delete = function * delete(id,next) {
//   if ('DELETE' != this.method) return yield next;
//
//   // var book = yield books.find({}, {
//   //   'skip': id - 1,
//   //   'limit': 1
//   // });
//   //
//   // if (book.length === 0) {
//   //   this.throw(404, 'book with id = ' + id + ' was not found');
//   // }
//   //
//   // var removed = books.remove(book[0]);
//   //
//   // if (!removed) {
//   //   this.throw(405, "Unable to delete.");
//   // } else {
//   //   this.body = "Done";
//   // }
//   this.body = {
//     'status': 0
//   };
// };
