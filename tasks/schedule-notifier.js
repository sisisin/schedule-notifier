const db = require('../models');
const google = require('googleapis');
const config = require('../config.js');
const Twit = require('twit');
const { clientID, clientSecret, callbackURL } = config.GoogleOption;

async function main() {
  const targetHour = new Date;
  const [rows, _] = await db.sequelize.query(`select * from "Users" u
    inner join "GoogleCredentials" g on u.id = g."userId"
    where "notificationTime"=${targetHour.getHours()}`);
  db.sequelize.close();

  const processes = rows.map(async ({ twitterToken, twitterTokenSecret, mentionTarget, googleToken, googleRefreshToken }) => {
    const result = await listEvents(googleToken, googleRefreshToken);
    const targetSchedule = result.items
      .filter(item => {
        if (item.creator && item.creator.self) { return true; }
        if (item.organizer && item.organizer.self) { return true; }
        if (item.attendees && item.attendees.find(attendee => attendee.self && attendee.responseStatus !== 'declined')) { return true; }
        return false;
      })[0];
    await tweet({ twitterToken, twitterTokenSecret, targetSchedule, mentionTarget })
    return result;
  });

  return await Promise.all(processes);
}

async function tweet({ twitterToken, twitterTokenSecret, targetSchedule, mentionTarget }) {
  const t = new Twit({
    consumer_key: config.PassportOption.consumerKey,
    consumer_secret: config.PassportOption.consumerSecret,
    access_token: twitterToken,
    access_token_secret: twitterTokenSecret
  });
  const dt = new Date(targetSchedule.start.dateTime);
  await t.post('statuses/update', { status: `@${mentionTarget} 明日の最初の予定は${dt.getHours()}時${dt.getMinutes()}分開始だょ` });
}

async function listEvents(googleToken, googleRefreshToken) {
  const oauth2Client = new google.auth.OAuth2(clientID, clientSecret, callbackURL);
  oauth2Client.setCredentials({
    access_token: googleToken,
    refresh_token: googleRefreshToken
  });

  const now = new Date;
  const targetDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  const nextDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2);

  const cfg = {
    auth: oauth2Client,
    calendarId: 'primary',
    orderBy: 'startTime',
    singleEvents: true,
    timeMax: nextDay.toISOString(),
    timeMin: targetDate.toISOString(),
  };

  return new Promise((resolve, reject) => {
    google.calendar('v3').events.list(cfg, (err, res) => {
      if (err) { return reject(err); }
      resolve(res);
    });
  });
}

main().catch(e => console.log(e));
