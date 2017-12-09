const express = require('express');
const controllers = require('./controllers').api;

const router = express.Router();


/**
 *  Follwing routes for user registration,user login,
 *  user authentication, token verification, email varification
 *  create user, edit user, delete user, get users
 */

router.post('/user/signin', controllers.auth.login);
router.post('/user/signup', controllers.auth.register);
router.post('/user/login', controllers.auth.login);
router.post('/user/register', controllers.auth.register);
router.post('/user/request', controllers.auth.request_password_reset);
router.post('/user/reset',  controllers.auth.reset_password);
router.post('/user/resend',  controllers.auth.resend_confirmation);
router.post('/user/connect',  controllers.auth.connect);
router.post('/user/confirm',  controllers.auth.confirmation);
router.post('/user/confirm-token',  controllers.auth.confirm_token);



router.get('/users/', controllers.user.index);
router.get('/users/me', controllers.user.me);

router.get('/users/:id', controllers.user.index);
router.post('/users/', controllers.user.create);
router.post('/users/create', controllers.user.create);
router.post('/users/:id', controllers.user.edit);
router.post('/users/update/:id', controllers.user.edit);
router.post('/users/delete/:id', controllers.user.delete);


module.exports = router;