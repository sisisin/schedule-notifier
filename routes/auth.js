const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/', (req, res) => {
  res.render('auth', { title: 'auth' });
});
router.get('/twitter', passport.authenticate('twitter'));
router.get(
  '/twitter/callback',
  passport.authenticate('twitter', { failureRedirect: '/auth' }),
  (req, res) => { res.redirect('/'); });

router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'https://www.googleapis.com/auth/calendar.readonly'],
  accessType: 'offline',
  prompt: 'consent'
}));
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth' }),
  (req, res) => { res.redirect('/'); });

module.exports = router;
