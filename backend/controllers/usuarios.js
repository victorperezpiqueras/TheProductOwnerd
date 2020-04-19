var ControllerUsuarios = {};
const connection = require('../db/connection');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

const controllerProyectos = require('../controllers/proyectos');
const controllerInvitaciones = require('../controllers/invitaciones');

/**
 * Obtiene todos los usuarios
 */
ControllerUsuarios.getUsuarios = function() {
  return new Promise(function(resolve, reject) {
    const sql = 'select * from usuarios';
    connection.query(sql, function(err, result) {
      if (err) {
        reject({ error: 'Error inesperado' });
      } else {
        console.log(result);
        resolve(result);
      }
    });
  });
};

/**
 * Obtiene un usuario por el id
 * @param id id del usuario
 * @returns (idusuario, nombre, password, email, nick, apellido1, apellido2)
 */
ControllerUsuarios.getUsuario = function(id) {
  return new Promise(function(resolve, reject) {
    const sql = 'select * from usuarios where idusuario=?';
    connection.query(sql, [id], function(err, result) {
      if (err) {
        reject({ error: 'Error inesperado en getUsuario' });
      } else {
        console.log(result);
        resolve(result[0]);
      }
    });
  });
};

/**
 * Actualiza los datos de un usuario
 * @param idusuario id del usuario
 * @param data datos del usuario: nick, nombre, apellido1, apellido2, email
 */
ControllerUsuarios.actualizarUsuario = function(idusuario, data) {
  return new Promise(function(resolve, reject) {
    var sql = 'update usuarios set nick=?,nombre=?,apellido1=?,apellido2=?,email=? where idusuario=?';
    var values = [data.nick, data.nombre, data.apellido1, data.apellido2, data.email, idusuario];
    connection.query(sql, values, function(err, result) {
      if (err) throw err;
      console.log(result);
      resolve(result);
    });
  });
};

/**
 * Actualiza la password de un usuario
 * @param idusuario id del usuario
 * @param data datos del usuario: password, newPassword
 */
ControllerUsuarios.actualizarUsuarioPassword = function(idusuario, data) {
  return new Promise(function(resolve, reject) {
    var sql = 'select * from usuarios where idusuario=?';
    var values = [idusuario];
    connection.query(sql, values, function(err, result) {
      if (err) throw err;
      console.log(result);
      if (result.length <= 0) reject({ error: 'user_not_found' });
      else {
        console.log(result[0].password);
        console.log(bcrypt.hashSync(data.password));
        if (!bcrypt.compareSync(data.password, result[0].password)) reject({ error: 'password_missmatch' });
        else {
          var sql = 'update usuarios set password=? where idusuario=?';
          var values = [bcrypt.hashSync(data.newPassword), idusuario];
          connection.query(sql, values, function(err, result) {
            if (err) throw err;
            console.log(result);
            resolve(result);
          });
        }
      }
    });
  });
};

/**
 * Obtiene los proyectos de un usuario
 * @param id id del usuario
 * @returns [ {idproyecto, nombre, descripcion} ]
 */
ControllerUsuarios.getUsuariosProyectos = function(id) {
  return new Promise(function(resolve, reject) {
    const sql =
      'select p.idproyecto, p.nombre, p.descripcion from proyectos p, usuarios u, roles r where u.idusuario = ? and u.idusuario = r.idusuario and p.idproyecto = r.idproyecto';
    connection.query(sql, [id], function(err, result) {
      if (err) {
        reject({ error: 'Error inesperado' });
      } else {
        console.log(result);
        resolve(result);
      }
    });
  });
};

/**
 * Obtiene los permisos de un usuario para un proyecto
 * @param id id del usuario
 * @param idproyecto id del proyecto
 */
ControllerUsuarios.getUsuariosProyectosPermisos = function(id, idproyecto) {
  return new Promise(function(resolve, reject) {
    const sql =
      //'select r2.permiso from proyectos p, usuarios u, roles r, rolespermisos r2  where u.idusuario = ? and p.idproyecto = ? and u.idusuario = r.idusuario and p.idproyecto = r.idproyecto and r2.idrol =r.idrol';
      'select r.ordenar, r.editarPBI,r.estimarTam, r.estimarValor, r.mantenerUsuarios, r.archivarProyecto, r.setDone, r.proyecciones, r.vision, r.sprintGoals from proyectos p, usuarios u, roles r where u.idusuario = ? and p.idproyecto = ? ' +
      'and u.idusuario = r.idusuario and p.idproyecto = r.idproyecto';
    connection.query(sql, [id, idproyecto], function(err, result) {
      if (err) {
        reject({ error: 'Error inesperado' });
      } else {
        console.log(result[0]);
        resolve(result[0]);
      }
    });
  });
};

/**
 * Registra a un usuario
 * @param usuario datos del usuario: nick, nombre, apellido1, apellido2, password, email
 */
ControllerUsuarios.registroUsuario = function(usuario) {
  return new Promise(function(resolve, reject) {
    const sql = 'select * from usuarios where email = ?';
    connection.query(sql, [usuario.email], function(err, result) {
      if (err) {
        reject({ error: 'Error inesperado en registroUsuario' });
      } else {
        console.log(result);
        if (result.length <= 0) {
          const sql = 'insert into usuarios(nick,nombre,apellido1,apellido2,password,email) values (?,?,?,?,?,?)';
          const values = [
            usuario.nick,
            usuario.nombre,
            usuario.apellido1,
            usuario.apellido2,
            bcrypt.hashSync(usuario.password),
            usuario.email
          ];
          connection.query(sql, values, function(err, result) {
            if (err) throw err;
            console.log(result);
            resolve(result);
          });
        } else {
          reject({ error: 'user_exists' });
        }
      }
    });
  });
};

/**
 * Registra a un usuario por invitacion. Si el token es correcto, ademas lo agrega al proyecto especificado
 * @param usuario datos del usuario: token, nick, nombre, apellido1, apellido2, password, email
 */
ControllerUsuarios.registroUsuarioInvitar = function(data) {
  console.log('registroUsuarioInvitar', data);
  return new Promise(function(resolve, reject) {
    var idproyecto, rol, email;
    ControllerUsuarios.registroUsuario(data)
      .then(usuario => {
        jwt.verify(data.token, config.jwtKey, function(err, decoded) {
          if (err) reject({ error: 'token_authentication_failed' });
          controllerInvitaciones.obtenerInvitacion(data.token).then(result => {
            if (result != null) {
              idproyecto = decoded.idproyecto;
              rol = decoded.rol;
              email = decoded.email;
              const dataProy = { rol: rol, idusuario: usuario.insertId };
              console.log(dataProy);
              controllerProyectos
                .proyectoAgregarUsuario(idproyecto, dataProy)
                .then(data => {
                  return controllerInvitaciones.borrarInvitacion({ idproyecto: idproyecto, email: email });
                })
                .then(data => {
                  console.log(data);
                  resolve(data);
                })
                .catch(err => {
                  console.log(err);
                  reject(err);
                });
            } else reject({ error: 'invitation_expired' });
          });
        });
      })
      .catch(err => {
        reject(err);
      });
  });
};

/**
 * Loguea a un usuario y le devuelve un token con sus credenciales
 * @param usuario datos del usuario: email, password
 * @returns credentials: { nick, idusuario, token }
 */
ControllerUsuarios.loginUsuario = function(usuario) {
  return new Promise(function(resolve, reject) {
    const sql = 'select * from usuarios where email = ? ';
    connection.query(sql, [usuario.email], function(err, result) {
      console.log(result);
      if (err) {
        reject({ error: 'Error inesperado en loginUsuario' });
      } else {
        if (result.length <= 0) {
          reject({ error: 'user_not_found' });
        } else if (!bcrypt.compareSync(usuario.password, result[0].password)) {
          reject({ error: 'password_missmatch' });
        } else {
          const token = jwt.sign(
            { idusuario: result[0].idusuario },
            config.jwtKey /* , { expiresIn: config.expirationTime } */
          ); //////////////////
          const credentials = {
            nick: result[0].nick,
            idusuario: result[0].idusuario,
            token: token
          };
          resolve(credentials);
        }
      }
    });
  });
};

/**
 * Obtiene los proyectos favoritos de un usuario
 * @param idusuario id del usuario
 * @returns [ {idproyecto, idusuario, nombre} ]
 */
ControllerUsuarios.getUsuarioProyectosFavoritos = function(idusuario) {
  return new Promise(function(resolve, reject) {
    const sql =
      'select pr.*, p.nombre from proyectosfavoritos pr, proyectos p where idusuario=? and pr.idproyecto=p.idproyecto';
    connection.query(sql, [idusuario], function(err, result) {
      if (err) {
        reject({ error: 'Error inesperado en getUsuarioProyectosFavoritos' });
      } else {
        console.log(result);
        resolve(result);
      }
    });
  });
};

/**
 * Agrega un proyecto del usuario a sus favoritos
 * @param idusuario id del usuario
 * @param data contiene el id del proyecto
 */
ControllerUsuarios.agregarUsuarioProyectosFavoritos = function(idusuario, data) {
  return new Promise(function(resolve, reject) {
    const sql = 'insert into proyectosfavoritos(idusuario,idproyecto) values (?,?)';
    connection.query(sql, [idusuario, data.idproyecto], function(err, result) {
      if (err) {
        reject({ error: 'Error inesperado en agregarUsuarioProyectosFavoritos' });
      } else {
        console.log(result);
        resolve(result);
      }
    });
  });
};

/**
 * Elimina un proyecto del usuario de sus favoritos
 * @param idusuario id del usuario
 * @param idproyecto id del proyecto
 */
ControllerUsuarios.eliminarUsuarioProyectosFavoritos = function(idusuario, idproyecto) {
  return new Promise(function(resolve, reject) {
    const sql = 'delete from proyectosfavoritos where idusuario=? and idproyecto=?';
    connection.query(sql, [idusuario, idproyecto], function(err, result) {
      if (err) {
        reject({ error: 'Error inesperado en eliminarUsuarioProyectosFavoritos' });
      } else {
        console.log(result);
        resolve(result);
      }
    });
  });
};

module.exports = ControllerUsuarios;
