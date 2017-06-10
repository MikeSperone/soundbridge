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
let currentSetting = _setSetting();

const _setSetting = function() {
		let i = Math.floor(Math.random() * 29);
	},
	  _getSetting = function() {
		return currentSetting;
	};


io.on('connection', function(socket){

	console.log('user connected');
	socket.emit('setting', currentSetting);

	setTimeout(function(){
		currentSetting = _setSetting();
		socket.emit('setting', currentSetting);
	}, 60 * 1000 * 30);

	socket.on('data', function(d) {
		socket.broadcast.emit('data', d);	
	});
	socket.on('over', function(d) {
		console.log('over', d);
	});
	socket.on('out', function(d) {
		console.log('out', d);
	});
	socket.on('login', function(d) {
		console.log('login', d);
	});
	socket.on('logout', function(d) {
		console.log('logout', d);
	});



});


