'use strict';
require('co-mocha');
var url = require('url');
var should = require('should');
var app = require('../index');
var request = require('co-supertest').agent(app.listen());

// get
describe('Root end point', function() {
  describe('GET /', function() {
    var rootBody;

    //
    it('should have two links', function* (done) {
      rootBody = (yield request
        .get('/')
        .set('Accept', 'application/json')
        .expect(200)
        .expect(function(res) {
          res.body.should.have.property("links");
          res.body.links.length.should.be.equal(3);
        })
      ).body;
      // console.log(rootBody);

      done();
    });

    //
    it('links object should contain self', function* (done) {
      var found = false;
      for (let i in rootBody.links) {
        switch (rootBody.links[i].rel) {
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

    //
    it('links object should contain users', function* (done) {
      var found = false;
      for (let i in rootBody.links) {
        switch (rootBody.links[i].rel) {
          case 'users':
            found = true;
            break;
        }
      }
      if (found == false) {
        throw new Exception('link not found');
      }
      done();
    });

    //
    it('links object should contain controllers', function* (done) {
      var found = false;
      for (let i in rootBody.links) {
        switch (rootBody.links[i].rel) {
          case 'controllers':
            found = true;
            break;
        }
      }
      if (found == false) {
        throw new Exception('link not found');
      }
      done();
    });

    //
    it('Self link body should equal GET / response', function* (done) {
      for (let i in rootBody.links) {
        // console.log(rootBody.links[i]);
        if (rootBody.links[i].rel == 'self') {
          var selfUrl = rootBody.links[i].href;
          // console.log(selfUrl);
          // console.log(url.parse(selfUrl).path);
          yield request
            .get(url.parse(selfUrl).path)
            .expect(function(res) {
              should.deepEqual(res.body, rootBody, 'self body is not equal to GET /');
          });
          // console.log(selfBody);
          break;
        }
      }
      done();
    });

  }); // end describe GET
}); // describe
