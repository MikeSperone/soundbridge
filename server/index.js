#!/usr/bin/env nodejs

var config = require('../config');
var app = require('express')();
var server = require('http').Server(app);
var io		= require('socket.io')(server);

var path = require('path');
var build_path = path.join(__dirname, config.web_path + config.build);

console.log('connecting...');
server.listen(Number(config.port), function() {
	console.log('connected.');
});

app.get('/', function(req, res) {
    res.sendFile(build_path + '/index.html');
});

/**
*  Setting Numbers
*/
this.currentSetting = 0;
const setCurrentSetting = function() {
		this.currentSetting = Math.floor(Math.random() * 29);
	},
	  getCurrentSetting = function() {
		return this.currentSetting;
	};

let currentSetting = setCurrentSetting();

io.on('connection', function(socket){

	console.log('user connected');
	socket.emit('setting', getCurrentSetting());

	setTimeout(function(){
		currentSetting = setCurrentSetting();
		socket.emit('setting', getCurrentSetting());
	}, 60 * 1000 * 30);

	socket.on('data', function(d) {
		socket.broadcast.emit('data', d);	
	});
	socket.on('over', function(d) {
		socket.broadcast.emit('over', d);
	});
	socket.on('out', function(d) {
		socket.broadcast.emit('out', d);
	});
	socket.on('login', function(d) {
		console.log('login', d);
	});
	socket.on('logout', function(d) {
		console.log('logout', d);
	});

});

