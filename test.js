const request = require('supertest');
var app = require('./app');




describe('POST /files', function() {

  it('Get local dicks', function(done) {

    request(app)
     .post('/files')
     .send({
        action: "GetDisks"
     })
     .set('Accept', 'application/json')
     .expect('Content-Type', /json/)
     .expect(function(res){    
        return res.body.every(value => /^[A-Za-z]:$/.test(value));
     })
     .end(done);
  });


  it('Create file', function(done) {

    request(app)
     .post('/files')
     .send({
        action: "Create",
        name: "File",
        path: "./tmp/"
     })
     .set('Accept', 'application/json')
     .expect('Content-Type', /json/)
     .expect({
        action: "Create",
        name: "File",
        path: "./tmp/",
        success: "Ok"
      })
     .end(done);
  });

  it('Update files list', function(done) {

    request(app)
     .post('/files')
     .send({
        action: "ReadDir",
        path: "./tmp/"
     })
     .set('Accept', 'application/json')
     .expect('Content-Type', /json/)
     .expect({
        action: "Update",
        path: "./tmp/",
        content: ["File"]
     })
     .end(done);
  });

  it('Repeat create file', function(done) {

    request(app)
     .post('/files')
     .send({
        action: "Create",
        name: "File",
        path: "./tmp/"
     })
     .set('Accept', 'application/json')
     .expect('Content-Type', /json/)
     .expect({error: "The file already exists"})
     .end(done);
  });

  it('Delete file', function(done) {

    request(app)
     .post('/files')
     .send({
        action: "Delete",
        name: "File",
        path: "./tmp/"
     })
     .set('Accept', 'application/json')
     .expect('Content-Type', /json/)
     .expect({
        action: "Delete",
        name: "File",
        path: "./tmp/",
        success: "Ok"
      })
     .end(done);
  });

  it('Delete dir', function(done) {

    request(app)
     .post('/files')
     .send({
        action: "Delete",
        name: "tmp",
        path: "./"
     })
     .set('Accept', 'application/json')
     .expect('Content-Type', /json/)
     .expect({
        action: "Delete",
        name: "tmp",
        path: "./",
        success: "Ok"
      })
     .end(done);
  });
});