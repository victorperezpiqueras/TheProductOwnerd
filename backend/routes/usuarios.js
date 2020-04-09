const express = require('express');
const router = express.Router();
const controllerUsuarios = require('../controllers/usuarios');
const verifyToken = require('../controllers/middleware');
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

router.get('/:id', verifyToken, function(req, res, next) {
  console.log('getUsuario');
  controllerUsuarios
    .getUsuario(req.params.id)
    .then(function(usuario) {
      res.json(usuario);
    })
    .catch(function(err) {
      res.status(500).json(err);
    });
});

router.put('/:id/actualizar', verifyToken, function(req, res, next) {
  console.log('actualizarUsuario');
  /* const data = {
     nick: req.body.nick, nombre: req.body.nombre, apellido1: req.body.apellido1,
     apellido2: req.body.apellido2, email: req.body.email, password: req.body.password, idusuario:req.body.idusuario
   };
    if (!data.nick || !data.nombre || !data.apellido1 || !data.apellido2 || !data.email || !data.password|| !data.idusuario) */
  if (!propertyChecker(req.body, ['nick', 'nombre', 'apellido1', 'apellido2', 'email', 'password', 'idusuario']))
    throw new ErrorHandler(
      422,
      'Missing required fields: nick, nombre, apellido1, apellido2, email, password, idusuario'
    );
  controllerUsuarios
    .actualizarUsuario(req.body)
    .then(function(usuario) {
      res.json(usuario);
    })
    .catch(function(err) {
      res.status(500).json(err);
    });
});

router.get('/:id/proyectos', verifyToken, function(req, res, next) {
  console.log('getUsuariosProyectos');
  controllerUsuarios
    .getUsuariosProyectos(req.params.id)
    .then(function(proyectos) {
      res.json(proyectos);
    })
    .catch(function(err) {
      res.status(500).json(err);
    });
});

router.get('/:id/proyectos/:idp/permisos', verifyToken, function(req, res, next) {
  console.log('getUsuariosProyectosPermisos');
  controllerUsuarios
    .getUsuariosProyectosPermisos(req.params.id, req.params.idp)
    .then(function(permisos) {
      res.json(permisos);
    })
    .catch(function(err) {
      res.status(500).json(err);
    });
});

router.post('/registro', function(req, res, next) {
  console.log('registro');
  /* const data = {
    nick: req.body.nick, nombre: req.body.nombre, apellido1: req.body.apellido1,
    apellido2: req.body.apellido2, email: req.body.email, password: req.body.password
  };
  if (!data.nick || !data.nombre || !data.apellido1 || !data.apellido2 || !data.email || !data.password) */
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
  /* const data = {
    nick: req.body.nick, nombre: req.body.nombre, apellido1: req.body.apellido1,
    apellido2: req.body.apellido2, email: req.body.email, password: req.body.password, token: req.body.token
  };
  if (!data.nick || !data.nombre || !data.apellido1 || !data.apellido2 || !data.email || !data.password || !data.token) */
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

module.exports = router;
