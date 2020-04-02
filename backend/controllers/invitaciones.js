var ControllerInvitaciones = {};
var connection = require('../db/connection');

ControllerInvitaciones.obtenerInvitacion = function(token) {
  console.log('obtenerInvitacion');
  return new Promise(function(resolve, reject) {
    var sql = 'select * from invitaciones where token=?';
    var array = [token];
    connection.query(sql, array, function(err, result) {
      if (err) {
        reject({ error: 'Error inesperado en obtenerInvitacion' });
      } else {
        console.log(result);
        resolve(result[0]);
      }
    });
  });
};
ControllerInvitaciones.crearInvitacion = function(invitacion) {
  console.log('crearInvitacion');
  return new Promise(function(resolve, reject) {
    console.log(invitacion.token);
    ControllerInvitaciones.borrarInvitacion(invitacion) //no es el mismo token
      .then(res => {
        var sql = 'insert into invitaciones(token,idproyecto, email, rol) values (?,?,?,?)';
        var array = [invitacion.token, invitacion.idproyecto, invitacion.email, invitacion.rol];
        connection.query(sql, array, function(err, result) {
          if (err) {
            reject({ error: 'Error inesperado en crearInvitacion' });
          } else {
            console.log(result);
            resolve(result);
          }
        });
        /*  resolve() */
      });
  });
};
ControllerInvitaciones.borrarInvitacion = function(invitacion) {
  return new Promise(function(resolve, reject) {
    var sql = 'delete from invitaciones where idproyecto=? and email=?';
    var array = [invitacion.idproyecto, invitacion.email];
    connection.query(sql, array, function(err, result) {
      if (err) {
        reject({ error: 'Error inesperado en borrarInvitacion' });
      } else {
        console.log(result);
        resolve(result);
      }
    });
  });
};

module.exports = ControllerInvitaciones;
