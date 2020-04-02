var express = require('express');
var router = express.Router();
var controllerUsuarios = require('../controllers/usuarios');

/* USUARIOS */
router.get('/', function(req, res, next) {
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

router.get('/:id', function(req, res, next) {
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

router.put('/:id/actualizar', function(req, res, next) {
  console.log('actualizarUsuario');
  controllerUsuarios
    .actualizarUsuario(req.body)
    .then(function(usuario) {
      res.json(usuario);
    })
    .catch(function(err) {
      res.status(500).json(err);
    });
});

router.get('/:id/proyectos', function(req, res, next) {
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

router.get('/:id/proyectos/:idp/permisos', function(req, res, next) {
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
  //        if(usuario.nombre && usuario.password && usuario.email){} EN EL FRONT
  controllerUsuarios
    .registroUsuario(req.body)
    .then(function(usuario) {
      res.json(usuario);
    })
    .catch(function(err) {
      res.status(500).json(err);
    });
});

router.post('/registro/invitar', function(req, res, next) {
  console.log('registroUsuarioInvitar');
  controllerUsuarios
    .registroUsuarioInvitar(req.body)
    .then(function(usuario) {
      res.json(usuario);
    })
    .catch(function(err) {
      res.status(500).json(err);
    });
});

router.post('/login', function(req, res, next) {
  console.log('login');
  console.log(req.body);
  controllerUsuarios
    .loginUsuario(req.body)
    .then(function(usuario) {
      res.json(usuario);
    })
    .catch(function(err) {
      res.status(500).json(err);
    });
});

module.exports = router;
