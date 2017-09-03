const isProd = process.env.NODE_ENV === 'production';

const redisOption = isProd ? {
  url: process.env.REDIS_URL,
  ttl: 259200 // sec. 3day expire
} : {
    ttl: 86400 // sec. 1day expire
  };

const callbackPath = '/auth/twitter/callback';
const twitterOption = {
  consumerKey: process.env.SCHEDULE_NOTIFIER_TWITTER_CONSUMER_KEY,
  consumerSecret: process.env.SCHEDULE_NOTIFIER_TWITTER_CONSUMER_SECRET,
  callbackURL: isProd ? `https://schedule-notifier.herokuapp.com${callbackPath}` : `http://localhost:3000${callbackPath}`,
  passReqToCallback: true  
};

const googleCallbackPath = '/auth/google/callback';
const GoogleOption = {
  clientID: process.env.SCHEDULE_NOTIFIER_GOOGLE_CLIENT_ID,
  clientSecret: process.env.SCHEDULE_NOTIFIER_GOOGLE_CLIENT_SECRET,
  callbackURL: isProd ? `https://schedule-notifier.herokuapp.com${googleCallbackPath}` : `http://localhost:3000${googleCallbackPath}`,
  passReqToCallback: true
};
module.exports = { twitterOption, redisOption, GoogleOption };
