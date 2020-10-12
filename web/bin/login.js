var debug = console.info;
var logout = function(req, res, next) {
    debug("logout()");
    req.session.loggedIn = false;
    res.redirect("/");

};

var login = function(req, res, next) {
    var { username, password  } = req.body;
    if (req.body.username && checkUser(username, password)) {
        debug("login()", username, password);
        req.session.loggedIn = true;
        res.redirect("/");

    } else {
        debug("login()", "Wrong credentials");
        res.render("login", { title: "Login Here", error: "Wrong credentials"  });

    }

};

var checkUser = function(username, password) {
    debug("checkUser()", username, password);
    if (username === "admin" && password === "admin") return true;
    return false;

};

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
        res.render("login", { title: "Login Here"  });
    }

};

module.exports = {
    login,
    logout,
    checkUser,
    checkLoggedIn
};
