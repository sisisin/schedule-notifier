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
  callbackURL: isProd ? `http://localhost:3000${callbackPath}` : `http://localhost:3000${callbackPath}`
};

module.exports = { PassportOption, RedisOption };
