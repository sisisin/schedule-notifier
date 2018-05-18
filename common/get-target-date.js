const commandLineArgs = require('command-line-args');

const optionDefinitions = [
  { name: 'targetDate', alias: 'd', type: String },
  { name: 'targetHour', alias: 'h', type: Number },
];

const options = commandLineArgs(optionDefinitions);

module.exports = {
  getTargetDate() {
    if (options.targetDate) {
      const t = new Date(options.targetDate)
      if (t.toString() === 'Invalid Date') { throw new Error('Invalid arguments'); }
      return t;
    } else {
      return new Date;
    }
  },
  getTargetHour() { return options.targetHour ? options.targetHour : new Date().getHours(); }
}
