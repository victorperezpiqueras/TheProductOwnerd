var ControllerUsuarios = {};
const connection = require('../db/connection');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

const controllerProyectos = require('../controllers/proyectos');
const controllerInvitaciones = require('../controllers/invitaciones');

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
ControllerUsuarios.getUsuario = function(id) {
  return new Promise(function(resolve, reject) {
    const sql = 'select * from usuarios where idusuario=?';
    connection.query(sql, [id], function(err, result) {
      if (err) {
        reject({ error: 'Error inesperado' });
      } else {
        console.log(result);
        resolve(result[0]);
      }
    });
  });
};
ControllerUsuarios.actualizarUsuario = function(usuario) {
  return new Promise(function(resolve, reject) {
    if (usuario.password != '') {
      var sql = 'update usuarios set nick=?,nombre=?,apellido1=?,apellido2=?,password=?,email=? where idusuario=?';
      var values = [
        usuario.nick,
        usuario.nombre,
        usuario.apellido1,
        usuario.apellido2,
        bcrypt.hashSync(usuario.password),
        usuario.email,
        usuario.idusuario
      ];
    } else {
      var sql = 'update usuarios set nick=?,nombre=?,apellido1=?,apellido2=?,email=? where idusuario=?';
      var values = [
        usuario.nick,
        usuario.nombre,
        usuario.apellido1,
        usuario.apellido2,
        usuario.email,
        usuario.idusuario
      ];
    }
    connection.query(sql, values, function(err, result) {
      if (err) throw err;
      console.log(result);
      resolve(result);
    });
  });
};
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
ControllerUsuarios.getUsuariosProyectosPermisos = function(id, idp) {
  return new Promise(function(resolve, reject) {
    const sql =
      //'select r2.permiso from proyectos p, usuarios u, roles r, rolespermisos r2  where u.idusuario = ? and p.idproyecto = ? and u.idusuario = r.idusuario and p.idproyecto = r.idproyecto and r2.idrol =r.idrol';
      'select r.ordenar, r.editarPBI,r.estimarTam, r.estimarValor, r.mantenerUsuarios, r.archivarProyecto, r.setDone, r.proyecciones, r.vision, r.sprintGoals from proyectos p, usuarios u, roles r where u.idusuario = ? and p.idproyecto = ? ' +
      'and u.idusuario = r.idusuario and p.idproyecto = r.idproyecto';
    connection.query(sql, [id, idp], function(err, result) {
      if (err) {
        reject({ error: 'Error inesperado' });
      } else {
        console.log(result[0]);
        resolve(result[0]);
      }
    });
  });
};
ControllerUsuarios.registroUsuario = function(usuario) {
  return new Promise(function(resolve, reject) {
    const sql = 'select * from usuarios where email = ?';
    connection.query(sql, [usuario.email], function(err, result) {
      if (err) {
        reject({ error: 'Error' });
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

ControllerUsuarios.registroUsuarioInvitar = function(data) {
  console.log('registroUsuarioInvitar', data);
  return new Promise(function(resolve, reject) {
    var idproyecto, rol, email;
    ControllerUsuarios.registroUsuario(data)
      .then(usuario => {
        /*  var sql = 'select * from usuarios where email = ? and nick = ?';
         connection.query(sql, [data.email, data.nick], function (err, result) {
           if (err) { reject({ error: 'error in select' }); }
           if (result[0]) { */
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

        /*   }
          reject({ error: "user not found" })
        }); */
      })
      .catch(err => {
        reject(err);
      });
  });
};

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
