const request = require('supertest');
const app = require('./app');


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

  it('Create Dir', function(done) {

    request(app)
     .post('/files')
     .send({
        action: "CreateDir",
        name: "tmp",
        path: "./"
     })
     .set('Accept', 'application/json')
     .expect('Content-Type', /json/)
     .expect({
        action: "CreateDir",
        name: "tmp",
        path: "./",
        success: "Ok"
      })
     .end(done);
  });


  it('Create file', function(done) {

    request(app)
     .post('/files')
     .send({
        action: "CreateFile",
        name: "File",
        path: "./tmp/"
     })
     .set('Accept', 'application/json')
     .expect('Content-Type', /json/)
     .expect({
        action: "CreateFile",
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
        content: [{
            name: "File",
            isDir: false,
            size: 0
        }]
     })
     .end(done);
  });

  it('Copy file', function(done) {

    request(app)
     .post('/files')
     .send({
        action: "Copy",
        name: "File",
        source_path: "./tmp/",
        target_path: "./tmp2"
     })
     .set('Accept', 'application/json')
     .expect('Content-Type', /json/)
     .expect({
        action: "Copy",
        name: "File",
        source_path: "./tmp/",
        target_path: "./tmp2",
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
        content: [{
            name: "File",
            isDir: false,
            size: 0
        }]
     })
     .end(done);
  });

  it('Create Dir', function(done) {

    request(app)
     .post('/files')
     .send({
        action: "CreateDir",
        name: "tmp",
        path: "./tmp2/"
     })
     .set('Accept', 'application/json')
     .expect('Content-Type', /json/)
     .expect({
        action: "CreateDir",
        name: "tmp",
        path: "./tmp2/",
        success: "Ok"
      })
     .end(done);
  });

  it('Update files list', function(done) {

    request(app)
     .post('/files')
     .send({
        action: "ReadDir",
        path: "./tmp2/"
     })
     .set('Accept', 'application/json')
     .expect('Content-Type', /json/)
     .expect({
        action: "Update",
        path: "./tmp2/",
        content: [{
            name: "File",
            isDir: false,
            size: 0
        },
        {
            name: "tmp",
            isDir: true,
            size: 0
        }]
     })
     .end(done);
  });

  it('Delete file', function(done) {

    request(app)
     .post('/files')
     .send({
        action: "Delete",
        name: "File",
        path: "./tmp2/"
     })
     .set('Accept', 'application/json')
     .expect('Content-Type', /json/)
     .expect({
        action: "Delete",
        name: "File",
        path: "./tmp2/",
        success: "Ok"
      })
     .end(done);
  });

  it('Move file', function(done) {

    request(app)
     .post('/files')
     .send({
        action: "Move",
        name: "File",
        source_path: "./tmp/",
        target_path: "./tmp2"
     })
     .set('Accept', 'application/json')
     .expect('Content-Type', /json/)
     .expect({
        action: "Move",
        name: "File",
        source_path: "./tmp/",
        target_path: "./tmp2",
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
        content: []
     })
     .end(done);
  });

  

  it('Update files list', function(done) {

    request(app)
     .post('/files')
     .send({
        action: "ReadDir",
        path: "./tmp2/"
     })
     .set('Accept', 'application/json')
     .expect('Content-Type', /json/)
     .expect({
        action: "Update",
        path: "./tmp2/",
        content: [{
            name: "File",
            isDir: false,
            size: 0
        },
        {
            name: "tmp",
            isDir: true,
            size: 0
        }]
     })
     .end(done);
  });

  it('Delete dir', function(done) {

    request(app)
     .post('/files')
     .send({
        action: "Delete",
        name: "tmp2",
        path: "./"
     })
     .set('Accept', 'application/json')
     .expect('Content-Type', /json/)
     .expect({
        action: "Delete",
        name: "tmp2",
        path: "./",
        success: "Ok"
      })
     .end(done);
  });
  
});