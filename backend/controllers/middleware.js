const jwt = require('jsonwebtoken');
const config = require('../config/config');

function verifyToken(req, res, next) {
  console.log(req.body);
  console.log('verify');
  if (!req.headers.authorization) {
    return res.status(401).json({ error: 'unauthorized_request' });
  }
  let token = req.headers.authorization.split(' ')[1];
  if (token === 'null') {
    return res.status(401).json({ error: 'unauthorized_request' });
  }
  let payload = jwt.verify(token, config.jwtKey);
  if (!payload) {
    return res.status(401).json({ error: 'unauthorized_request' });
  }
  console.log(req.headers);
  console.log(payload);
  req.userId = payload.idusuario;
  next();
}

module.exports = verifyToken;
