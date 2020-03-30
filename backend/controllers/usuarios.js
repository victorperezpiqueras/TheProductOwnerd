var ControllerUsuarios = {};
var connection = require('../db/connection');
var bcrypt = require('bcryptjs');
var mysql = require('mysql');
var controllerProyectos = require('../controllers/proyectos');

ControllerUsuarios.getUsuarios = function() {
  return new Promise(function(resolve, reject) {
    var sql = 'select * from usuarios';
    connection.query(sql, function(err, result) {
      if (err) {
        /* connection.end(function(err) {
          console.log('Error DB');
        }); */
        reject({ error: 'Error inesperado' });
      } else {
        console.log(result);
        /* connection.end(function(err) {
          console.log('Close the database connection.');
        }); */
        resolve(result);
      }
    });
  });
};
ControllerUsuarios.getUsuario = function(id) {
  return new Promise(function(resolve, reject) {
    var sql = 'select * from usuarios where idusuario=?';
    connection.query(sql, [id], function(err, result) {
      if (err) {
        /* connection.end(function(err) {
          console.log('Error DB');
        }); */
        reject({ error: 'Error inesperado' });
      } else {
        console.log(result);
        /* connection.end(function(err) {
          console.log('Close the database connection.');
        }); */
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
    var sql =
      'select p.idproyecto, p.nombre, p.descripcion from proyectos p, usuarios u, roles r where u.idusuario = ? and u.idusuario = r.idusuario and p.idproyecto = r.idproyecto';
    connection.query(sql, [id], function(err, result) {
      if (err) {
        /* connection.end(function(err) {
          console.log('Error DB');
        }); */
        reject({ error: 'Error inesperado' });
      } else {
        console.log(result);
        /* connection.end(function(err) {
          console.log('Close the database connection.');
        }); */
        resolve(result);
      }
    });
  });
};
ControllerUsuarios.getUsuariosProyectosPermisos = function(id, idp) {
  return new Promise(function(resolve, reject) {
    var sql =
      //'select r2.permiso from proyectos p, usuarios u, roles r, rolespermisos r2  where u.idusuario = ? and p.idproyecto = ? and u.idusuario = r.idusuario and p.idproyecto = r.idproyecto and r2.idrol =r.idrol';
      'select ordenar, editarPBI,estimarTam,estimarValor, mantenerUsuarios, archivarProyecto, setDone, proyecciones from proyectos p, usuarios u, roles r where u.idusuario = ? and p.idproyecto = ? ' +
      'and u.idusuario = r.idusuario and p.idproyecto = r.idproyecto';
    connection.query(sql, [id, idp], function(err, result) {
      if (err) {
        /*  connection.end(function(err) {
          console.log('Error DB');
        }); */
        reject({ error: 'Error inesperado' });
      } else {
        console.log(result[0]);
        /* connection.end(function(err) {
          console.log('Close the database connection.');
        }); */
        resolve(result[0]);
      }
    });
  });
};
ControllerUsuarios.registroUsuario = function(usuario) {
  return new Promise(function(resolve, reject) {
    var sql = 'select * from usuarios where email = ?';
    connection.query(sql, [usuario.email], function(err, result) {
      if (err) {
        /* connection.end(function(err) {
          console.log('Error DB');
        }); */
        reject({ error: 'Error' });
      } else {
        console.log(result);
        if (result.length <= 0) {
          var sql = 'insert into usuarios(nick,nombre,apellido1,apellido2,password,email) values (?,?,?,?,?,?)';
          var values = [
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
            /* connection.end(function(err) {
              console.log('Error DB');
            }); */
            resolve(result);
          });
        } else {
          /*  connection.end(function(err) {
            console.log('Close the database connection.');
          }); */
          reject({ error: 'Usuario ya existente' });
        }
      }
    });
  });
};

ControllerUsuarios.registroUsuarioInvitar = function(data) {
  console.log('registroUsuarioInvitar', data);
  return new Promise(function(resolve, reject) {
    ControllerUsuarios.registroUsuario(data)
      .then(usuario => {
        /* obtener el id del usuario */
        var sql = 'select * from usuarios where email = ? and nick = ?';
        connection.query(sql, [data.email, data.nick], function(err, result) {
          if (err) {
            reject({ error: 'Error' });
          } else {
            if (result[0]) {
              const dataProy = { rol: 'desarrollador', idusuario: result[0].idusuario };
              console.log(dataProy);
              return controllerProyectos.proyectoAgregarUsuario(data.idproyecto, dataProy);
            }
          }
        });
      })
      .then(data => {
        console.log(data);
        resolve(data);
      })
      .catch(err => {
        console.log(err);
      });
  });
};

ControllerUsuarios.loginUsuario = function(usuario) {
  return new Promise(function(resolve, reject) {
    var sql = 'select * from usuarios where nick = ? ';
    connection.query(sql, [usuario.nick], function(err, result) {
      console.log(result);
      if (err) {
        /* connection.end(function(err) {
          console.log('Error DB');
        }); */
        reject({ error: 'Error inesperado' });
      } else {
        if (result.length <= 0) {
          /* connection.end(function(err) {
            console.log('Close the database connection.');
          }); */
          reject({ error: 'El usuario no existe' });
        } else if (!bcrypt.compareSync(usuario.password, result[0].password)) {
          /* connection.end(function(err) {
            console.log('Close the database connection.');
          }); */
          reject({ error: 'Las contraseñas no coinciden' });
        } else {
          /*  connection.end(function(err) {
            console.log('Close the database connection.');
          }); */
          resolve(result);
        }
      }
    });
  });
};

module.exports = ControllerUsuarios;
