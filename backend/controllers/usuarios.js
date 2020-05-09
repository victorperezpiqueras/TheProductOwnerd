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
  return new Promise(async function(resolve, reject) {
    const sql = 'select * from usuarios';
    try {
      let usuarios = await connection.query(sql);
      resolve(usuarios[0]);
    } catch (error) {
      reject({ error: 'Error inesperado en getUsuarios' });
    }
  });
};

/**
 * Obtiene un usuario por el id
 * @param {number} idusuario id del usuario
 * @returns (idusuario, nombre, password, email, nick, apellido1, apellido2)
 */
ControllerUsuarios.getUsuario = function(idusuario) {
  return new Promise(async function(resolve, reject) {
    const sql = 'select * from usuarios where idusuario=?';
    const arr = [idusuario];
    try {
      let usuarios = await connection.query(sql, arr);
      resolve(usuarios[0][0]);
    } catch (error) {
      reject({ error: 'Error inesperado en getUsuario' });
    }
  });
};

/**
 * Actualiza los datos de un usuario
 * @param {number} idusuario id del usuario
 * @param data datos del usuario: nick, nombre, apellido1, apellido2, email
 */
ControllerUsuarios.actualizarUsuario = function(idusuario, data) {
  return new Promise(async function(resolve, reject) {
    var sql = 'update usuarios set nick=?,nombre=?,apellido1=?,apellido2=?,email=? where idusuario=?';
    var arr = [data.nick, data.nombre, data.apellido1, data.apellido2, data.email, idusuario];
    try {
      let update = await connection.query(sql, arr);
      resolve(update[0]);
    } catch (error) {
      reject({ error: 'Error inesperado en actualizarUsuario' });
    }
  });
};

/**
 * Actualiza la password de un usuario
 * @param {number} idusuario id del usuario
 * @param data datos del usuario: password, newPassword
 */
ControllerUsuarios.actualizarUsuarioPassword = function(idusuario, data) {
  return new Promise(async function(resolve, reject) {
    var sql = 'select * from usuarios where idusuario=?';
    var arr = [idusuario];
    var usuario;
    try {
      usuario = await connection.query(sql, arr);
      if (usuario[0].length <= 0) reject({ error: 'user_not_found' });
      else {
        if (!bcrypt.compareSync(data.password, usuario[0][0].password)) reject({ error: 'password_missmatch' });
        else {
          var sql = 'update usuarios set password=? where idusuario=?';
          var arr = [bcrypt.hashSync(data.newPassword), idusuario];
          let update = await connection.query(sql, arr);
          resolve(update[0]);
        }
      }
    } catch (error) {
      reject({ error: 'Error inesperado en actualizarUsuarioPassword' });
    }
  });
};

/**
 * Obtiene los proyectos de un usuario
 * @param {number} idusuario id del usuario
 * @returns [ {idproyecto, nombre, descripcion, sprintActual, vision} ]
 */
ControllerUsuarios.getUsuariosProyectos = function(idusuario) {
  return new Promise(async function(resolve, reject) {
    const sql =
      'select p.* from proyectos p, usuarios u, roles r where u.idusuario = ?' +
      ' and u.idusuario = r.idusuario and p.idproyecto = r.idproyecto';
    const arr = [idusuario];
    try {
      let proyectos = await connection.query(sql, arr);
      resolve(proyectos[0]);
    } catch (error) {
      reject({ error: 'Error inesperado en getUsuariosProyectos' });
    }
  });
};

/**
 * Obtiene los permisos de un usuario para un proyecto
 * @param {number} idusuario id del usuario
 * @param idproyecto id del proyecto
 */
ControllerUsuarios.getUsuariosProyectosPermisos = function(idusuario, idproyecto) {
  return new Promise(async function(resolve, reject) {
    const sql =
      //'select r2.permiso from proyectos p, usuarios u, roles r, rolespermisos r2  where u.idusuario = ? and p.idproyecto = ? and u.idusuario = r.idusuario and p.idproyecto = r.idproyecto and r2.idrol =r.idrol';
      'select r.ordenar, r.editarPBI,r.estimarTam, r.estimarValor, r.mantenerUsuarios, r.archivarProyecto, r.setDone,' +
      ' r.proyecciones, r.vision, r.sprintGoals from proyectos p, usuarios u, roles r where u.idusuario = ? and p.idproyecto = ? ' +
      'and u.idusuario = r.idusuario and p.idproyecto = r.idproyecto';
    const arr = [idusuario, idproyecto];
    try {
      let permisos = await connection.query(sql, arr);
      resolve(permisos[0][0]);
    } catch (error) {
      reject({ error: 'Error inesperado en getUsuariosProyectosPermisos' });
    }
  });
};

/**
 * Registra a un usuario
 * @param usuario datos del usuario: nick, nombre, apellido1, apellido2, password, email
 */
ControllerUsuarios.registroUsuario = function(usuario) {
  return new Promise(async function(resolve, reject) {
    var sql = 'select * from usuarios where email = ?';
    var arr = [usuario.email];
    try {
      let usuarioExistente = await connection.query(sql, arr);
      if (usuarioExistente[0].length <= 0) {
        var sql = 'insert into usuarios(nick,nombre,apellido1,apellido2,password,email) values (?,?,?,?,?,?)';
        var arr = [
          usuario.nick,
          usuario.nombre,
          usuario.apellido1,
          usuario.apellido2,
          bcrypt.hashSync(usuario.password),
          usuario.email
        ];
        let insertion = await connection.query(sql, arr);
        resolve(insertion[0]);
      } else {
        reject({ error: 'user_exists' });
      }
    } catch (error) {
      reject({ error: 'Error inesperado en registroUsuario' });
    }
  });
};

/**
 * Registra a un usuario por invitacion. Si el token es correcto, ademas lo agrega al proyecto especificado
 * @param usuario datos del usuario: token, nick, nombre, apellido1, apellido2, password, email
 */
ControllerUsuarios.registroUsuarioInvitar = function(data) {
  console.log('registroUsuarioInvitar', data);
  return new Promise(async function(resolve, reject) {
    ControllerUsuarios.registroUsuario(data) // ERROR EVITAR QUE HAGA REJECT 2 VECES EN JWTVERIFY Y EN EL CATCH
      .then(usuario => {
        jwt.verify(data.token, config.jwtKey, function(err, decoded) {
          if (err) reject({ error: 'token_authentication_failed' });
          else {
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
          }
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
  return new Promise(async function(resolve, reject) {
    const sql = 'select * from usuarios where email = ? ';
    const arr = [usuario.email];
    try {
      let usuariosExistentes = await connection.query(sql, arr);
      if (usuariosExistentes[0].length <= 0) {
        reject({ error: 'user_not_found' });
      } else if (!bcrypt.compareSync(usuario.password, usuariosExistentes[0][0].password)) {
        reject({ error: 'password_missmatch' });
      } else {
        const token = jwt.sign(
          { idusuario: usuariosExistentes[0][0].idusuario },
          config.jwtKey // , { expiresIn: config.expirationTime }
        );
        const credentials = {
          nick: usuariosExistentes[0][0].nick,
          idusuario: usuariosExistentes[0][0].idusuario,
          token: token
        };
        resolve(credentials);
      }
    } catch (error) {
      reject({ error: 'Error inesperado en loginUsuario' });
    }
  });
};

/**
 * Agrega un proyecto del usuario a sus favoritos
 * @param {number} idusuario id del usuario
 * @param data contiene el id del proyecto
 */
ControllerUsuarios.agregarUsuarioProyectosFavoritos = function(idusuario, data) {
  return new Promise(async function(resolve, reject) {
    const sql = 'insert into proyectosfavoritos(idusuario,idproyecto) values (?,?)';
    const arr = [idusuario, data.idproyecto];
    try {
      let insertion = await connection.query(sql, arr);
      resolve(insertion[0]);
    } catch (error) {
      reject({ error: 'Error inesperado en agregarUsuarioProyectosFavoritos' });
    }
  });
};

/**
 * Elimina un proyecto del usuario de sus favoritos
 * @param {number} idusuario id del usuario
 * @param {number} idproyecto id del proyecto
 */
ControllerUsuarios.eliminarUsuarioProyectosFavoritos = function(idusuario, idproyecto) {
  return new Promise(async function(resolve, reject) {
    const sql = 'delete from proyectosfavoritos where idusuario=? and idproyecto=?';
    const arr = [idusuario, idproyecto];
    try {
      let deletion = await connection.query(sql, arr);
      resolve(deletion[0]);
    } catch (error) {
      reject({ error: 'Error inesperado en eliminarUsuarioProyectosFavoritos' });
    }
  });
};

module.exports = ControllerUsuarios;
