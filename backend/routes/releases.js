const express = require('express');
const router = express.Router();
const controllerReleases = require('../controllers/releases');
const verifyToken = require('../middlewares/verify-token');
const { ErrorHandler } = require('../helpers/error');
const { propertyChecker } = require('../helpers/propertyChecker');

/* RELEASES */
router.post('/', verifyToken, function(req, res, next) {
  console.log('crearRelease');
  if (!propertyChecker(req.body, ['version', 'descripcion', 'sprint', 'idproyecto']))
    throw new ErrorHandler(422, 'Missing required fields: version, descripcion, sprint, idproyecto');
  controllerReleases
    .crearRelease(req.body)
    .then(function(release) {
      res.json(release);
    })
    .catch(function(err) {
      res.status(500).json(err);
    });
});

router.put('/:idrelease', verifyToken, function(req, res, next) {
  console.log('editarRelease');
  if (!propertyChecker(req.body, ['version', 'descripcion', 'sprint', 'idproyecto']))
    throw new ErrorHandler(422, 'Missing required fields: version, descripcion, sprint, idproyecto');
  controllerReleases
    .editarRelease(req.params.idrelease, req.body)
    .then(function(release) {
      res.json(release);
    })
    .catch(function(err) {
      res.status(500).json(err);
    });
});

router.delete('/:idrelease', verifyToken, function(req, res, next) {
  console.log('borrarRelease');
  controllerReleases
    .borrarRelease(req.params.idrelease)
    .then(function(release) {
      res.json(release);
    })
    .catch(function(err) {
      res.status(500).json(err);
    });
});
module.exports = router;
