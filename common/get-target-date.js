module.exports = {
  getTargetDate() { return base(process.argv[2]); },
  getTargetTime() { return base(process.argv[3]); }
}

function base(arg) {
  if (arg) {
    const t = new Date(arg)
    if (t.toString() === 'Invalid Date') { throw new Error('Invalid arguments'); }
    return t;
  } else {
    return new Date;
  }
}
