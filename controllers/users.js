'use strict';
var parse = require('co-body');
var monk = require('monk');
var wrap = require('co-monk');
var co = require('co');
var validate = require('validate.js');

var db = monk('admin:foomanchu@ds053164.mongolab.com:53164/heroku_03lb5q27');
var users = wrap(db.get('users'));

// From lifeofjs
co(function * () {
  var users = yield users.find({});
});

//
// list all
module.exports.list = function* list(next) {
  if ('GET' != this.method) return yield next;
  var domain = this.request.origin;
  var userData = yield users.find(
    {},
    {
      "sort" : "username"
    });
  for (var i = 0; i < userData.length; i++) {
    userData[i].links = [
      {
        'rel' : 'self',
        'href' : domain.concat('/users/').concat(userData[i]._id.toString())
      }
    ]
  }
  this.body = {
    'links' : [
      {
        'rel' : 'self',
        'href' : domain.concat('/users')
      }
    ],
    'content' : userData
  };
};

//
// create a new plug
module.exports.create = function* create(next) {
  if ('POST' != this.method) return yield next;
  var domain = this.request.origin;
  var payload = yield parse(this, {
    limit: '1kb',
    strict: false
  });
  // console.log(payload);

  var constraints = {
    username: {
      presence: { message: "cannot be blank" }
    },
    password : {
      presence: { message: "cannot be blank" }
    }
  };
  var res = validate(payload, constraints);
  if (typeof res != "undefined") {
    // console.log('validate: ' + res);
    this.body = res;
    return;
  }

  try {
    var inserted = yield users.insert(payload);
    if (!inserted) {
      this.throw(400, "The record couldn't be added for an unknown reason.");
    }
    // console.log('created new record: ' + inserted._id);
    this.status = 201; // created
    this.body = {
      'links' :[
        {
          'rel' : 'self',
          'href' : domain.concat('/users/').concat(payload.username)
        },
        {
          'rel' : 'list',
          'href' : domain.concat('/users')
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
      this.status = 409;  // conflict
      this.body = 'Unable to create new user.  Username ' + payload.username + ' already exists';
    } else if (typeof errMessage !== 'undefined') {
      this.status = 500;
      this.body = errMessage.toString();
    } else {
      //delegate the error back to application
      this.app.emit('error', err, this);
    }
  }
};

//
// get the details of a specific record
module.exports.read = function* read(next) {
  if ('GET' != this.method) return yield next;
  var domain = this.request.origin;
  if(typeof this.params.id !== undefined) {
    var user = yield users.findOne({ username : this.params.id});
    console.log('user: ', user);
    if (user === null) {
      this.throw(404, 'user with id = ' + this.params.id + ' was not found');
    }
    this.status = 200;
    this.body = {
      'links' :[
        {
          'rel' : 'self',
          'href' : domain.concat('/user/').concat(user._id)
        },
        {
          'rel' : 'list',
          'href' : domain.concat('/user')
        }
      ],
      'content' : user
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
  var payload = yield parse(this, {
    limit: '1kb',
    strict: false
  });
  // console.log('payload: ', payload);
  var updated = yield users.update(
    { username: this.params.id },
    { $set:
      {
        password: payload.password
      }
    });
  // console.log('num rows updated: ' + updated);
  if (!updated) {
    this.throw(404, "Record was not found.");
  }
  this.status = 204; // updated with no response
  this.body = 'Done';
};

//
//
module.exports.remove = function * remove(next) {
  if ('DELETE' != this.method) return yield next;
  var removed = users.remove({ username: this.params.id });
  this.status = 204;  // No Content - item was deleted successfully
  this.body = "Done";
};
