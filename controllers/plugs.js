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
// list all plugs
module.exports.list = function * list(next) {
  if ('GET' != this.method) return yield next;
  var domain = this.request.origin;
  var plugData = yield plugs.find(
    {},
    {
      "sort" : "position"
    });
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
module.exports.create = function * create(next) {
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
      this.throw(400, "The record couldn't be added for an unknown reason.");
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
  if(typeof this.params.id !== undefined) {
    var plug = yield plugs.findById(this.params.id);
    console.log('plug: ', plug);
    if (plug === null) {
      this.throw(404, 'plug with id = ' + this.params.id + ' was not found');
    }
    this.status = 200;
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
    this.throw(400, 'Missing identifier.');
  }
};

//
// update an existing plug
module.exports.update = function * update(next) {
  if ('PUT' != this.method) return yield next;
  var domain = this.request.origin;
  var plug = yield parse(this, {
    limit: '1kb',
    strict: false
  });
  console.log('plug: ', plug);
  try {
    var updated = yield plugs.update(
      { _id: this.params.id },
      { $set:
        {
          position: plug.position,
          mode: plug.mode
        }
      });
    console.log('num rows updated: ' + updated);
    if (!updated) {
      this.throw(404, "Record was not found.");
    }
    this.status = 204; // updated with no response
    this.body = 'Done';
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
//
module.exports.remove = function * remove(next) {
  if ('DELETE' != this.method) return yield next;
  var removed = plugs.remove({ _id: this.params.id });
  this.status = 204;  // No Content - item was deleted
  this.body = "Done";
};
