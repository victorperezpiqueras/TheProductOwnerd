var express = require('express');
var router = express.Router();
var controllerArchivos = require('../controllers/archivos');

/* ARCHIVOS */
router.post('/', function(req, res, next) {
  console.log('crearArchivo');
  controllerArchivos
    .crearArchivo(req.body)
    .then(function(archivo) {
      res.json(archivo);
    })
    .catch(function(err) {
      res.status(500).json(err);
    });
});
router.delete('/:id', function(req, res, next) {
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
