var ControllerInvitaciones = {};
const connection = require('../db/connection');

/**
 * Obtiene una invitacion dado un token
 * @param token token asignado a la invitacion
 */
ControllerInvitaciones.obtenerInvitacion = function(token) {
  console.log('obtenerInvitacion');
  return new Promise(function(resolve, reject) {
    const sql = 'select * from invitaciones where token=?';
    const array = [token];
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

/**
 * Crea una invitacion
 * @param invitacion contiene los datos de la invitacion: token, idproyecto, email, rol
 */
ControllerInvitaciones.crearInvitacion = function(invitacion) {
  console.log('crearInvitacion');
  return new Promise(function(resolve, reject) {
    console.log(invitacion.token);
    ControllerInvitaciones.borrarInvitacion(invitacion) //no es el mismo token
      .then(res => {
        const sql = 'insert into invitaciones(token,idproyecto, email, rol) values (?,?,?,?)';
        const array = [invitacion.token, invitacion.idproyecto, invitacion.email, invitacion.rol];
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

/**
 * Borra una invitacion
 * @param invitacion contiene los datos de la invitacion: idproyecto, email
 */
ControllerInvitaciones.borrarInvitacion = function(invitacion) {
  return new Promise(function(resolve, reject) {
    const sql = 'delete from invitaciones where idproyecto=? and email=?';
    const array = [invitacion.idproyecto, invitacion.email];
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
