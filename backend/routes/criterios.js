const express = require('express');
const router = express.Router();
const controllerCriterios = require('../controllers/criterios');
const verifyToken = require('../middlewares/verify-token');
const { ErrorHandler, handleError } = require('../helpers/error');
const { propertyChecker } = require('../helpers/propertyChecker');

/* CRITERIOS */
router.post('/', verifyToken, function(req, res, next) {
  console.log('crearCriterio');
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

router.put('/:idcriterio', verifyToken, function(req, res, next) {
  console.log('actualizarCriterio');
  if (!propertyChecker(req.body, ['nombre', 'idpbi', 'done']))
    throw new ErrorHandler(422, 'Missing required fields: nombre, idpbi, done');
  controllerCriterios
    .actualizarCriterio(req.params.idcriterio, req.body)
    .then(function(criterio) {
      res.json(criterio);
    })
    .catch(function(err) {
      res.status(500).json(err);
    });
});
router.delete('/:idcriterio', verifyToken, function(req, res, next) {
  console.log('borrarCriterio');
  controllerCriterios
    .borrarCriterio(req.params.idcriterio)
    .then(function(criterio) {
      res.json(criterio);
    })
    .catch(function(err) {
      res.status(500).json(err);
    });
});

module.exports = router;
