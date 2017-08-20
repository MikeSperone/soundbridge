var config = require('./config/config.js');
var express = require('express');
var app = express();

var path = require('path');
var build_path = path.join(__dirname, config.web_path + config.build);

app.set("view engine", "pug");
app.use(express.static("public"));

app.get('/', function(req, res) {
    res.status(200).sendFile(build_path + '/index.html');
});
app.get('/test', function(req, res) {
    res.render('index', {title: "Hey", message: "hello from here" });
});


module.exports = app;

