const express = require('express');
const router = express.Router();
const controllerCriterios = require('../controllers/criterios');
const verifyToken = require('../controllers/middleware');
const { ErrorHandler, handleError } = require('../helpers/error');
const { propertyChecker } = require('../helpers/propertyChecker');

/* CRITERIOS */
router.post('/', verifyToken, function(req, res, next) {
  console.log('crearCriterio');
  /* const data = { nombre: req.body.nombre, idpbi: req.body.idpbi, done: req.body.done };
  if (!data.nombre || !data.idpbi || !data.done )  */
  if (!propertyChecker(req.body, ['nombre', 'idpbi', 'done']))
    throw new ErrorHandler(422, 'Missing required fields: nombre, idpbi, done');
  controllerCriterios
    .crearCriterio(req.body)
    .then(function(criterio) {
      res.json(criterio);
    })
    .catch(function(err) {
      res.status(500).json(err);
    });
});
router.put('/:id', verifyToken, function(req, res, next) {
  console.log('actualizarCriterio');
  /* const data = { nombre: req.body.nombre, idcriterio: req.body.idcriterio, done: req.body.done };
  if (!data.nombre || !data.idpbi || !data.done)  */
  if (!propertyChecker(req.body, ['nombre', 'idcriterio', 'done']))
    throw new ErrorHandler(422, 'Missing required fields: nombre, idcriterio, done');
  controllerCriterios
    .actualizarCriterio(req.params.id, req.body)
    .then(function(criterio) {
      res.json(criterio);
    })
    .catch(function(err) {
      res.status(500).json(err);
    });
});
router.delete('/:id', verifyToken, function(req, res, next) {
  console.log('borrarCriterio');
  controllerCriterios
    .borrarCriterio(req.params.id)
    .then(function(criterio) {
      res.json(criterio);
    })
    .catch(function(err) {
      res.status(500).json(err);
    });
});

module.exports = router;
