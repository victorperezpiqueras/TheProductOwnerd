const express = require('express');
const router = express.Router();
const controllerImportancias = require('../controllers/importancias');
const verifyToken = require('../middlewares/verify-token');
const { ErrorHandler } = require('../helpers/error');
const { propertyChecker } = require('../helpers/propertyChecker');

/* IMPORTANCIAS */
router.post('/', verifyToken, function(req, res, next) {
  console.log('crearImportancia');
  if (!propertyChecker(req.body, ['importancia', 'idproyecto', 'idrol']))
    throw new ErrorHandler(422, 'Missing required fields: importancia, idproyecto, idrol');
  controllerImportancias
    .crearImportancia(req.body)
    .then(function(importancia) {
      res.json(importancia);
    })
    .catch(function(err) {
      res.status(500).json(err);
    });
});

router.put('/:idimportancia', verifyToken, function(req, res, next) {
  console.log('editarImportancia');
  if (!propertyChecker(req.body, ['importancia', 'idproyecto', 'idrol']))
    throw new ErrorHandler(422, 'Missing required fields: importancia, idproyecto, idrol');
  controllerImportancias
    .editarImportancia(req.params.idimportancia, req.body)
    .then(function(importancia) {
      res.json(importancia);
    })
    .catch(function(err) {
      res.status(500).json(err);
    });
});

router.delete('/:idimportancia', verifyToken, function(req, res, next) {
  console.log('borrarImportancia');
  controllerImportancias
    .borrarImportancia(req.params.idimportancia)
    .then(function(importancia) {
      res.json(importancia);
    })
    .catch(function(err) {
      res.status(500).json(err);
    });
});

module.exports = router;
