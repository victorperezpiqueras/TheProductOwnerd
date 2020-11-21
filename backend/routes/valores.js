const express = require('express');
const router = express.Router();
const controllerValores = require('../controllers/valores');
const verifyToken = require('../middlewares/verify-token');
const { ErrorHandler } = require('../helpers/error');
const { propertyChecker } = require('../helpers/propertyChecker');

/* VALORES */
router.post('/', verifyToken, function(req, res, next) {
  console.log('crearValor');
  if (!propertyChecker(req.body, ['valor', 'idpbi', 'idrol']))
    throw new ErrorHandler(422, 'Missing required fields: valor, idpbi, idrol');
  controllerValores
    .crearValor(req.body)
    .then(function(valor) {
      res.json(valor);
    })
    .catch(function(err) {
      res.status(500).json(err);
    });
});

router.put('/:idvalor', verifyToken, function(req, res, next) {
  console.log('editarValor');
  if (!propertyChecker(req.body, ['valor', 'idpbi', 'idrol']))
    throw new ErrorHandler(422, 'Missing required fields: valor, idpbi, idrol');
  controllerValores
    .editarValor(req.params.idvalor, req.body)
    .then(function(valor) {
      res.json(valor);
    })
    .catch(function(err) {
      res.status(500).json(err);
    });
});

module.exports = router;
