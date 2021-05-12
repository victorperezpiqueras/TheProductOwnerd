const express = require('express');
const router = express.Router();
const controllerPbis = require('../controllers/pbis');
const controllerComentarios = require('../controllers/comentarios');
const controllerArchivos = require('../controllers/archivos');
const controllerCriterios = require('../controllers/criterios');
const controllerDependencias = require('../controllers/dependencias');
const controllerValores = require('../controllers/valores');
const verifyToken = require('../middlewares/verify-token');
const { ErrorHandler, handleError } = require('../helpers/error');
const { propertyChecker } = require('../helpers/propertyChecker');

router.post('/', verifyToken, function(req, res, next) {
  console.log('crearPbi');
  if (
    !propertyChecker(req.body, [
      'titulo',
      'descripcion',
      'done',
      'label',
      'estimacion',
      'valor',
      'idproyecto',
      'prioridad',
      'sprintCreacion'
    ])
  )
    throw new ErrorHandler(
      422,
      'Missing required fields: titulo,descripcion,done,label,estimacion,valor,idproyecto,prioridad,sprintCreacion'
    );
  controllerPbis
    .crearPbi(req.body)
    .then(function(pbi) {
      res.json(pbi);
    })
    .catch(function(err) {
      res.status(500).json(err);
    });
});

router.put('/:idpbi', verifyToken, function(req, res, next) {
  console.log('editarPbi');
  if (
    !propertyChecker(req.body, [
      'titulo',
      'descripcion',
      'done',
      'label',
      'estimacion',
      'valor',
      'idproyecto',
      'prioridad',
      'sprint',
      'sprintCreacion'
    ])
  )
    throw new ErrorHandler(
      422,
      'Missing required fields: titulo,descripcion,done,label,estimacion,valor,idproyecto,prioridad,sprint, sprintCreacion'
    );
  controllerPbis
    .editarPbi(req.params.idpbi, req.body)
    .then(function(pbi) {
      res.json(pbi);
    })
    .catch(function(err) {
      res.status(500).json(err);
    });
});

router.put('/', verifyToken, function(req, res, next) {
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

router.get('/:idpbi/comentarios', verifyToken, function(req, res, next) {
  console.log('obtenerComentariosPbi');
  controllerComentarios
    .obtenerComentariosPbi(req.params.idpbi)
    .then(function(comentarios) {
      res.json(comentarios);
    })
    .catch(function(err) {
      res.status(500).json(err);
    });
});

router.get('/:idpbi/archivos', verifyToken, function(req, res, next) {
  console.log('obtenerArchivosPbi');
  controllerArchivos
    .obtenerArchivosPbi(req.params.idpbi)
    .then(function(archivos) {
      res.json(archivos);
    })
    .catch(function(err) {
      res.status(500).json(err);
    });
});

router.get('/:idpbi/criterios', verifyToken, function(req, res, next) {
  console.log('obtenerCriteriosPbi');
  controllerCriterios
    .obtenerCriteriosPbi(req.params.idpbi)
    .then(function(criterios) {
      res.json(criterios);
    })
    .catch(function(err) {
      res.status(500).json(err);
    });
});

router.get('/:idpbi/dependencias', verifyToken, function(req, res, next) {
  console.log('obtenerDependenciasPbi');
  controllerDependencias
    .obtenerDependenciasPbi(req.params.idpbi)
    .then(function(dependencias) {
      res.json(dependencias);
    })
    .catch(function(err) {
      res.status(500).json(err);
    });
});

router.get('/:idpbi/valores', verifyToken, function(req, res, next) {
  console.log('obtenerValoresPbi');
  controllerValores
    .obtenerValoresPbi(req.params.idpbi)
    .then(function(valores) {
      res.json(valores);
    })
    .catch(function(err) {
      res.status(500).json(err);
    });
});

module.exports = router;
