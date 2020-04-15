var express = require('express');
var router = express.Router();
var controllerProyectos = require('../controllers/proyectos');
var verifyToken = require('../controllers/middleware');
const { ErrorHandler } = require('../helpers/error');
const { propertyChecker } = require('../helpers/propertyChecker');

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

router.get('/:id/sprintgoals', verifyToken, function(req, res, next) {
  console.log('getProyecto');
  controllerProyectos
    .getSprintGoals(req.params.id)
    .then(function(sprintgoals) {
      res.json(sprintgoals);
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

router.post('/', verifyToken, function(req, res, next) {
  console.log('crearProyecto');
  /*  const data = { nombre: req.body.nombre, descripcion: req.body.descripcion, idusuario: req.body.idusuario };
   if (!data.nombre || !data.descripcion || !data.idusuario) */
  if (!propertyChecker(req.body, ['nombre', 'descripcion', 'idusuario']))
    throw new ErrorHandler(422, 'Missing required fields: nombre, descripcion, idusuario');
  controllerProyectos
    .crearProyecto(req.body)
    .then(function(proyecto) {
      res.json(proyecto);
    })
    .catch(function(err) {
      if (err.error === 'project_name_exists') res.status(409).json(err);
      else res.status(500).json(err);
    });
});

router.put('/:id', verifyToken, function(req, res, next) {
  console.log('actualizarProyecto');
  if (!propertyChecker(req.body, ['nombre', 'descripcion', 'vision', 'sprintActual']))
    throw new ErrorHandler(422, 'Missing required fields: nombre, descripcion, vision, sprintActual');
  controllerProyectos
    .actualizarProyecto(req.params.id, req.body)
    .then(function(proyecto) {
      res.json(proyecto);
    })
    .catch(function(err) {
      res.status(500).json(err);
    });
});

router.post('/:id/agregarUsuario', verifyToken, function(req, res, next) {
  console.log('proyectoAgregarUsuario');
  /* const data = { idusuario: req.body.idusuario, rol: req.body.rol };
  if (!data.idusuario || !data.rol) */
  if (!propertyChecker(req.body, ['idusuario', 'rol']))
    throw new ErrorHandler(422, 'Missing required fields: idusuario, rol');
  controllerProyectos
    .proyectoAgregarUsuario(req.params.id, req.body)
    .then(function(proyecto) {
      res.json(proyecto);
    })
    .catch(function(err) {
      if (err.error == 'error_already_in_project') res.status(409).json(err);
      else res.status(500).json(err);
    });
});

router.delete('/:id/eliminarUsuario/:idusuario', verifyToken, function(req, res, next) {
  console.log('proyectoEliminarUsuario');
  controllerProyectos
    .proyectoEliminarUsuario(req.params.id, req.params.idusuario)
    .then(function(proyecto) {
      res.json(proyecto);
    })
    .catch(function(err) {
      res.status(500).json(err);
    });
});

router.post('/:id/invitar', verifyToken, function(req, res, next) {
  console.log('proyectoInvitarUsuario');
  /* const data = { email: req.body.email, rol: req.body.rol };
  if (!data.email || !data.rol) */
  if (!propertyChecker(req.body, ['email', 'rol', 'nombreProyecto', 'invitadoPor']))
    throw new ErrorHandler(422, 'Missing required fields: email, rol, nombreProyecto, invitadoPor');
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
