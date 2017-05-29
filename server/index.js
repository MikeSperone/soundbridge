#!/usr/bin/env nodejs

var express = require('express');
var app = express();
var path = require('path');

var build_path = path.join(__dirname, '/build');

app.get('/', function(req, res) {
    res.sendFile(build_path + '/index.html');
});
console.log(build_path);
app.listen(8000);
