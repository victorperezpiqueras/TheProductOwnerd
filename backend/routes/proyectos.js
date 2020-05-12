const express = require('express');
const router = express.Router();
const controllerProyectos = require('../controllers/proyectos');
const verifyToken = require('../middlewares/verify-token');
const verifyProjectPermissions = require('../middlewares/proyecto-permisos');
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

router.get('/:idproyecto', verifyToken, verifyProjectPermissions, function(req, res, next) {
  console.log('getProyecto');
  controllerProyectos
    .getProyecto(req.params.idproyecto)
    .then(function(proyecto) {
      res.json(proyecto);
    })
    .catch(function(err) {
      res.status(500).json(err);
    });
});

router.get('/:idproyecto/sprintgoals', verifyToken, verifyProjectPermissions, function(req, res, next) {
  console.log('getProyecto');
  controllerProyectos
    .getProyectoSprintGoals(req.params.idproyecto)
    .then(function(sprintgoals) {
      res.json(sprintgoals);
    })
    .catch(function(err) {
      res.status(500).json(err);
    });
});

router.get('/:idproyecto/usuarios', verifyToken, verifyProjectPermissions, function(req, res, next) {
  console.log('getProyectoUsuarios');
  controllerProyectos
    .getProyectoUsuarios(req.params.idproyecto)
    .then(function(usuarios) {
      res.json(usuarios);
    })
    .catch(function(err) {
      res.status(500).json(err);
    });
});

router.get('/:idproyecto/usuarios/roles', verifyToken, verifyProjectPermissions, function(req, res, next) {
  console.log('getProyectoUsuariosRoles');
  controllerProyectos
    .getProyectoUsuariosRoles(req.params.idproyecto)
    .then(function(usuarios) {
      res.json(usuarios);
    })
    .catch(function(err) {
      res.status(500).json(err);
    });
});

router.get('/:idproyecto/pbis', verifyToken, verifyProjectPermissions, function(req, res, next) {
  console.log('getProyectoPBIs');
  controllerProyectos
    .getProyectoPBIs(req.params.idproyecto)
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

router.put('/:idproyecto', verifyToken, verifyProjectPermissions, function(req, res, next) {
  console.log('actualizarProyecto');
  if (!propertyChecker(req.body, ['nombre', 'descripcion', 'vision', 'sprintActual', 'deadline']))
    throw new ErrorHandler(422, 'Missing required fields: nombre, descripcion, vision, sprintActual, deadline');
  controllerProyectos
    .actualizarProyecto(req.params.idproyecto, req.body)
    .then(function(proyecto) {
      res.json(proyecto);
    })
    .catch(function(err) {
      res.status(500).json(err);
    });
});

router.post('/:idproyecto/agregarUsuario', verifyToken, verifyProjectPermissions, function(req, res, next) {
  console.log('proyectoAgregarUsuario');
  if (!propertyChecker(req.body, ['idproyectousuario', 'rol']))
    throw new ErrorHandler(422, 'Missing required fields: idusuario, rol');
  controllerProyectos
    .proyectoAgregarUsuario(req.params.idproyecto, req.body)
    .then(function(proyecto) {
      res.json(proyecto);
    })
    .catch(function(err) {
      if (err.error == 'error_already_in_project') res.status(409).json(err);
      else res.status(500).json(err);
    });
});

router.delete('/:idproyecto/eliminarUsuario/:idusuario', verifyToken, verifyProjectPermissions, function(
  req,
  res,
  next
) {
  console.log('proyectoEliminarUsuario');
  controllerProyectos
    .proyectoEliminarUsuario(req.params.idproyecto, req.params.idusuario)
    .then(function(proyecto) {
      res.json(proyecto);
    })
    .catch(function(err) {
      res.status(500).json(err);
    });
});

router.post('/:idproyecto/invitar', verifyToken, verifyProjectPermissions, function(req, res, next) {
  console.log('proyectoInvitarUsuario');
  if (!propertyChecker(req.body, ['email', 'rol', 'nombreProyecto', 'invitadoPor']))
    throw new ErrorHandler(422, 'Missing required fields: email, rol, nombreProyecto, invitadoPor');
  controllerProyectos
    .proyectoInvitarUsuario(req.params.idproyecto, req.body)
    .then(function(proyecto) {
      res.json(proyecto);
    })
    .catch(function(err) {
      res.status(500).json(err);
    });
});

module.exports = router;
