module.exports = function getTargetDate() {
  if (process.argv[2]) {
    const t = new Date(process.argv[2])
    if (t.toString() === 'Invalid Date') { throw new Error('Invalid arguments'); }
    return t;
  } else {
    return new Date;
  }
}
