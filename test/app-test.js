var request = require('supertest');
var app = require('../app');

describe('Requests to the root path', function() {
    request(app)
        .get('/')
        .expect(200)
        .end(function(error) {
            if(error) throw error;
            console.log('Done');
        });
});
