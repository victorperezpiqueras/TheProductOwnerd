const jwt = require('jsonwebtoken');
const config = require('../config/config');
const controllerProyectos = require('../controllers/proyectos');

/**
 * Verifica que el usuario tiene permisos en el proyecto
 */
async function verifyProjectPermissions(req, res, next) {
  console.log(req.body);
  console.log('verifyProjectPermissions');
  let token = req.headers.authorization.split(' ')[1];
  let payload = jwt.verify(token, config.jwtKey);

  let idusuario = payload.idusuario;
  let idproyecto = req.params.idproyecto;
  // let idproyecto = req.params.idproyecto | req.body.idproyecto;
  // agregar idproyecto en todas las peticiones que modifiquen elementos de un proyecto->create,update,delete comentarios,dependencias,etc

  let allowed = await controllerProyectos.checkProyectoTieneUsuario(idproyecto, idusuario);
  if (!allowed) return res.status(401).json({ error: 'unauthorized_access_to_project' });

  next();
}

module.exports = verifyProjectPermissions;
