const express = require('express');
const router = express.Router();
const controllerUsuarios = require('../controllers/usuarios');
const verifyToken = require('../middlewares/verify-token');
const { ErrorHandler } = require('../helpers/error');
const { propertyChecker } = require('../helpers/propertyChecker');

/* USUARIOS */
router.get('/', verifyToken, function(req, res, next) {
  console.log('getUsuarios');
  controllerUsuarios
    .getUsuarios()
    .then(function(usuarios) {
      res.json(usuarios);
    })
    .catch(function(err) {
      res.status(500).json(err);
    });
});

router.get('/:idusuario', verifyToken, function(req, res, next) {
  console.log('getUsuario');
  controllerUsuarios
    .getUsuario(req.params.idusuario)
    .then(function(usuario) {
      res.json(usuario);
    })
    .catch(function(err) {
      res.status(500).json(err);
    });
});

router.put('/:idusuario/actualizar', verifyToken, function(req, res, next) {
  console.log('actualizarUsuario');
  if (!propertyChecker(req.body, ['nick', 'nombre', 'apellido1', 'apellido2', 'email', 'password']))
    throw new ErrorHandler(422, 'Missing required fields: nick, nombre, apellido1, apellido2, email, password');
  controllerUsuarios
    .actualizarUsuario(req.params.idusuario, req.body)
    .then(function(usuario) {
      res.json(usuario);
    })
    .catch(function(err) {
      res.status(500).json(err);
    });
});

router.put('/:idusuario/actualizarpassword', verifyToken, function(req, res, next) {
  console.log('actualizarUsuarioPassword');
  if (!propertyChecker(req.body, ['password', 'newPassword']))
    throw new ErrorHandler(422, 'Missing required fields: password, newPassword');
  controllerUsuarios
    .actualizarUsuarioPassword(req.params.idusuario, req.body)
    .then(function(usuario) {
      res.json(usuario);
    })
    .catch(function(err) {
      if (err.error === 'user_not_found') res.status(404).json(err);
      if (err.error === 'password_missmatch') res.json({ error: 'password_missmatch' });
      else res.status(500).json(err);
    });
});

router.get('/:idusuario/proyectos', verifyToken, function(req, res, next) {
  console.log('getUsuariosProyectos');
  controllerUsuarios
    .getUsuariosProyectos(req.params.idusuario)
    .then(function(proyectos) {
      res.json(proyectos);
    })
    .catch(function(err) {
      res.status(500).json(err);
    });
});

router.get('/:idusuario/proyectos/:idproyecto/permisos', verifyToken, function(req, res, next) {
  console.log('getUsuariosProyectosPermisos');
  controllerUsuarios
    .getUsuariosProyectosPermisos(req.params.idusuario, req.params.idproyecto)
    .then(function(permisos) {
      res.json(permisos);
    })
    .catch(function(err) {
      res.status(500).json(err);
    });
});

router.post('/registro', function(req, res, next) {
  console.log('registro');
  if (!propertyChecker(req.body, ['nick', 'nombre', 'apellido1', 'apellido2', 'email', 'password']))
    throw new ErrorHandler(422, 'Missing required fields: nick, nombre, apellido1, apellido2, email, password');
  controllerUsuarios
    .registroUsuario(req.body)
    .then(function(usuario) {
      res.json(usuario);
    })
    .catch(function(err) {
      if (err.error === 'user_exists') res.status(409).json(err);
      else res.status(500).json(err);
    });
});

router.post('/registro/invitar', function(req, res, next) {
  console.log('registroUsuarioInvitar');
  if (!propertyChecker(req.body, ['nick', 'nombre', 'apellido1', 'apellido2', 'email', 'password', 'token']))
    throw new ErrorHandler(422, 'Missing required fields: nick, nombre, apellido1, apellido2, email, password, token');
  controllerUsuarios
    .registroUsuarioInvitar(req.body)
    .then(function(usuario) {
      res.json(usuario);
    })
    .catch(function(err) {
      if (err.error === 'token_authentication_failed') res.status(401).json(err);
      if (err.error === 'invitation_expired') res.status(410).json(err);
      if (err.error === 'user_exists') res.status(409).json(err);
      else res.status(500).json(err);
    });
});

router.post('/login', function(req, res, next) {
  console.log('login');
  console.log(req.body);
  const user = { email: req.body.email, password: req.body.password };
  if (!propertyChecker(req.body, ['email', 'password']))
    throw new ErrorHandler(422, 'Missing required fields: email, password');
  controllerUsuarios
    .loginUsuario(user)
    .then(function(usuario) {
      res.json(usuario);
    })
    .catch(function(err) {
      if (err.error === 'user_not_found') res.status(404).json(err);
      if (err.error === 'password_missmatch') res.status(403).json(err);
      else res.status(500).json(err);
    });
});

router.get('/:idusuario/proyectosfavoritos', verifyToken, function(req, res, next) {
  console.log('getUsuarioProyectosFavoritos');
  controllerUsuarios
    .getUsuarioProyectosFavoritos(req.params.idusuario)
    .then(function(proyectosfavoritos) {
      res.json(proyectosfavoritos);
    })
    .catch(function(err) {
      res.status(500).json(err);
    });
});

router.post('/:idusuario/proyectosfavoritos', verifyToken, function(req, res, next) {
  console.log('agregarUsuarioProyectosFavoritos');
  if (!propertyChecker(req.body, ['idproyecto'])) throw new ErrorHandler(422, 'Missing required fields: idproyecto');
  controllerUsuarios
    .agregarUsuarioProyectosFavoritos(req.params.idusuario, req.body)
    .then(function(proyectosfavoritos) {
      res.json(proyectosfavoritos);
    })
    .catch(function(err) {
      res.status(500).json(err);
    });
});

router.delete('/:idusuario/proyectosfavoritos/:idproyecto', verifyToken, function(req, res, next) {
  console.log('eliminarUsuarioProyectosFavoritos');
  controllerUsuarios
    .eliminarUsuarioProyectosFavoritos(req.params.idusuario, req.params.idproyecto)
    .then(function(proyectosfavoritos) {
      res.json(proyectosfavoritos);
    })
    .catch(function(err) {
      res.status(500).json(err);
    });
});

module.exports = router;
