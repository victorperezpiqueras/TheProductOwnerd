var express = require('express');
var router = express.Router();
var controllerInvitaciones = require('../controllers/invitaciones');
var verifyToken = require('../controllers/middleware');

router.get('/:token', function(req, res, next) {
  console.log('getInvitacion');
  controllerInvitaciones
    .obtenerInvitacion(req.params.token)
    .then(function(invitacion) {
      res.json(invitacion);
    })
    .catch(function(err) {
      res.status(500).json(err);
    });
});

module.exports = router;
