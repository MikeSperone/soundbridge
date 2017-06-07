#!/usr/bin/env node

var config = require('../config');
var app = require('express')();
var http = require('http').Server(app);
var io		= require('socket.io')(http);

var path = require('path');
var build_path = path.join(__dirname, config.server.build);

app.get('/', function(req, res) {
    res.sendFile(build_path + '/index.html');
});

if (config.dev) {
	// if dev, then serve assets
	app.get('/css', function(req, res) {
		console.log('css: ', req);
		//res.sendFile(build_path + )
	});
}

io.on('connection', function(socket){
	console.log('user connected');

	io.on('login', function(d) {
		console.log('login', d);
	});
	io.on('logout', function(d) {
		console.log('logout', d);
	});

	io.on('data', function(d) {
		console.log('data', d);
	});
	io.on('out', function(d) {
		console.log('out', d);
	});
	io.on('over', function(d) {
		console.log('over', d);
	});

});

console.log('connecting...');
http.listen(Number(config.port), function() {
	console.log('connected.');
});
