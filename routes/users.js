const routers = require('express').Router();
const userController = require('../controllers/usercontroller');
const passport = require('passport');


routers.get('/sign-up',userController.signUpPage);
routers.get('/sign-in',userController.signInPage);
routers.get('/log-out',userController.destroySession);

routers.post('/sign-in/create-session', passport.authenticate('local', { failureRedirect: '/users/sign-in' }),userController.createSession);
routers.post('/sign-up/create-user',userController.createUser);




module.exports = routers;