const Twit = require('twit');
const config = require('../config');

const TwitterClientFactory = {
  create({ twitterToken, twitterTokenSecret }) {
    const twit = new Twit({
      consumer_key: config.twitterOption.consumerKey,
      consumer_secret: config.twitterOption.consumerSecret,
      access_token: twitterToken,
      access_token_secret: twitterTokenSecret
    });
    return new TwitterClient(twit);
  }
};

class TwitterClient {
  constructor(t) {
    this.t = t;
  }

  async showUser({ userId }) {
    return this.t.get('users/show', { user_id: userId });
  }

  async _updateStatuses({ status }) {
    return this.t.post('statuses/update', { status }).then(res => {
      if (res.data && res.data.errors.length > 0) { throw new Error(JSON.stringify(res.data.errors)); }
      return res;
    });
  }

  async tweet({ targetSchedule, mentionTarget }) {
    const dt = new Date(targetSchedule.start.dateTime);
    const message = `@${mentionTarget} ${dt.getMonth() + 1}/${dt.getDate()}の最初の予定は${dt.getHours()}時${dt.getMinutes()}分開始ですよ`;
    if (process.env.NODE_ENV === 'development') {
      console.log(message);
      return;
    } else {
      return this._updateStatuses({ status: message });
    }
  }
}

module.exports = { TwitterClientFactory };
