var express = require('express');
var router = express.Router();
var controllerProyectos = require('../controllers/proyectos');
var verifyToken = require('../controllers/middleware');

/* PROYECTOS */
router.get('/', verifyToken, function(req, res, next) {
  console.log('getProyectos');
  controllerProyectos
    .getProyectos()
    .then(function(proyectos) {
      res.json(proyectos);
    })
    .catch(function(err) {
      res.status(500).json(err);
    });
});
router.get('/:id', verifyToken, function(req, res, next) {
  console.log('getProyecto');
  controllerProyectos
    .getProyecto(req.params.id)
    .then(function(proyecto) {
      res.json(proyecto);
    })
    .catch(function(err) {
      res.status(500).json(err);
    });
});

router.get('/:id/usuarios', verifyToken, function(req, res, next) {
  console.log('getProyectosUsuarios');
  controllerProyectos
    .getProyectosUsuarios(req.params.id)
    .then(function(usuarios) {
      res.json(usuarios);
    })
    .catch(function(err) {
      res.status(500).json(err);
    });
});

router.get('/:id/usuarios/roles', verifyToken, function(req, res, next) {
  console.log('getProyectoUsuariosRoles');
  controllerProyectos
    .getProyectoUsuariosRoles(req.params.id)
    .then(function(usuarios) {
      res.json(usuarios);
    })
    .catch(function(err) {
      res.status(500).json(err);
    });
});

router.get('/:id/pbis', verifyToken, function(req, res, next) {
  console.log('getProyectoPBIs');
  controllerProyectos
    .getProyectoPBIs(req.params.id)
    .then(function(pbis) {
      res.json(pbis);
    })
    .catch(function(err) {
      res.status(500).json(err);
    });
});

router.get('/usuarios/roles', verifyToken, function(req, res, next) {
  console.log('getProyectosUsuariosRoles');
  console.log(req.headers);
  controllerProyectos
    .getProyectosUsuariosRoles()
    .then(function(usuariosRoles) {
      res.json(usuariosRoles);
    })
    .catch(function(err) {
      res.status(500).json(err);
    });
});
/*  body: 
      nombre, 
      descripcion, 
      idusuario
   */
router.post('/', verifyToken, function(req, res, next) {
  console.log('crearProyecto');
  controllerProyectos
    .crearProyecto(req.body)
    .then(function(proyecto) {
      res.json(proyecto);
    })
    .catch(function(err) {
      res.status(500).json(err);
    });
});

/* :id=idproyecto 
      body: 
      rol="desarrollador || productOwner || stakeholder"
      idusuario = idusuario a agregar
   */
router.post('/:id/agregarUsuario', verifyToken, function(req, res, next) {
  console.log('proyectoAgregarUsuario');
  controllerProyectos
    .proyectoAgregarUsuario(req.params.id, req.body)
    .then(function(proyecto) {
      res.json(proyecto);
    })
    .catch(function(err) {
      res.status(500).json(err);
    });
});

router.post('/:id/invitar', verifyToken, function(req, res, next) {
  console.log('proyectoInvitarUsuario');
  controllerProyectos
    .proyectoInvitarUsuario(req.params.id, req.body)
    .then(function(proyecto) {
      res.json(proyecto);
    })
    .catch(function(err) {
      res.status(500).json(err);
    });
});

module.exports = router;
