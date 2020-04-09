const express = require('express');
const router = express.Router();
const controllerInvitaciones = require('../controllers/invitaciones');
const verifyToken = require('../controllers/middleware');

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
