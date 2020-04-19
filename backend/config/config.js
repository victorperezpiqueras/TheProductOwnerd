/**
 * Contiene la configuracion global del servidor
 * @argument jwtKey: clave de encriptacion de JWT
 * @argument expirationTime: tiempo en segundos de expiracion del token
 */
var config = {};
config.jwtKey = process.env.JWT_KEY;
config.expirationTime = 300;
module.exports = config;
