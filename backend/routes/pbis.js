var express = require('express');
var router = express.Router();
var controllerPbis = require('../controllers/pbis');
var controllerComentarios = require('../controllers/comentarios');
var controllerArchivos = require('../controllers/archivos');
var controllerCriterios = require('../controllers/criterios');
var controllerDependencias = require('../controllers/dependencias');

router.post('/', function(req, res, next) {
  console.log('crearPbi');
  controllerPbis
    .crearPbi(req.body)
    .then(function(pbi) {
      res.json(pbi);
    })
    .catch(function(err) {
      res.status(500).json(err);
    });
});

router.put('/:id', function(req, res, next) {
  console.log('editarPbi');
  controllerPbis
    .editarPbi(req.params.id, req.body)
    .then(function(pbi) {
      res.json(pbi);
    })
    .catch(function(err) {
      res.status(500).json(err);
    });
});

router.put('/', function(req, res, next) {
  console.log('editarPrioridadesPbis');
  controllerPbis
    .editarPrioridadesPbis(req.body)
    .then(function(pbis) {
      res.json(pbis);
    })
    .catch(function(err) {
      res.status(500).json(err);
    });
});

router.get('/:id/comentarios', function(req, res, next) {
  console.log('obtenerComentariosPbi');
  controllerComentarios
    .obtenerComentariosPbi(req.params.id)
    .then(function(comentarios) {
      res.json(comentarios);
    })
    .catch(function(err) {
      res.status(500).json(err);
    });
});

router.get('/:id/archivos', function(req, res, next) {
  console.log('obtenerArchivosPbi');
  controllerArchivos
    .obtenerArchivosPbi(req.params.id)
    .then(function(archivos) {
      res.json(archivos);
    })
    .catch(function(err) {
      res.status(500).json(err);
    });
});

router.get('/:id/criterios', function(req, res, next) {
  console.log('obtenerCriteriosPbi');
  controllerCriterios
    .obtenerCriteriosPbi(req.params.id)
    .then(function(criterios) {
      res.json(criterios);
    })
    .catch(function(err) {
      res.status(500).json(err);
    });
});

router.get('/:id/dependencias', function(req, res, next) {
  console.log('obtenerDependenciasPbi');
  controllerDependencias
    .obtenerDependenciasPbi(req.params.id)
    .then(function(dependencias) {
      res.json(dependencias);
    })
    .catch(function(err) {
      res.status(500).json(err);
    });
});

module.exports = router;
