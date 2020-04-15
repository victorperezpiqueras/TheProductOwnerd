const express = require('express');
const router = express.Router();
const controllerPbis = require('../controllers/pbis');
const controllerComentarios = require('../controllers/comentarios');
const controllerArchivos = require('../controllers/archivos');
const controllerCriterios = require('../controllers/criterios');
const controllerDependencias = require('../controllers/dependencias');
const verifyToken = require('../controllers/middleware');
const { ErrorHandler, handleError } = require('../helpers/error');
const { propertyChecker } = require('../helpers/propertyChecker');

router.post('/', verifyToken, function(req, res, next) {
  console.log('crearPbi');
  /* const data = {
    titulo: req.body.titulo, descripcion: req.body.descripcion, done: req.body.done,
    label: req.body.label, estimacion: req.body.estimacion, valor: req.body.valor, idproyecto: req.body.idproyecto,
    prioridad: req.body.prioridad
  }
  if (!data.titulo || !data.descripcion || !data.done || !data.label || !data.estimacion || !data.valor || !data.idproyecto || !data.prioridad) */
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

router.put('/:id', verifyToken, function(req, res, next) {
  console.log('editarPbi');
  /* const data = {
    titulo: req.body.titulo, descripcion: req.body.descripcion, done: req.body.done,
    label: req.body.label, estimacion: req.body.estimacion, valor: req.body.valor, idproyecto: req.body.idproyecto,
    prioridad: req.body.prioridad, sprint:req.body.sprint
  }
  if (!data.titulo || !data.descripcion || !data.done || !data.label || !data.estimacion || !data.valor || !data.idproyecto || !data.prioridad || !data.sprint)
     */
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
      'Missing required fields: titulo,descripcion,done,label,estimacion,valor,idproyecto,prioridad,sprint, printCreacion'
    );
  controllerPbis
    .editarPbi(req.params.id, req.body)
    .then(function(pbi) {
      res.json(pbi);
    })
    .catch(function(err) {
      res.status(500).json(err);
    });
});

router.put('/', verifyToken, function(req, res, next) {
  console.log('editarPrioridadesPbis');
  /* if (!data.prioridad) */
  /* if (!propertyChecker(req.body, ["prioridad"]))
    throw new ErrorHandler(400, 'Missing required fields: prioridad'); */
  controllerPbis
    .editarPrioridadesPbis(req.body)
    .then(function(pbis) {
      res.json(pbis);
    })
    .catch(function(err) {
      res.status(500).json(err);
    });
});

router.get('/:id/comentarios', verifyToken, function(req, res, next) {
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

router.get('/:id/archivos', verifyToken, function(req, res, next) {
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

router.get('/:id/criterios', verifyToken, function(req, res, next) {
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

router.get('/:id/dependencias', verifyToken, function(req, res, next) {
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
