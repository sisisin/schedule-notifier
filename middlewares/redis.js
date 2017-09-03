const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const config = require('../config');
const redisStore = new RedisStore(config.redisOption);

module.exports = redisStore;
