'use strict';
require('co-mocha');
var url = require('url');
var should = require('should');
var app = require('../index');
var request = require('co-supertest').agent(app.listen());

// get
describe('Users end point', function() {
  describe('GET /users', function() {
    var body;

    //
    it('should have content', function* (done) {
      body = (yield request
        .get('/users')
        .set('Accept', 'application/json')
        .expect(200)
        .expect(function(res) {
          res.body.should.have.property("links");
          res.body.links.length.should.be.equal(1);
        })
      ).body;
      // console.log("GET response: ", body);
      done();
    });

    //
    it('links object should contain self', function* (done) {
      var found = false;
      for (let i in body.links) {
        switch (body.links[i].rel) {
          case 'self':
            found = true;
            break;
        }
      }
      if (found == false) {
        throw new Exception('link not found');
      }
      done();
    });

  }); // end describe GET

  // create a user
  describe('POST /users', function() {
    var newUsername = 'highhair2000';
    var newPassword = 'foomanchu';
    var numUsers;

    it('should have content', function* (done) {
      var body = (yield request
        .get('/users')
        .set('Accept', 'application/json')
        .expect(200)
      ).body;
      body.should.have.property("links");
      body.links.length.should.be.equal(1);
      numUsers = body.content.length;
      console.log("body before create: ", body);
      console.log("num users before create: ", numUsers);
      done();
    });

    it('should be able to create user', function* (done) {
      var body = (yield request
        .post('/users')
        .set('Accept', 'application/json')
        .send({
          'username' : newUsername,
          'password' : newPassword
        })
        .expect(201)
      ).body;
      console.log('response to create: ', body);
      done();
    });

    it('should have incremented user count', function* (done) {
      var body = (yield request
        .get('/users')
        .set('Accept', 'application/json')
        .expect(200)
      ).body;
      console.log('post create body: ', body);
      body.content.length.should.be.equal(numUsers+1);
      numUsers = body.content.length;
      done();
    });

    it('should indicate duplicate users', function* (done) {
      yield request
        .post('/users')
        .set('Accept', 'application/json')
        .send({
          'username' : newUsername,
          'password' : newPassword
        })
        .expect(409);
      done();
    });

    it('should indicate un and pw match new record', function* (done) {
      var body = (yield request
        .get('/users/'.concat(newUsername))
        .set('Accept', 'application/json')
        .expect(200)
      ).body;
      body.content.username.should.be.equal(newUsername);
      body.content.password.should.be.equal(newPassword);
      done();
    })

    it('should be able to update user', function* (done) {
      yield request
        .put('/users/'.concat(newUsername))
        .set('Accept', 'application/json')
        .send({
          'username' : 'highhair2001',
          'password' : 'foobar'
        })
        .expect(204);

      var body = (yield request
        .get('/users/'.concat(newUsername))
        .set('Accept', 'application/json')
        .expect(200)
      ).body;
      console.log(body);
      body.content.username.should.be.equal('highhair2000');
      body.content.password.should.be.equal('foobar');

      done();
    });

    it('should delete user', function* (done) {
      yield request
        .delete('/users/'.concat(newUsername))
        .set('Accept', 'application/json')
        .expect(204);
      done();
    });

    it('should have deremented user count', function* (done) {
      var body = (yield request
        .get('/users')
        .set('Accept', 'application/json')
        .expect(200)
      ).body;
      console.log('post create body: ', body);
      body.content.length.should.be.equal(numUsers-1);
      done();
    });

  }); // end describe POST

}); // describe
