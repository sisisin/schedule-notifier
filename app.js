const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const passport = require('passport');
const TwitterStrategy = require('passport-twitter').Strategy;

const config = require('./config');
const redisStore = new RedisStore(config.RedisOption);
const db = require('./models');

passport.serializeUser((user, done) => { done(null, user); });
passport.deserializeUser((obj, done) => { done(null, obj); });
passport.use(new TwitterStrategy(config.PassportOption, (req, twitterToken, twitterTokenSecret, profile, done) => {
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
passport.use(new GoogleStrategy(config.GoogleOption,
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


const index = require('./routes/index');
const user = require('./routes/user');
const auth = require('./routes/auth');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  store: redisStore,
  secret: 'schedule-notifier',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', auth);
app.use('/', (req, res, next) => {
  if (!req.user) { return res.redirect('/auth'); }
  next();
}, index);
app.use('/user', user);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
