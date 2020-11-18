const express = require('express');
const router = express.Router();
const controllerImportancias = require('../controllers/importancias');
const verifyToken = require('../middlewares/verify-token');
const { ErrorHandler } = require('../helpers/error');
const { propertyChecker } = require('../helpers/propertyChecker');

/* IMPORTANCIAS */
router.post('/', verifyToken, function(req, res, next) {
  console.log('crearImportancia');
  console.log(req.body);
  if (!propertyChecker(req.body, ['valor', 'idpbi', 'idrol']))
    throw new ErrorHandler(422, 'Missing required fields: valor, idpbi, idrol');
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
  if (!propertyChecker(req.body, ['valor', 'idpbi', 'idrol']))
    throw new ErrorHandler(422, 'Missing required fields: valor, idpbi, idrol');
  controllerImportancias
    .editarImportancia(req.params.idimportancia, req.body)
    .then(function(importancia) {
      res.json(importancia);
    })
    .catch(function(err) {
      res.status(500).json(err);
    });
});

module.exports = router;
