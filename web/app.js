var express = require('express');
var path = require('path');

var cookieParser = require("cookie-parser");
var session = require("express-session");
var {
    // login,
    // logout,
    checkUser,
    checkLoggedIn
} = require('./bin/login');

const dbConfig = require('./config/db');
const apiRoutes = require('./modules');
// const userRoutes = require('./modules/users/user.routes');
// app.use('/api/v1/users', userRoutes);

var debug = console.info;

var app = express();

var build_path = path.join(__dirname, '../public');

app.use(express.json());
app.use(express.urlencoded({ extended: false  }));
app.use(cookieParser());
app.use(express.static(build_path));
app.use("audio", express.static(path.join(build_path, "audio")));

apiRoutes(app);

// set up the session
app.use(
    session({
        secret: "app",
        name: "app",
        resave: true,
        saveUninitialized: true
        // cookie: { maxAge: 6000  } /* 6000 ms? 6 seconds -> wut? :S */
    })
);

// redirect to login form
// app.use("/users", checkLoggedIn, usersRouter);
// app.use("/logout", logout, indexRouter);
// app.use("/login", login, indexRouter);
// app.use("/about", aboutRouter);
// app.use("/", checkLoggedIn, indexRouter);

app.get("/test", function(req, res) {
    res.status(200)
        .sendFile(path.join(build_path, 'test.html'));
});

const login = res => {
    console.info('logging in');
    res.status(200).sendFile(path.join(build_path, 'login.html'));    
}

var checkLoggedIn = function(req, res, next) {
    if (req.session.loggedIn) {
        debug(
            "checkLoggedIn(), req.session.loggedIn:",
            req.session.loggedIn,
            "executing next()"
        );
        next();

    } else {
        debug(
            "checkLoggedIn(), req.session.loggedIn:",
            req.session.loggedIn,
            "rendering login"
        );
        login(res);
    }

};
app.get('/', checkLoggedIn, function(req, res) {
    res.status(200)
        .sendFile(path.join(build_path, 'soundbridge.html'));
});

app.get("/login", function(req, res) {
    login(res);
});

module.exports = app;

