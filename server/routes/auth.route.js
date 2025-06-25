const express = require('express');
const asyncHandler = require('express-async-handler');
const passport = require('passport');
const userCtrl = require('../controllers/user.controller');
const authCtrl = require('../controllers/auth.controller');
const registrationReqCtrl = require('../controllers/registration-req.controller');

const config = require('../config/config');

const router = express.Router();
module.exports = router;

router.post('/register', asyncHandler(register), login);
router.post(
  '/login',
  passport.authenticate('local', { session: false }),
  login
);
router.get('/me', passport.authenticate('jwt', { session: false }), login);
router.post('/checkUser', asyncHandler(checkUser));
router.post('/addRegistrationReq', asyncHandler(addRegistrationReq));

async function register(req, res, next) {
  let user = await userCtrl.insert(req.body);
  user = user.toObject();
  delete user.hashedPassword;
  req.user = user;
  next();
}

function login(req, res) {
  let user = req.user;
  let token = authCtrl.generateToken(user);
  res.json({ user, token });
}

async function checkUser(req, res) {
  let userInfo = await userCtrl.checkUser(req.body.email);
  res.json(userInfo);
}

async function addRegistrationReq(req, res) {
  let registrationReq = await registrationReqCtrl.save(req.body);
  res.json(registrationReq);
}
