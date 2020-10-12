const Router = require('express').Router;
const userController = require('./user.controllers');

const routes = new Router();
routes.post('/signup', userController.signUp);
module.exports = routes;
