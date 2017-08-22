var config = require('./config/config.js');
var express = require('express');
var app = express();

var path = require('path');
var build_path = path.join(__dirname, config.build);

app.use(express.static("public"));
app.use("/test", express.static("test"));

app.get('/', function(req, res) {
    res.status(200).sendFile(path.join(__dirname,  config.build + '/index.html'));
});

app.use("audio", express.static("public/audio"));

module.exports = app;

