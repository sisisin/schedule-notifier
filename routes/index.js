const express = require('express');
const router = express.Router();
const db = require('../models/');
const TwitterClientFactory = require('../common/twitter-client-factory').TwitterClientFactory;

router.get('/', async (req, res, next) => {
  const u = await db.User.findById(req.session.passport.user.id);
  const { id, notificationTime, twitterToken, twitterTokenSecret } = u.toJSON();
  const t = TwitterClientFactory.create({ twitterToken, twitterTokenSecret });
  const result = await t.showUser({ userId: id });
  res.render('user', { title: 'user', name: result.data.name, notificationTime });
});

module.exports = router;
