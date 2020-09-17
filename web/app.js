var express = require('express');
var app = express();

var path = require('path');

var build_path = path.join(__dirname, '../public');

app.use(express.static(build_path));
app.use("audio", express.static(path.join(build_path, "audio")));

app.get("/test", function(req, res) {
    res.status(200)
        .sendFile(path.join(build_path, 'test.html'));
});

app.get('/', function(req, res) {
    res.status(200)
        .sendFile(path.join(build_path, 'index.html'));
});


module.exports = app;

