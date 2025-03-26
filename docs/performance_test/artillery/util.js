function getRandomId(userContext, events, done) {
    const id = Math.floor(Math.random() * 1000) + 1;
    userContext.vars.id = id;
    return done();
  }


module.exports = {
    getRandomId
};