const db = require('../models');
const TwitterClientFactory = require('../common/twitter-client-factory').TwitterClientFactory;
const GoogleClientFactory = require('../common/google-client-factory').GoogleClientFactory;

async function main() {
  const targetHour = new Date;
  const [rows, _] = await db.sequelize.query(`select * from "Users" u
    inner join "GoogleCredentials" g on u.id = g."userId"
    where "notificationTime"=${targetHour.getHours()}`);
  db.sequelize.close();

  const processes = rows.map(async ({ twitterToken, twitterTokenSecret, mentionTarget, googleToken, googleRefreshToken }) => {
    const result = await GoogleClientFactory.create({ googleToken, googleRefreshToken }).listEvents();
    const targetSchedule = result.items
      .filter(item => {
        if (item.creator && item.creator.self) { return true; }
        if (item.organizer && item.organizer.self) { return true; }
        if (item.attendees && item.attendees.find(attendee => attendee.self && attendee.responseStatus !== 'declined')) { return true; }
        return false;
      })[0];

    return await TwitterClientFactory.create({ twitterToken, twitterTokenSecret }).tweet({ targetSchedule, mentionTarget });
  });

  return await Promise.all(processes);
}

main().catch(e => console.log(e));
