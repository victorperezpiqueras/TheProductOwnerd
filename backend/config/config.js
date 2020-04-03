var config = {};
config.jwtKey = process.env.JWT_KEY;
config.expirationTime = 300;
module.exports = config;
