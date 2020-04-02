var express = require('express');
var router = express.Router();
var controllerDependencias = require('../controllers/dependencias');

router.post('/', function(req, res, next) {
  console.log('crearDependencia');
  controllerDependencias
    .crearDependencia(req.body)
    .then(function(dependencia) {
      res.json(dependencia);
    })
    .catch(function(err) {
      res.status(500).json(err);
    });
});
router.delete('/:id/:id2', function(req, res, next) {
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
