#!/usr/bin/env nodejs

var config = require('../config/server');
var app = require('express')();
var http = require('http').Server(app);
var io		= require('socket.io')(http);

var path = require('path');
var build_path = path.join(__dirname, config.paths.build);

app.get('/', function(req, res) {
    res.sendFile(build_path + '/index.html');
});

io.on('connection', function(socket){
	console.log('user connected');
});

console.log('connecting...');
http.listen(Number(config.server.port), function() {
	console.log('connected.');
});
