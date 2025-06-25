const passport = require('passport');
const LocalStrategy = require('passport-local');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const bcrypt = require('bcrypt');

const User = require('../models/user.model');
const config = require('./config');

const localLogin = new LocalStrategy(
  {
    usernameField: 'email',
  },
  async (email, password, done) => {
    let user = await User.findOne({ email });
    if (
      !user ||
      (!!user.hashedPassword &&
        !bcrypt.compareSync(password, user.hashedPassword))
    ) {
      return done(null, false, {
        error:
          'Su usuario y contraseña no pudieron verificarse. Por favor intente nuevamente.',
      });
    }
    if (!user.hashedPassword) {
      await User.updateOne(
        { email },
        { hashedPassword: bcrypt.hashSync(password, 10) }
      );
    }
    user = user.toObject();
    delete user.hashedPassword;
    done(null, user);
  }
);

const jwtLogin = new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.jwtSecret,
  },
  async (payload, done) => {
    let user = await User.findById(payload._id);
    if (!user) {
      return done(null, false);
    }
    user = user.toObject();
    delete user.hashedPassword;
    done(null, user);
  }
);

passport.use(jwtLogin);
passport.use(localLogin);

module.exports = passport;
