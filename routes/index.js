const express = require('express');
const router = express.Router();
const db = require('../models/');
const Twit = require('twit');
const config = require('../config');

router.get('/', async (req, res, next) => {
  const u = await db.User.findById(req.session.passport.user.id);
  const { id, notificationTime, twitterToken, twitterTokenSecret } = u.toJSON();
  const t = new Twit({
    consumer_key: config.twitterOption.consumerKey,
    consumer_secret: config.twitterOption.consumerSecret,
    access_token: twitterToken,
    access_token_secret: twitterTokenSecret
  });
  const result = await t.get('users/show', { user_id: id });
  res.render('user', { title: 'user', name: result.data.name, notificationTime });
});

module.exports = router;
