#!/usr/bin/env nodejs

var config = require('../config');
var app = require('express')();
var http = require('http').Server(app);
var io		= require('socket.io')(http);

var path = require('path');
var build_path = path.join(__dirname, config.web_path + config.build);

app.get('/', function(req, res) {
    res.sendFile(build_path + '/index.html');
});

io.on('connection', function(socket){
	console.log('user connected');

	io.on('data', function(d) {
		console.log('data', d);
	}
	io.on('over', function(d) {
		console.log('over', d);
	}
	io.on('out', function(d) {
		console.log('out', d);
	}
	io.on('login', function(d) {
		console.log('login', d);
	}
	io.on('logout', function(d) {
		console.log('logout', d);
	}



});

console.log('connecting...');
http.listen(Number(config.port), function() {
	console.log('connected.');
});

