var express = require('express');
var router = express.Router();
var controllerComentarios = require('../controllers/comentarios');

/* COMENTARIOS */
router.post('/', function(req, res, next) {
  console.log('crearComentario');
  controllerComentarios
    .crearComentario(req.body)
    .then(function(comentario) {
      res.json(comentario);
    })
    .catch(function(err) {
      res.status(500).json(err);
    });
});

module.exports = router;
