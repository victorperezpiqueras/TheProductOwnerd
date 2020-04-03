var express = require('express');
var router = express.Router();
var controllerCriterios = require('../controllers/criterios');
var verifyToken = require('../controllers/middleware');

/* CRITERIOS */
router.post('/', verifyToken, function(req, res, next) {
  console.log('crearCriterio');
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
