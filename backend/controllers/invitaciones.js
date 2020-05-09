var ControllerInvitaciones = {};
const connection = require('../db/connection');

/**
 * Crea una invitacion y borra otra si existiese para el email y proyecto dados
 * @param invitacion contiene los datos de la invitacion: token, idproyecto, email, rol
 */
ControllerInvitaciones.crearInvitacion = function(invitacion) {
  console.log('crearInvitacion');
  return new Promise(async function(resolve, reject) {
    console.log(invitacion.token);
    await ControllerInvitaciones.borrarInvitacion(invitacion);

    const sql = 'insert into invitaciones(token,idproyecto, email, rol) values (?,?,?,?)';
    const array = [invitacion.token, invitacion.idproyecto, invitacion.email, invitacion.rol];
    try {
      let insertion = await connection.query(sql, array);
      resolve(insertion[0]);
    } catch (error) {
      reject({ error: 'Error inesperado en crearInvitacion' });
    }
  });
};

/**
 * Borra una invitacion
 * @param invitacion contiene los datos de la invitacion: idproyecto, email
 */
ControllerInvitaciones.borrarInvitacion = function(invitacion) {
  return new Promise(async function(resolve, reject) {
    const sql = 'delete from invitaciones where idproyecto=? and email=?';
    const array = [invitacion.idproyecto, invitacion.email];
    try {
      let deletion = await connection.query(sql, array);
      resolve(deletion[0]);
    } catch (error) {
      reject({ error: 'Error inesperado en borrarInvitacion' });
    }
  });
};

/**
 * Obtiene una invitacion dado un token
 * @param {string} token token asignado a la invitacion
 */
ControllerInvitaciones.obtenerInvitacion = function(token) {
  console.log('obtenerInvitacion');
  return new Promise(async function(resolve, reject) {
    const sql = 'select * from invitaciones where token=?';
    const array = [token];
    try {
      let invitacion = await connection.query(sql, array);
      resolve(invitacion[0][0]);
    } catch (error) {
      reject({ error: 'Error inesperado en obtenerInvitacion' });
    }
  });
};

module.exports = ControllerInvitaciones;
