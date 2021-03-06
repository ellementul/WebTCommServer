const express = require('express');

var filesProcess = require('./files_func.js');

var app = express();

app.use(express.json());

app.use(express.static('../client/dist'));

app.post('/files', function(req, res){
	res.append("Content-Security-Policy", "default-src 'self'")
	filesProcess(req.body, resMessage => res.status(200).json(resMessage));
});


app.use(function(err, req, res, next) {

  res.locals.message = err.message;


  res.status(err.status || 500);
  res.json({mess: err});
});

module.exports = app;

//