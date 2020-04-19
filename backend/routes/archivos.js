const express = require('express');
const router = express.Router();
const controllerArchivos = require('../controllers/archivos');
const verifyToken = require('../controllers/middleware');
const { ErrorHandler } = require('../helpers/error');
const { propertyChecker } = require('../helpers/propertyChecker');

/* ARCHIVOS */
router.post('/', verifyToken, function(req, res, next) {
  console.log('crearArchivo');
  /* const data = { nombre: req.body.nombre, src: req.body.src, idpbi: req.body.idpbi, idusuario: req.body.idusuario };
  if (!data.nombre || !data.src || !data.idpbi || !data.idusuario)  */
  if (!propertyChecker(req.body, ['nombre', 'src', 'idpbi', 'idusuario']))
    throw new ErrorHandler(422, 'Missing required fields: nombre, src, idpbi, idusuario');
  controllerArchivos
    .crearArchivo(req.body)
    .then(function(archivo) {
      res.json(archivo);
    })
    .catch(function(err) {
      res.status(500).json(err);
    });
});

router.delete('/:id', verifyToken, function(req, res, next) {
  console.log('borrarArchivo');
  controllerArchivos
    .borrarArchivo(req.params.id)
    .then(function(archivo) {
      res.json(archivo);
    })
    .catch(function(err) {
      res.status(500).json(err);
    });
});

module.exports = router;
