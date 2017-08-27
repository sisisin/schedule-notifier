const isProd = process.env.NODE_ENV === 'production';

const RedisOption = isProd ? {
  port: process.env.REDIS_PORT,
  host: process.env.REDIS_HOST,
  pass: process.env.REDIS_PW,
  ttl: 259200 // sec. 3day expire
} : {
    port: 6379,
    host: 'localhost',
    ttl: 86400 // sec. 1day expire
  };

const callbackPath = '/auth/twitter/callback';
const PassportOption = {
  consumerKey: process.env.SCHEDULE_NOTIFIER_TWITTER_CONSUMER_KEY,
  consumerSecret: process.env.SCHEDULE_NOTIFIER_TWITTER_CONSUMER_SECRET,
  callbackURL: isProd ? `http://localhost:3000${callbackPath}` : `http://localhost:3000${callbackPath}`,
  passReqToCallback: true  
};

const googleCallbackPath = '/auth/google/callback';
const GoogleOption = {
  clientID: process.env.SCHEDULE_NOTIFIER_GOOGLE_CLIENT_ID,
  clientSecret: process.env.SCHEDULE_NOTIFIER_GOOGLE_CLIENT_SECRET,
  callbackURL: isProd ? `http://localhost:3000${googleCallbackPath}` : `http://localhost:3000${googleCallbackPath}`,
  passReqToCallback: true
};
module.exports = { PassportOption, RedisOption, GoogleOption };
