const express = require('express');
const router = express.Router();
const controllerComentarios = require('../controllers/comentarios');
const verifyToken = require('../middlewares/verify-token');
const { ErrorHandler } = require('../helpers/error');
const { propertyChecker } = require('../helpers/propertyChecker');

/* COMENTARIOS */
router.post('/', verifyToken, function(req, res, next) {
  console.log('crearComentario');
  /* const data = { comentario: req.body.comentario, idpbi: req.body.idpbi, idusuario: req.body.idusuario, fecha: req.body.fecha };
  if (!data.nombre || !data.idpbi || !data.done)  */
  if (!propertyChecker(req.body, ['comentario', 'idpbi', 'idusuario', 'fecha']))
    throw new ErrorHandler(422, 'Missing required fields: comentario, idpbi, idusuario, fecha');
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
