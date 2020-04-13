const express = require('express');
const router = express.Router();

const controllerUsuarios = require('../controllers/usuarios');
const controllerProyectos = require('../controllers/proyectos');
const controllerPbis = require('../controllers/pbis');
const controllerComentarios = require('../controllers/comentarios');
const controllerArchivos = require('../controllers/archivos');
const controllerCriterios = require('../controllers/criterios');
const controllerDependencias = require('../controllers/dependencias');

/* USUARIOS */
const apiUsuarios = require('./usuarios');
router.use('/usuarios', apiUsuarios);

/* PROYECTOS */
const apiProyectos = require('./proyectos');
router.use('/proyectos', apiProyectos);

/* PBIS */
const apiPbis = require('./pbis');
router.use('/pbis', apiPbis);

/* COMENTARIOS */
const apiComentarios = require('./comentarios');
router.use('/comentarios', apiComentarios);

/* ARCHIVOS */
const apiArchivos = require('./archivos');
router.use('/archivos', apiArchivos);

/* CRITERIOS */
const apiCriterios = require('./criterios');
router.use('/criterios', apiCriterios);

/* DEPENDENCIAS */
const apiDependencias = require('./dependencias');
router.use('/dependencias', apiDependencias);

/* INVITACIONES */
const apiInvitaciones = require('./invitaciones');
router.use('/invitaciones', apiInvitaciones);

/* SPRINTGOALS */
const apiSprintGoals = require('./sprintgoals');
router.use('/sprintgoals', apiSprintGoals);

/* USUARIOS */
/* router.get('/usuarios', function(req, res, next) {
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

router.get('/usuarios/:id', function(req, res, next) {
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

router.put('/usuarios/:id/actualizar', function(req, res, next) {
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

router.get('/usuarios/:id/proyectos', function(req, res, next) {
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

router.get('/usuarios/:id/proyectos/:idp/permisos', function(req, res, next) {
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

router.post('/usuarios/registro', function(req, res, next) {
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

router.post('/usuarios/registro/invitar', function(req, res, next) {
  console.log('registroInvitar');
  controllerUsuarios
    .registroUsuarioInvitar(req.body)
    .then(function(usuario) {
      res.json(usuario);
    })
    .catch(function(err) {
      res.status(500).json(err);
    });
});

router.post('/usuarios/login', function(req, res, next) {
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
}); */

/* PROYECTOS */
/* router.get('/proyectos', function(req, res, next) {
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
router.get('/proyectos/:id', function(req, res, next) {
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

router.get('/proyectos/:id/usuarios', function(req, res, next) {
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

router.get('/proyectos/:id/usuarios/roles', function(req, res, next) {
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

router.get('/proyectos/:id/pbis', function(req, res, next) {
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

router.get('/proyectos/usuarios/roles', function(req, res, next) {
  console.log('getProyectosUsuariosRoles');
  controllerProyectos
    .getProyectosUsuariosRoles()
    .then(function(usuariosRoles) {
      res.json(usuariosRoles);
    })
    .catch(function(err) {
      res.status(500).json(err);
    });
});

router.post('/proyectos', function(req, res, next) {
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

router.post('/proyectos/:id/agregarUsuario', function(req, res, next) {
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

router.post('/proyectos/:id/invitar', function(req, res, next) {
  console.log('proyectoInvitarUsuario');
  controllerProyectos
    .proyectoInvitarUsuario(req.params.id, req.body)
    .then(function(proyecto) {
      res.json(proyecto);
    })
    .catch(function(err) {
      res.status(500).json(err);
    });
}); */

/* PBIS */
/* router.post('/pbis', function(req, res, next) {
  console.log('crearPbi');
  controllerPbis
    .crearPbi(req.body)
    .then(function(pbi) {
      res.json(pbi);
    })
    .catch(function(err) {
      res.status(500).json(err);
    });
});

router.put('/pbis/:id', function(req, res, next) {
  console.log('editarPbi');
  controllerPbis
    .editarPbi(req.params.id, req.body)
    .then(function(pbi) {
      res.json(pbi);
    })
    .catch(function(err) {
      res.status(500).json(err);
    });
});

router.put('/pbis', function(req, res, next) {
  console.log('editarPrioridadesPbis');
  controllerPbis
    .editarPrioridadesPbis(req.body)
    .then(function(pbis) {
      res.json(pbis);
    })
    .catch(function(err) {
      res.status(500).json(err);
    });
});

router.get('/pbis/:id/comentarios', function(req, res, next) {
  console.log('obtenerComentariosPbi');
  controllerComentarios
    .obtenerComentariosPbi(req.params.id)
    .then(function(comentarios) {
      res.json(comentarios);
    })
    .catch(function(err) {
      res.status(500).json(err);
    });
});

router.get('/pbis/:id/archivos', function(req, res, next) {
  console.log('obtenerArchivosPbi');
  controllerArchivos
    .obtenerArchivosPbi(req.params.id)
    .then(function(archivos) {
      res.json(archivos);
    })
    .catch(function(err) {
      res.status(500).json(err);
    });
});

router.get('/pbis/:id/criterios', function(req, res, next) {
  console.log('obtenerCriteriosPbi');
  controllerCriterios
    .obtenerCriteriosPbi(req.params.id)
    .then(function(criterios) {
      res.json(criterios);
    })
    .catch(function(err) {
      res.status(500).json(err);
    });
});

router.get('/pbis/:id/dependencias', function(req, res, next) {
  console.log('obtenerDependenciasPbi');
  controllerDependencias
    .obtenerDependenciasPbi(req.params.id)
    .then(function(dependencias) {
      res.json(dependencias);
    })
    .catch(function(err) {
      res.status(500).json(err);
    });
}); */

/* COMENTARIOS */
/* router.post('/comentarios', function(req, res, next) {
  console.log('crearComentario');
  controllerComentarios
    .crearComentario(req.body)
    .then(function(comentario) {
      res.json(comentario);
    })
    .catch(function(err) {
      res.status(500).json(err);
    });
}); */

/* ARCHIVOS */
/* router.post('/archivos', function(req, res, next) {
  console.log('crearArchivo');
  controllerArchivos
    .crearArchivo(req.body)
    .then(function(archivo) {
      res.json(archivo);
    })
    .catch(function(err) {
      res.status(500).json(err);
    });
});
router.delete('/archivos/:id', function(req, res, next) {
  console.log('borrarArchivo');
  controllerArchivos
    .borrarArchivo(req.params.id)
    .then(function(archivo) {
      res.json(archivo);
    })
    .catch(function(err) {
      res.status(500).json(err);
    });
}); */

/* CRITERIOS */
/* router.post('/criterios', function(req, res, next) {
  console.log('crearCriterio');
  controllerCriterios
    .crearCriterio(req.body)
    .then(function(criterio) {
      res.json(criterio);
    })
    .catch(function(err) {
      res.status(500).json(err);
    });
});
router.put('/criterios/:id', function(req, res, next) {
  console.log('actualizarCriterio');
  controllerCriterios
    .actualizarCriterio(req.params.id, req.body)
    .then(function(criterio) {
      res.json(criterio);
    })
    .catch(function(err) {
      res.status(500).json(err);
    });
});
router.delete('/criterios/:id', function(req, res, next) {
  console.log('borrarCriterio');
  controllerCriterios
    .borrarCriterio(req.params.id)
    .then(function(criterio) {
      res.json(criterio);
    })
    .catch(function(err) {
      res.status(500).json(err);
    });
}); */

/* DEPENDENCIAS */
/* router.post('/dependencias', function(req, res, next) {
  console.log('crearDependencia');
  controllerDependencias
    .crearDependencia(req.body)
    .then(function(dependencia) {
      res.json(dependencia);
    })
    .catch(function(err) {
      res.status(500).json(err);
    });
});
router.delete('/dependencias/:id/:id2', function(req, res, next) {
  console.log('borrarDependencia');
  controllerDependencias
    .borrarDependencia(req.params.id, req.params.id2)
    .then(function(dependencia) {
      res.json(dependencia);
    })
    .catch(function(err) {
      res.status(500).json(err);
    });
}); */

module.exports = router;
