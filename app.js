var express = require('express');
var app = express();

var path = require('path');

var build_path = path.join(__dirname, '../public');
var shared_path = path.join(__dirname, '../shared');

app.use(express.static(build_path));
app.use('/audio', express.static(path.join(shared_path, 'audio')));

app.get('/test', function(req, res) {
    res.status(200)
        .sendFile(path.join(build_path, 'test.html'));
});

app.get('/soundbridge', function(req, res) {
    res.status(200)
        .sendFile(path.join(build_path, 'index.html'));
});


module.exports = app;

