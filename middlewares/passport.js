const passport = require('passport');
const TwitterStrategy = require('passport-twitter').Strategy;

const config = require('../config');
const db = require('../models');

passport.serializeUser((user, done) => { done(null, user); });
passport.deserializeUser((obj, done) => { done(null, obj); });
passport.use(new TwitterStrategy(config.twitterOption, (req, twitterToken, twitterTokenSecret, profile, done) => {
  db.User.findOrCreate({
    where: { id: profile.id },
    defaults: {
      twitterToken,
      twitterTokenSecret,
      notificationTime: 22,
      mentionTarget: profile.username
    }
  }).then(u => {
    done(null, { id: profile.id });
  }).catch(err => { done(err); });
}));

const GoogleStrategy = require('passport-google-oauth20').Strategy;
passport.use(new GoogleStrategy(config.googleOption,
  (req, accessToken, refreshToken, profile, cb) => {
    db.GoogleCredential.upsert({
      id: profile.id,
      userId: req.session.passport.user.id,
      googleToken: accessToken,
      googleRefreshToken: refreshToken
    }).then(g => {
      cb(null, Object.assign({}, req.session.passport.user, { googleId: profile.id }));
    });
  }
));

module.exports = passport;
