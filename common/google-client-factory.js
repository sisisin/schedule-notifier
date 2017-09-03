const google = require('googleapis');
const config = require('../config.js');
const { clientID, clientSecret, callbackURL } = config.googleOption;

const GoogleClientFactory = {
  create({ googleToken, googleRefreshToken }) {
    const oauth2Client = new google.auth.OAuth2(clientID, clientSecret, callbackURL);
    oauth2Client.setCredentials({
      access_token: googleToken,
      refresh_token: googleRefreshToken
    });

    return new GoogleClient(oauth2Client, google);
  }
};

class GoogleClient {
  constructor(auth, google) {
    this.auth = auth;
    this.google = google;
  }

  async listEvents() {
    const now = new Date;
    const targetDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const nextDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2);

    const cfg = {
      auth: this.auth,
      calendarId: 'primary',
      orderBy: 'startTime',
      singleEvents: true,
      timeMax: nextDay.toISOString(),
      timeMin: targetDate.toISOString(),
    };

    return new Promise((resolve, reject) => {
      this.google.calendar('v3').events.list(cfg, (err, res) => {
        if (err) { return reject(err); }
        resolve(res);
      });
    });
  }
}

module.exports = { GoogleClientFactory };
