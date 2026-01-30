function getRandomId(userContext, events, done) {
    const maxValue = 2000;
    // Generate a random integer between 1 and maxValue (inclusive)
    const id = Math.floor(Math.random() * maxValue) + 1;
    userContext.vars.id = id;
    return done();
}

module.exports = {
    getRandomId
};