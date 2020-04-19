const express = require('express');
const router = express.Router();
const controllerDependencias = require('../controllers/dependencias');
const verifyToken = require('../controllers/middleware');
const { ErrorHandler } = require('../helpers/error');
const { propertyChecker } = require('../helpers/propertyChecker');

router.post('/', verifyToken, function(req, res, next) {
  console.log('crearDependencia');
  if (!propertyChecker(req.body, ['idpbi', 'idpbi2']))
    throw new ErrorHandler(422, 'Missing required fields: idpbi, idpbi2');
  controllerDependencias
    .crearDependencia(req.body)
    .then(function(dependencia) {
      res.json(dependencia);
    })
    .catch(function(err) {
      res.status(500).json(err);
    });
});

router.delete('/:id/:id2', verifyToken, function(req, res, next) {
  console.log('borrarDependencia');
  controllerDependencias
    .borrarDependencia(req.params.id, req.params.id2)
    .then(function(dependencia) {
      res.json(dependencia);
    })
    .catch(function(err) {
      res.status(500).json(err);
    });
});

module.exports = router;
