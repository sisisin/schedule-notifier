const db = require('../models');
const TwitterClientFactory = require('../common/twitter-client-factory').TwitterClientFactory;
const GoogleClientFactory = require('../common/google-client-factory').GoogleClientFactory;
const { getTargetDate, getTargetHour } = require('../common/get-target-date');

async function main() {
  const targetDate = getTargetDate()
  const rows = await findNotificationUserList(getTargetHour());
  const processes = rows.map(async ({ twitterToken, twitterTokenSecret, mentionTarget, googleToken, googleRefreshToken }) => {
    const result = await GoogleClientFactory.create({ googleToken, googleRefreshToken }).listEvents();
    const targetSchedule = result.items
      .filter(item => {
        const hasDateTime = !!item.start && !!item.start.dateTime;
        if (hasDateTime === false) { return false; }
        if (item.creator && item.creator.self) { return true; }
        if (item.organizer && item.organizer.self) { return true; }
        if (item.attendees && item.attendees.find(attendee => attendee.self && attendee.responseStatus !== 'declined')) { return true; }
        return false;
      })
      .sort((a, b) => {
        const aDateTime = new Date(a.start.dateTime);
        const aTime = aDateTime.getHours() * 100 + aDateTime.getMinutes()
        const bDateTime = new Date(b.start.dateTime);
        const bTime = bDateTime.getHours() * 100 + bDateTime.getMinutes()
        return aTime - bTime;
      })[0];
    if (targetSchedule == null) { return; }
    return await TwitterClientFactory.create({ twitterToken, twitterTokenSecret }).tweet({ targetSchedule, mentionTarget });
  });

  return await Promise.all(processes);
}

async function findNotificationUserList(targetHour) {
  const [rows, _] = await db.sequelize.query(`select * from "Users" u
    inner join "GoogleCredentials" g on u.id = g."userId"
    where "notificationTime"=${targetHour}`);
  db.sequelize.close();
  return rows;
}

main().catch(e => console.log(e));
